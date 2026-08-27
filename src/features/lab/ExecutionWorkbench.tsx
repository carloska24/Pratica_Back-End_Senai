"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Braces,
  Code2,
  Gauge,
  Layers3,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import type {
  ExecutionTrace,
  TraceOperation,
  VariableSnapshot,
} from "../../interpreter/contracts";
import { explainSnapshot } from "../../interpreter/pedagogy";
import type { LabModuleId } from "../../runner/contracts";
import { tutorResponseSchema, type TutorResponse } from "../../tutor/schemas";
import { buildSnapshotTutorRequest } from "./tutorPayload";
import { highlightJavaScript, type HighlightedCodeLine } from "./shikiHighlighter";
import { tokenizeJavaScriptLine } from "./syntaxTokens";
import styles from "./ExecutionWorkbench.module.css";

type ExecutionWorkbenchProps = {
  trace: ExecutionTrace;
  code: string;
  moduleId?: LabModuleId;
  onExit?: () => void;
};

type InspectorTab = "code" | "state" | "stack" | "output";
type PlaybackSpeed = "0.5" | "1" | "2";

const operationLabels: Record<TraceOperation, string> = {
  start: "preparação",
  declare: "declaração",
  call: "chamada",
  condition: "condição",
  loop: "iteração",
  return: "retorno",
  assign: "atribuição",
  console: "saída",
  complete: "conclusão",
  error: "erro",
};

const tabLabels: Record<InspectorTab, string> = {
  code: "Código",
  state: "Estado",
  stack: "Pilha",
  output: "Saída",
};

const playbackDelay: Record<PlaybackSpeed, number> = {
  "0.5": 1600,
  "1": 900,
  "2": 450,
};

function variableKey(variable: VariableSnapshot) {
  return `${variable.scope}:${variable.name}`;
}

function sourceLines(code: string) {
  const lines = code.split(/\r?\n/);
  return lines.length ? lines : [""];
}

function formatOperation(operation: TraceOperation) {
  return operationLabels[operation].toLocaleUpperCase("pt-BR");
}

