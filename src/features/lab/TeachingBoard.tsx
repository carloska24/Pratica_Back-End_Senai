"use client";

import { lazy, Suspense } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Braces,
  CheckCircle2,
  CircleAlert,
  GitBranch,
  Sparkles,
} from "lucide-react";
import type { TeachingAnalysis } from "../../runner/contracts";
import type { TutorResponse } from "../../tutor/schemas";
import { shouldUseInteractiveFlow } from "./flowPresentation";

const TeachingFlowGraph = lazy(() => import("./TeachingFlowGraph").then(module => ({ default: module.TeachingFlowGraph })));

type TeachingBoardProps = {
  analysis: TeachingAnalysis;
  fileName: string;
  stale: boolean;
  onRequestTutor: () => void;
  tutor?: TutorResponse | null;
  tutorLoading?: boolean;
  tutorError?: string | null;
};

const kindLabels: Record<TeachingAnalysis["flow"][number]["kind"], string> = {
  function: "Função",
  variable: "Variável",
  decision: "Decisão",
  loop: "Repetição",
  return: "Retorno",
  call: "Chamada",
};

export function TeachingBoard({ analysis, fileName, stale, onRequestTutor, tutor = null, tutorLoading = false, tutorError = null }: TeachingBoardProps) {
  const foundConcepts = analysis.concepts.filter(concept => concept.found);
  const expectedMissing = analysis.concepts.filter(concept => concept.expected && !concept.found);
  const showInteractiveFlow = shouldUseInteractiveFlow(analysis);

  return (
    <section className={`panel teaching-board${stale ? " is-stale" : ""}`} aria-labelledby="teaching-board-title">
      <header className="teaching-board-header">
        <div className="teaching-board-title">
          <span className="teaching-board-mark" aria-hidden="true"><BrainCircuit /></span>
          <div>
            <span className="eyebrow">LEITURA ESTRUTURAL · EVIDÊNCIA LOCAL</span>
            <h2 id="teaching-board-title">Lousa Didática</h2>
          </div>
        </div>
        <div className="teaching-board-context" aria-live="polite">
          <span>{analysis.moduleId}</span>
          <strong title={fileName}>{fileName}</strong>
          <em className={stale ? "stale" : "ready"}>{stale ? "Código alterado · analise novamente" : "Análise atualizada"}</em>
        </div>
      </header>

      <div className="teaching-board-summary">
        <div>
          <span className="board-kicker">LEITURA RÁPIDA</span>
          {analysis.summary.map(line => <p key={line}>{line}</p>)}
        </div>
        <div className="concept-evidence" aria-label="Conceitos encontrados">
          {foundConcepts.map(concept => <span className="confirmed" key={concept.name}><CheckCircle2 />{concept.name}</span>)}
          {expectedMissing.map(concept => <span className="missing" key={concept.name}><CircleAlert />Ainda não: {concept.name}</span>)}
        </div>
      </div>

      <div className="teaching-board-grid">
        <section className="board-section flow-section" aria-labelledby="flow-title">
          <div className="board-section-heading"><GitBranch /><div><span className="board-kicker">ORDEM INFERIDA</span><h3 id="flow-title">Mapa de execução</h3></div></div>
          {showInteractiveFlow && <Suspense fallback={<div className="flow-graph-loading">Preparando mapa visual…</div>}><TeachingFlowGraph flow={analysis.flow}/></Suspense>}
          {showInteractiveFlow && (
            <div className="flow-mobile-map" aria-hidden="true">
              {analysis.flow.map((step, index) => (
                <article key={`compact-${step.id}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><b>{kindLabels[step.kind]}</b><p>{step.label}</p></div>
                  <code>L{step.line}</code>
                </article>
              ))}
            </div>
          )}
          {showInteractiveFlow && <p className="flow-gesture-hint">Use o zoom ou arraste o mapa no desktop. Em telas menores, a sequência muda para leitura vertical.</p>}
          {analysis.flow.length ? (
            <ol className="flow-ledger">
              {analysis.flow.map((step, index) => (
                <li key={step.id}>
                  <span className="flow-index">{String(index + 1).padStart(2, "0")}</span>
                  <div><b>{kindLabels[step.kind]}</b><p>{step.label}</p></div>
                  <code>L{step.line}</code>
                </li>
              ))}
            </ol>
          ) : <p className="board-empty">Nenhum fluxo confiável pode ser inferido antes de corrigir o código.</p>}
          <p className="evidence-note"><CircleAlert />Fluxo inferido pela estrutura. Valores reais aparecem somente após a execução.</p>
        </section>

        <div className="board-inventory">
          <section className="board-section" aria-labelledby="variables-title">
            <div className="board-section-heading"><Braces /><div><span className="board-kicker">CAIXINHAS DO PROGRAMA</span><h3 id="variables-title">Variáveis e responsabilidades</h3></div></div>
            {analysis.variables.length ? (
              <div className="variable-ledger">
                {analysis.variables.map(variable => (
                  <article key={`${variable.name}-${variable.line}`}>
                    <div><code>{variable.name}</code><span>{variable.declaration} · L{variable.line}</span></div>
                    <p>{variable.initialValue ? <>Começa com <code>{variable.initialValue}</code></> : "Valor definido durante a execução."}</p>
                    <small>Escopo: {variable.scope}</small>
                  </article>
                ))}
              </div>
            ) : <p className="board-empty">Nenhuma variável foi declarada.</p>}
          </section>

          <section className="board-section" aria-labelledby="functions-title">
            <div className="board-section-heading"><ArrowRight /><div><span className="board-kicker">ENTRADA → PROCESSAMENTO → SAÍDA</span><h3 id="functions-title">Contratos das funções</h3></div></div>
            {analysis.functions.length ? (
              <div className="function-ledger">
                {analysis.functions.map(fn => (
                  <article key={`${fn.name}-${fn.line}`}>
                    <code>{fn.name}({fn.parameters.join(", ")})</code>
                    <dl>
                      <div><dt>Parâmetros</dt><dd>{fn.parameters.length ? fn.parameters.join(", ") : "nenhum"}</dd></div>
                      <div><dt>Chamadas internas</dt><dd>{fn.calls.length ? fn.calls.join(", ") : "nenhuma"}</dd></div>
                      <div><dt>Retornos possíveis</dt><dd>{fn.returns.length ? fn.returns.join(" · ") : "sem return explícito"}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
            ) : <p className="board-empty">Nenhuma função foi identificada.</p>}
          </section>
        </div>
      </div>

      {analysis.diagnostics.length > 0 && (
        <section className="board-diagnostics" role="alert">
          <CircleAlert />
          <div><span className="board-kicker">CORRIJA PRIMEIRO</span>{analysis.diagnostics.map(item => <p key={`${item.message}-${item.line}`}>{item.message}{item.line ? ` · linha ${item.line}${typeof item.column === "number" ? `, coluna ${item.column + 1}` : ""}` : ""}</p>)}</div>
        </section>
      )}

      <footer className="teaching-board-footer">
        <div className="retention-question">
          <span className="board-kicker">PERGUNTA DE FIXAÇÃO</span>
          <h3>Pergunta de fixação</h3>
          {analysis.question ? <details><summary>{analysis.question.prompt}</summary><strong>{analysis.question.answer}</strong><p>{analysis.question.explanation}</p></details> : <p>Adicione uma variável ou função para gerar uma pergunta contextual.</p>}
        </div>
        <div className="tutor-invitation">
          <Sparkles />
          <div><span>TUTOR IA · OPCIONAL</span><p>Peça uma segunda explicação somente quando quiser aprofundar. A lousa local continua sendo a base objetiva.</p></div>
          <button className="btn btn-primary" disabled={tutorLoading} type="button" onClick={onRequestTutor}><Sparkles size={16} />{tutorLoading ? "Preparando explicação…" : "Aprofundar com IA"}</button>
        </div>
      </footer>
      {tutorError && <div className="tutor-error" role="alert"><CircleAlert/><span>{tutorError}</span></div>}
      {tutor && (
        <section className="tutor-board" aria-labelledby="tutor-board-title">
          <header>
            <div><span className="board-kicker">SEGUNDA CAMADA · {tutor.provider === "openai" ? "OPENAI" : "FALLBACK LOCAL"}</span><h3 id="tutor-board-title">Explicação do Tutor</h3></div>
            <span className={`tutor-provider ${tutor.isFallback ? "fallback" : "online"}`}>{tutor.isFallback ? "Explicação local" : "IA conectada"}</span>
          </header>
          {tutor.notice && <p className="tutor-notice"><CircleAlert/>{tutor.notice}</p>}
          <div className="tutor-opening"><h4>{tutor.title}</h4><p>{tutor.overview}</p><strong>Objetivo: {tutor.learningGoal}</strong></div>
          <div className="tutor-lesson-grid">
            <section><span className="board-kicker">CONCEITOS</span>{tutor.concepts.length ? <div className="tutor-concepts">{tutor.concepts.map(concept => <article key={concept.name}><b>{concept.name}</b><p>{concept.explanation}</p>{concept.evidenceLines.length > 0 && <code>Linhas {concept.evidenceLines.join(", ")}</code>}</article>)}</div> : <p className="board-empty">Nenhum conceito adicional foi necessário.</p>}</section>
            <section><span className="board-kicker">PASSO A PASSO</span><ol className="tutor-walkthrough">{tutor.walkthrough.map((step, index) => <li key={`${step.title}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{step.title}</b><p>{step.explanation}</p>{step.lines.length > 0 && <code>L{step.lines.join(" · L")}</code>}</div></li>)}</ol></section>
          </div>
          {tutor.diagnostics.length > 0 && <div className="tutor-diagnostics">{tutor.diagnostics.map((diagnostic, index) => <article className={diagnostic.severity} key={`${diagnostic.title}-${index}`}><b>{diagnostic.title}</b><p>{diagnostic.explanation}</p>{diagnostic.line && <code>L{diagnostic.line}</code>}</article>)}</div>}
          <footer>
            {tutor.checkQuestion && <details><summary>{tutor.checkQuestion.prompt}</summary><p><b>Dica:</b> {tutor.checkQuestion.hint}</p><strong>{tutor.checkQuestion.answer}</strong></details>}
            <p><b>Próximo experimento:</b> {tutor.nextStep}</p>
          </footer>
        </section>
      )}
    </section>
  );
}
