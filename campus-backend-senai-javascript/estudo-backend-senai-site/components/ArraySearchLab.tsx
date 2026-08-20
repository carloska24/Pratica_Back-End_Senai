"use client";

import { useState } from "react";
import {
  CheckCircle2,
  CircleHelp,
  CornerDownLeft,
  RotateCcw,
  ScanSearch,
  Search,
} from "lucide-react";

const codes = [101, 205, 310, 411];
const targets = [310, 999] as const;

export default function ArraySearchLab() {
  const [target, setTarget] = useState<number>(310);
  const [index, setIndex] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const resetSearch = (nextTarget = target) => {
    setTarget(nextTarget);
    setIndex(0);
    setComparisons(0);
    setResult(null);
  };

  const resetAll = () => {
    resetSearch(310);
    setPrediction(null);
    setChecked(false);
  };

  const compareCurrent = () => {
    if (result !== null || index >= codes.length) return;
    const found = codes[index] === target;
    setComparisons(count => count + 1);

    if (found) {
      setResult(true);
      return;
    }

    if (index === codes.length - 1) {
      setIndex(codes.length);
      setResult(false);
      return;
    }

    setIndex(current => current + 1);
  };

  const comparisonText = result === false
    ? "Todas as posições foram comparadas."
    : `${codes[index]} === ${target} → ${codes[index] === target}`;

  return (
    <section className="search-lab" aria-labelledby="search-lab-title">
      <div className="search-heading">
        <div>
          <span className="eyebrow">BUSCA LINEAR EXECUTÁVEL</span>
          <h2 id="search-lab-title">Procure da esquerda para a direita</h2>
          <p>O <code>return true</code> encerra a função no encontro; o <code>return false</code> só acontece depois que o laço termina.</p>
        </div>
        <button className="icon-btn" type="button" title="Reiniciar busca" aria-label="Reiniciar busca" onClick={resetAll}><RotateCcw size={18}/></button>
      </div>

      <div className="search-target-row">
        <div><Search size={18}/><span>Escolha o código procurado</span></div>
        <div className="search-targets">
          {targets.map(option => <button type="button" key={option} aria-pressed={target === option} className={target === option ? "selected" : ""} onClick={() => resetSearch(option)}>{option}<small>{option === 310 ? "existe" : "não existe"}</small></button>)}
        </div>
      </div>

      <div className="search-array" aria-label="Array de códigos">
        {codes.map((code, codeIndex) => {
          const state = result === true && codeIndex === index
            ? "found"
            : codeIndex < index || result === false
              ? "visited"
              : result === null && codeIndex === index
                ? "current"
                : "waiting";
          return <div key={code} className={state}>
            <span>índice {codeIndex}</span><strong>{code}</strong><small>{state === "found" ? "encontrado" : state === "visited" ? "comparado" : state === "current" ? "agora" : "aguarda"}</small>
          </div>;
        })}
      </div>

      <div className="search-trace" aria-live="polite">
        <article><span>CHAMADA</span><code>possuiCodigo(codigos, {target})</code><strong>alvo = {target}</strong></article>
        <article className={result === null ? "active" : "done"}><span>COMPARAÇÃO ATUAL</span><code>{comparisonText}</code><strong>{comparisons} {comparisons === 1 ? "comparação" : "comparações"}</strong></article>
        <article className={result === null ? "waiting" : result ? "success" : "failure"}><span>RESPOSTA DA FUNÇÃO</span><code>{result === null ? "ainda procurando..." : `return ${result}`}</code><strong>{result === null ? "resultado pendente" : result ? "função encerrada no encontro" : "laço terminou sem encontro"}</strong></article>
      </div>

      <div className="search-action-row">
        <div><ScanSearch size={19}/><span>{result === null ? `Próximo endereço: códigos[${index}]` : result ? `Código ${target} localizado no índice ${index}.` : `O código ${target} não pertence ao array.`}</span></div>
        <button type="button" className="btn btn-primary" disabled={result !== null} onClick={compareCurrent}><Search size={16}/>{result === null ? `Comparar índice ${index}` : result ? "Busca encerrada" : "Busca concluída"}</button>
      </div>

      {result !== null && <div className={`search-return ${result ? "success" : "failure"}`} role="status">
        <CornerDownLeft size={20}/><div><span>RETURN DEVOLVE E ENCERRA</span><strong>{String(result)}</strong><p>{result
          ? `A posição ${index} coincidiu com o alvo. As posições seguintes não precisam ser examinadas.`
          : "Nenhuma posição coincidiu. Agora, fora do for, a função pode afirmar que o código não foi encontrado."}</p></div>
      </div>}

      <div className="search-prediction">
        <div><span className="eyebrow">PREVISÃO ANTES DE EXECUTAR</span><strong>Ao procurar `310`, quantas comparações acontecem antes do <code>return true</code>?</strong></div>
        <div className="search-options">
          {[2, 3, 4].map(option => <button type="button" key={option} className={prediction === option ? "selected" : ""} onClick={() => { setPrediction(option); setChecked(false); }}>{option}</button>)}
          <button type="button" className="check-answer" disabled={prediction === null} onClick={() => setChecked(true)}>Conferir</button>
        </div>
      </div>

      {checked && <div className={`search-feedback ${prediction === 3 ? "correct" : "incorrect"}`} role="status">
        {prediction === 3 ? <CheckCircle2 size={18}/> : <CircleHelp size={18}/>}<span>{prediction === 3
          ? "Correto. A função compara 101, depois 205 e finalmente encontra 310 na terceira comparação."
          : "Conte as comparações, não o índice: índice 0 é a primeira, índice 1 é a segunda e índice 2 é a terceira."}</span>
      </div>}

      <div className="search-mental-rule"><ScanSearch size={21}/><p><b>Leitura mental:</b> comparar o atual → encontrou? devolver <code>true</code> → não encontrou? avançar → terminou tudo? devolver <code>false</code>.</p></div>
    </section>
  );
}