export function ExecutionWorkbench({ trace, code, moduleId, onExit }: ExecutionWorkbenchProps) {
  const [snapshotIndex, setSnapshotIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>("1");
  const [activeTab, setActiveTab] = useState<InspectorTab>("code");
  const [mobilePanels, setMobilePanels] = useState(false);
  const [tutorResult, setTutorResult] = useState<{ step: number; response: TutorResponse } | null>(null);
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorError, setTutorError] = useState<string | null>(null);
  const [highlightedLines, setHighlightedLines] = useState<HighlightedCodeLine[] | null>(null);
  const snapshots = trace.snapshots;
  const workbenchRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLOListElement>(null);
  const tutorAbort = useRef<AbortController | null>(null);
  const lastIndex = Math.max(0, snapshots.length - 1);
  const snapshot = snapshots[Math.min(snapshotIndex, lastIndex)];
  const lines = useMemo(() => sourceLines(code), [code]);
  const hasPrevious = snapshotIndex > 0;
  const hasNext = snapshotIndex < lastIndex;

  useEffect(() => {
    setSnapshotIndex(current => Math.min(current, lastIndex));
  }, [lastIndex]);

  useEffect(() => {
    let current = true;
    setHighlightedLines(null);
    highlightJavaScript(code)
      .then(result => { if (current) setHighlightedLines(result); })
      .catch(() => { if (current) setHighlightedLines(null); });
    return () => { current = false; };
  }, [code]);

  useEffect(() => {
    if (!playing || !hasNext) {
      if (playing && !hasNext) setPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setSnapshotIndex(current => Math.min(current + 1, lastIndex));
    }, playbackDelay[speed]);

    return () => window.clearTimeout(timer);
  }, [hasNext, lastIndex, playing, snapshotIndex, speed]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  useEffect(() => () => tutorAbort.current?.abort(), []);

  useEffect(() => {
    workbenchRef.current?.focus();
    const query = window.matchMedia?.("(max-width: 720px)");
    if (!query) return;
    const update = () => setMobilePanels(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    timelineRef.current?.querySelector<HTMLElement>("[aria-current='step']")?.scrollIntoView?.({ block: "nearest", inline: "center" });
  }, [snapshotIndex]);

  useEffect(() => {
    if (playing && ["call", "condition", "loop", "return", "console", "error"].includes(snapshot?.operation ?? "")) setPlaying(false);
  }, [playing, snapshot?.operation]);

  if (!snapshot) {
    return (
      <section className={styles.empty} aria-labelledby="execution-workbench-title">
        <h2 id="execution-workbench-title">Bancada de Execução</h2>
        {trace.error
          ? <p role="alert">A execução não pôde ser preparada: {trace.error.message}</p>
          : <p role="status">A trilha ainda não possui passos para investigar.</p>}
        {onExit ? <button type="button" onClick={onExit}>Sair da bancada</button> : null}
      </section>
    );
  }

  const jumpTo = (index: number) => {
    setPlaying(false);
    setSnapshotIndex(index);
    setTutorError(null);
  };

  const requestTutor = async () => {
    if (!moduleId || tutorLoading) return;
    tutorAbort.current?.abort();
    const controller = new AbortController();
    tutorAbort.current = controller;
    setTutorLoading(true);
    setTutorError(null);
    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(buildSnapshotTutorRequest(moduleId, code, snapshot, trace)),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error("O Tutor não conseguiu aprofundar este passo.");
      const parsed = tutorResponseSchema.safeParse(body);
      if (!parsed.success) throw new Error("O Tutor devolveu uma explicação fora do formato seguro.");
      if (!controller.signal.aborted) setTutorResult({ step: snapshot.step, response: parsed.data });
    } catch (error) {
      if (!controller.signal.aborted) setTutorError(error instanceof Error ? error.message : "O Tutor está indisponível agora.");
    } finally {
      if (tutorAbort.current === controller) {
        tutorAbort.current = null;
        setTutorLoading(false);
      }
    }
  };

  const selectTab = (tab: InspectorTab) => {
    setActiveTab(tab);
    document.getElementById(`execution-tab-${tab}`)?.focus();
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, tab: InspectorTab) => {
    const tabs = Object.keys(tabLabels) as InspectorTab[];
    const currentIndex = tabs.indexOf(tab);
    let nextTab: InspectorTab | undefined;

    if (event.key === "ArrowRight") nextTab = tabs[(currentIndex + 1) % tabs.length];
    if (event.key === "ArrowLeft") nextTab = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
    if (event.key === "Home") nextTab = tabs[0];
    if (event.key === "End") nextTab = tabs[tabs.length - 1];

    if (nextTab) {
      event.preventDefault();
      selectTab(nextTab);
    }
  };

  const beforeByKey = new Map(snapshot.variablesBefore.map(variable => [variableKey(variable), variable]));
  const afterByKey = new Map(snapshot.variablesAfter.map(variable => [variableKey(variable), variable]));
  const variableKeys = Array.from(new Set([...beforeByKey.keys(), ...afterByKey.keys()]));
  const resultText = snapshot.expression?.result.display;
  const teacher = explainSnapshot(snapshot);
  const nextDestination = snapshot.effect?.nextLine ? `Linha ${snapshot.effect.nextLine}` : "Fim deste passo";
  const statusText = `Passo ${snapshotIndex + 1} de ${snapshots.length}: ${operationLabels[snapshot.operation]}. ${playing ? "Em reprodução" : "Pausado"}.`;

  return (
    <section ref={workbenchRef} tabIndex={-1} className={styles.workbench} aria-labelledby="execution-workbench-title">
      <header className={styles.header}>
        <div className={styles.identity}>
          <span className={styles.identityMark} aria-hidden="true"><BookOpenCheck /></span>
          <div>
            <span className={styles.eyebrow}>LOUSA DIDÁTICA · EVIDÊNCIA LOCAL</span>
            <h2 id="execution-workbench-title">Bancada de Execução</h2>
            <p>Investigue como o JavaScript percorre o código, um passo de cada vez.</p>
          </div>
        </div>
        <div className={styles.headerMeta}>
          <span><b>Snapshot</b> {String(snapshot.step).padStart(2, "0")}</span>
          <span className={styles.localBadge}>● Execução local</span>
          {onExit ? (
            <button className={styles.exitButton} type="button" onClick={onExit} aria-label="Sair da bancada">
              <X aria-hidden="true" /> <span>Sair</span>
            </button>
          ) : null}
        </div>
      </header>

      <div className={styles.stickyNavigation} aria-label="Navegação persistente da execução">
        <div className={styles.controlsRegion} aria-label="Controles da execução">
          <div className={styles.stepHeading}>
            <span>PASSO ATUAL</span>
            <strong>{String(snapshotIndex + 1).padStart(2, "0")} / {String(snapshots.length).padStart(2, "0")}</strong>
          </div>
          <div className={styles.controls}>
            <button type="button" onClick={() => jumpTo(0)} disabled={!hasPrevious} aria-label="Reiniciar execução">
              <RotateCcw aria-hidden="true" /><span>Reiniciar</span>
            </button>
            <button type="button" onClick={() => jumpTo(snapshotIndex - 1)} disabled={!hasPrevious} aria-label="Passo anterior">
              <ArrowLeft aria-hidden="true" /><span>Anterior</span>
            </button>
            <button
              className={styles.playButton}
              type="button"
              onClick={() => setPlaying(current => !current)}
              disabled={!hasNext && !playing}
              aria-label={playing ? "Pausar execução" : "Reproduzir execução"}
              aria-pressed={playing}
            >
              {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              <span>{playing ? "Pausar" : "Reproduzir"}</span>
            </button>
            <button className={styles.nextButton} type="button" onClick={() => jumpTo(snapshotIndex + 1)} disabled={!hasNext} aria-label="Próximo passo">
              <span>Próximo</span><ArrowRight aria-hidden="true" />
            </button>
            <label className={styles.speedControl}>
              <Gauge aria-hidden="true" />
              <span className={styles.srOnly}>Velocidade da reprodução</span>
              <select value={speed} onChange={event => setSpeed(event.target.value as PlaybackSpeed)} aria-label="Velocidade da reprodução">
                <option value="0.5">0,5×</option>
                <option value="1">1×</option>
                <option value="2">2×</option>
              </select>
            </label>
          </div>
          <p className={styles.srOnly} role="status" aria-live={playing ? "off" : "polite"} aria-atomic="true">{statusText}</p>
        </div>

        <nav className={styles.timeline} aria-label="Timeline da execução">
          <ol ref={timelineRef}>
            {snapshots.map((item, index) => (
              <li key={`${item.step}-${item.operation}-${index}`}>
                <button
                  type="button"
                  onClick={() => jumpTo(index)}
                  className={index === snapshotIndex ? styles.timelineActive : undefined}
                  aria-current={index === snapshotIndex ? "step" : undefined}
                  aria-label={`Passo ${index + 1}: ${operationLabels[item.operation]}`}
                  tabIndex={index === snapshotIndex ? 0 : -1}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <small>{operationLabels[item.operation]}</small>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <section className={styles.nowStrip} aria-labelledby="professor-now-title">
        <div className={styles.nowMarker} aria-hidden="true">{String(snapshot.step).padStart(2, "0")}</div>
        <div className={styles.nowTeaching}>
          <span className={styles.eyebrow}>PROFESSOR AGORA · {formatOperation(snapshot.operation)}</span>
          <h3 id="professor-now-title">{teacher.title}</h3>
          <p className={styles.equation}>
            <code>{snapshot.expression?.substituted ?? teacher.evidence}</code>
            {snapshot.expression ? <><span aria-hidden="true">→</span><strong>{resultText}</strong></> : null}
          </p>
          <p className={styles.teacherExplanation}>{teacher.explanation}</p>
          <p className={styles.teacherPrompt}><strong>{teacher.prompt}</strong></p>
          {moduleId ? <button className={styles.tutorButton} type="button" onClick={requestTutor} disabled={tutorLoading} aria-label="Aprofundar este passo com o Tutor"><Sparkles aria-hidden="true"/>{tutorLoading ? "Preparando explicação…" : "Aprofundar este passo"}</button> : null}
        </div>
        <dl className={styles.nextStep}>
          <div><dt>Linha</dt><dd>{snapshot.line}</dd></div>
          <div><dt>Próximo destino</dt><dd>{nextDestination}</dd></div>
        </dl>
      </section>

      {tutorError ? <div className={styles.errorBanner} role="alert">{tutorError}</div> : null}
      {tutorResult?.step === snapshot.step ? (
        <section className={styles.tutorPanel} aria-labelledby="snapshot-tutor-title" aria-live="polite">
          <div><span className={styles.eyebrow}>TUTOR · {tutorResult.response.provider === "openai" ? "IA CONECTADA" : "EXPLICAÇÃO LOCAL"}</span><h3 id="snapshot-tutor-title">{tutorResult.response.title}</h3></div>
          <p>{tutorResult.response.overview}</p>
          {tutorResult.response.walkthrough.slice(0, 3).map((item, index) => <article key={`${item.title}-${index}`}><b>{String(index + 1).padStart(2, "0")} · {item.title}</b><p>{item.explanation}</p></article>)}
          <strong>Próximo experimento: {tutorResult.response.nextStep}</strong>
        </section>
      ) : null}

      {snapshot.operation === "error" || trace.error ? (
        <div className={styles.errorBanner} role="alert">
          <strong>Execução interrompida.</strong> {trace.error?.message ?? snapshot.effect?.summary}
          {onExit ? <button type="button" onClick={onExit}>Corrigir no editor</button> : null}
        </div>
      ) : null}

      <div className={styles.mobileTabs} role={mobilePanels ? "tablist" : undefined} aria-label={mobilePanels ? "Detalhes da execução" : undefined}>
        {(Object.keys(tabLabels) as InspectorTab[]).map(tab => (
          <button
            key={tab}
            id={`execution-tab-${tab}`}
            type="button"
            role={mobilePanels ? "tab" : undefined}
            aria-selected={mobilePanels ? activeTab === tab : undefined}
            aria-controls={mobilePanels ? `execution-panel-${tab}` : undefined}
            tabIndex={mobilePanels ? (activeTab === tab ? 0 : -1) : -1}
            onClick={() => setActiveTab(tab)}
            onKeyDown={event => handleTabKeyDown(event, tab)}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <section
          id="execution-panel-code"
          className={`${styles.panel} ${styles.codePanel}`}
          role={mobilePanels ? "tabpanel" : undefined}
          aria-labelledby={mobilePanels ? "execution-tab-code" : undefined}
          aria-label="Código"
          data-mobile-active={activeTab === "code"}
        >
          <header className={styles.panelHeader}>
            <div><Code2 aria-hidden="true" /><span>CÓDIGO · SNAPSHOT {String(snapshot.step).padStart(2, "0")}</span></div>
            <span>Linha {snapshot.line}</span>
          </header>
          <pre className={styles.code} aria-label={`Código com a linha ${snapshot.line} ativa`} data-highlighter={highlightedLines ? "shiki" : "fallback"}>
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const active = lineNumber === snapshot.line;
              const grammarTokens = highlightedLines?.[index];
              return (
                <code key={lineNumber} className={styles.codeLine} data-active={active} data-testid={`code-line-${lineNumber}`}>
                  <span className={styles.gutter}>{active ? "▶" : ""}<span>{lineNumber}</span></span>
                  <span>{grammarTokens
                    ? grammarTokens.map((token, tokenIndex) => <span key={`${token.text}-${tokenIndex}`} style={token.color ? { color: token.color } : undefined}>{token.text}</span>)
                    : tokenizeJavaScriptLine(line).map((token, tokenIndex) => token.kind === "plain"
                      ? token.text
                      : <span key={`${token.kind}-${tokenIndex}`} className={styles[`syntax${token.kind[0].toUpperCase()}${token.kind.slice(1)}`]} data-syntax={token.kind}>{token.text}</span>
                    )}</span>
                </code>
              );
            })}
          </pre>
          <footer className={styles.activeExpression}>
            <span>EXPRESSÃO ATIVA</span>
            <code>{snapshot.expression?.source ?? snapshot.source ?? "Sem expressão neste passo"}</code>
            {snapshot.expression ? <strong>{snapshot.expression.substituted} → {resultText}</strong> : null}
          </footer>
        </section>

        <div className={styles.inspectorColumn}>
          <section
            id="execution-panel-state"
            className={`${styles.panel} ${styles.statePanel}`}
            role={mobilePanels ? "tabpanel" : undefined}
            aria-labelledby={mobilePanels ? "execution-tab-state" : undefined}
            aria-label="Estado"
            data-mobile-active={activeTab === "state"}
          >
            <header className={styles.panelHeader}>
              <div><Braces aria-hidden="true" /><span>MEMÓRIA</span></div>
              <span>Snapshot {String(snapshot.step).padStart(2, "0")} · Antes → Depois</span>
            </header>
            {variableKeys.length ? (
              <div className={styles.variableTable} role="table" aria-label="Variáveis antes e depois">
                <div className={styles.variableHeader} role="row">
                  <span role="columnheader">Variável</span><span role="columnheader">Antes</span><span role="columnheader">Depois</span>
                </div>
                {variableKeys.map(key => {
                  const before = beforeByKey.get(key);
                  const after = afterByKey.get(key);
                  const changed = before?.value.display !== after?.value.display || after?.change;
                  return (
                    <div className={styles.variableRow} role="row" key={key}>
                      <span role="cell"><b>{after?.name ?? before?.name}</b><small>{after?.scope ?? before?.scope}</small></span>
                      <code role="cell">{before?.value.display ?? "—"}</code>
                      <code role="cell" data-changed={Boolean(changed)}>{after?.value.display ?? "—"}{changed ? <small>alterado</small> : null}</code>
                    </div>
                  );
                })}
              </div>
            ) : <p className={styles.emptyState}>Nenhuma variável foi criada neste passo.</p>}
            {snapshot.returnValue ? (
              <div className={styles.returnTransfer}><span>RETORNO</span><strong>{snapshot.returnValue.display}</strong></div>
            ) : null}
          </section>

          <section
            id="execution-panel-stack"
            className={`${styles.panel} ${styles.stackPanel}`}
            role={mobilePanels ? "tabpanel" : undefined}
            aria-labelledby={mobilePanels ? "execution-tab-stack" : undefined}
            aria-label="Pilha"
            data-mobile-active={activeTab === "stack"}
          >
            <header className={styles.panelHeader}>
              <div><Layers3 aria-hidden="true" /><span>PILHA DE CHAMADAS</span></div>
              <span>Snapshot {String(snapshot.step).padStart(2, "0")} · {snapshot.callStack.length} frame{snapshot.callStack.length === 1 ? "" : "s"}</span>
            </header>
            {snapshot.callStack.length ? <ol className={styles.stackList}>
              {[...snapshot.callStack].reverse().map((frame, index) => (
                <li key={`${frame.kind}-${frame.name}-${index}`}>
                  <span>#{snapshot.callStack.length - index - 1}{index === 0 ? " · TOPO" : ""}</span>
                  <strong>{frame.name}</strong>
                  {frame.parameters.length ? <small>{frame.parameters.map(parameter => `${parameter.name} = ${parameter.value.display}`).join(" · ")}</small> : <small>{frame.kind}</small>}
                </li>
              ))}
            </ol> : <p className={styles.emptyState}>A pilha está vazia porque todas as chamadas já terminaram.</p>}
          </section>

          <section
            id="execution-panel-output"
            className={`${styles.panel} ${styles.consolePanel}`}
            role={mobilePanels ? "tabpanel" : undefined}
            aria-labelledby={mobilePanels ? "execution-tab-output" : undefined}
            aria-label="Saída"
            data-mobile-active={activeTab === "output"}
          >
            <header className={styles.panelHeader}>
              <div><Terminal aria-hidden="true" /><span>CONSOLE</span></div>
              <span>Snapshot {String(snapshot.step).padStart(2, "0")} · {snapshot.console.length} saída{snapshot.console.length === 1 ? "" : "s"}</span>
            </header>
            <div className={styles.console} role="log" aria-live="polite" aria-relevant="additions text">
              {snapshot.console.length ? snapshot.console.map((entry, index) => (
                <p key={`${entry.step}-${index}`}><span>passo {entry.step}</span><code>{entry.text}</code></p>
              )) : <p className={styles.consoleEmpty}>Nenhuma saída até este passo.</p>}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
