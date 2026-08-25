"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Code2, Play, RotateCcw, Sparkles, Terminal } from "lucide-react";
import styles from "./onboarding.module.css";

type ModuleIntroductionProps = {
  studentName: string;
  onComplete: () => void | Promise<void>;
  busy?: boolean;
};

const initialCode = 'console.log("Olá, Campus!");';

export function ModuleIntroduction({ studentName, onComplete, busy = false }: ModuleIntroductionProps) {
  const [prediction, setPrediction] = useState("");
  const [feedback, setFeedback] = useState("");
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const checkPrediction = () => {
    setFeedback(prediction === "hello" ? "Boa leitura: essa é a mensagem enviada ao console." : "Sem problema — vamos descobrir executando o programa.");
  };

  const run = () => {
    const match = code.match(/console\.log\(\s*["']([^"']*)["']\s*\)/);
    setOutput(match?.[1] ?? "O programa precisa de um console.log com texto entre aspas.");
    setHasRun(true);
  };

  const useStudentName = () => {
    const firstName = studentName.trim().split(/\s+/)[0] || "Estudante";
    setCode(`console.log("Olá, ${firstName}!");`);
    setOutput(null);
  };

  return (
    <main className={styles.introShell}>
      <header className={styles.introHeader}>
        <div className={styles.brand}><span>JS</span><strong>Campus Backend</strong></div>
        <div><span>PORTA DO MÓDULO</span><b>M01 · Fundamentos JavaScript</b></div>
      </header>
      <section className={styles.introHero}>
        <div>
          <p className={styles.eyebrow}>PRIMEIRA MISSÃO · SEM NOTA</p>
          <h1>Como fazemos o computador <em>responder?</em></h1>
          <p>Em poucos minutos, você vai prever uma saída, executar seu primeiro programa e trocar a mensagem pelo seu nome.</p>
        </div>
        <ol className={styles.introSteps} aria-label="Etapas da introdução">
          <li className={prediction ? styles.done : styles.current}><span>01</span><b>Prever</b></li>
          <li className={hasRun ? styles.done : prediction ? styles.current : ""}><span>02</span><b>Executar</b></li>
          <li className={hasRun ? styles.current : ""}><span>03</span><b>Personalizar</b></li>
        </ol>
      </section>

      <div className={styles.introGrid}>
        <section className={styles.lessonCard} aria-labelledby="prediction-title">
          <span className={styles.cardNumber}>01 · FAÇA UMA PREVISÃO</span>
          <h2 id="prediction-title">O que você acha que aparecerá?</h2>
          <div className={styles.miniCode}><Code2 /><code>{initialCode}</code></div>
          <p className={styles.choiceHint}>Escolha uma opção para liberar a conferência.</p>
          <fieldset className={styles.predictions}>
            <legend className={styles.srOnly}>Escolha a saída esperada</legend>
            <label><input type="radio" name="prediction" value="hello" onChange={event => setPrediction(event.target.value)} /> <span>Olá, Campus!</span></label>
            <label><input type="radio" name="prediction" value="command" onChange={event => setPrediction(event.target.value)} /> <span>console.log</span></label>
            <label><input type="radio" name="prediction" value="nothing" onChange={event => setPrediction(event.target.value)} /> <span>Nada aparecerá</span></label>
          </fieldset>
          <button className={styles.secondaryAction} disabled={!prediction} onClick={checkPrediction}>Conferir previsão</button>
          <p className={styles.feedback} role="status" aria-live="polite">{feedback}</p>
        </section>

        <section className={`${styles.lessonCard} ${styles.terminalCard}`} aria-labelledby="run-title">
          <div className={styles.terminalCaption}><span><i /><i /><i /></span><b id="run-title">primeiro-programa.js</b><small>execução local</small></div>
          <textarea aria-label="Código do primeiro programa" spellCheck={false} value={code} onChange={event => { setCode(event.target.value); setOutput(null); }} />
          <div className={styles.console} role="log" aria-label="Saída do programa" aria-live="polite"><span><Terminal /> CONSOLE</span>{output === null ? <small>A saída aparecerá aqui.</small> : <strong>{output}</strong>}</div>
          <div className={styles.runActions}>
            <button className={styles.primaryAction} onClick={run}><Play /> Executar programa</button>
            <button className={styles.secondaryAction} disabled={!hasRun} onClick={useStudentName}><Sparkles /> Usar meu nome</button>
          </div>
        </section>
      </div>

      <section className={styles.victory} aria-label="Próximo passo">
        <div className={hasRun ? styles.victoryIconDone : styles.victoryIcon}><CheckCircle2 /></div>
        <div><span>PRIMEIRA VITÓRIA</span><h2>{hasRun ? "Seu primeiro programa respondeu." : "Execute para abrir o próximo passo."}</h2><p>Na Aula 01, você descobrirá como guardar informações para reutilizá-las.</p></div>
        <button className={styles.primaryAction} disabled={!hasRun || busy} onClick={() => void onComplete()}>Abrir Aula 01 <ArrowRight /></button>
      </section>
      <button className={styles.resetLink} onClick={() => { setPrediction(""); setFeedback(""); setCode(initialCode); setOutput(null); setHasRun(false); }}><RotateCcw /> Recomeçar introdução</button>
    </main>
  );
}
