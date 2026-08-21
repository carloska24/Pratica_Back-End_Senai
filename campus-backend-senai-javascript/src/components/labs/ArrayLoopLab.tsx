"use client";

import { useState } from "react";
import {
  Calculator,
  CheckCircle2,
  CircleHelp,
  ListOrdered,
  Play,
  RotateCcw,
  SquareTerminal,
} from "lucide-react";

const notes = [8, 7.5, 9, 6.5];

export default function ArrayLoopLab() {
  const [index, setIndex] = useState(0);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const finished = index >= notes.length;
  const currentNote = notes[index];
  const visitedNotes = notes.slice(0, index);
  const partialSum = visitedNotes.reduce((sum, note) => sum + note, 0);

  const reset = () => {
    setIndex(0);
    setPrediction(null);
    setChecked(false);
  };

  const conditionOptions = [
    "indice <= notas.length",
    "indice < notas.length",
    "indice < notas.length - 1",
  ];
  const correctCondition = conditionOptions[1];

  return (
    <section className="loop-lab" aria-labelledby="loop-lab-title">
      <div className="loop-heading">
        <div>
          <span className="eyebrow">RASTREAMENTO DO FOR</span>
          <h2 id="loop-lab-title">Faça o índice visitar um elemento por vez</h2>
          <p>A condição protege o acesso: somente índices menores que <code>length</code> entram no bloco.</p>
        </div>
        <button className="icon-btn" type="button" title="Reiniciar percurso" aria-label="Reiniciar percurso" onClick={reset}><RotateCcw size={18}/></button>
      </div>

      <div className="loop-array" aria-label="Array de notas">
        {notes.map((note, noteIndex) => {
          const state = noteIndex < index ? "visited" : noteIndex === index ? "current" : "waiting";
          return <div key={`${noteIndex}-${note}`} className={state}>
            <span>índice {noteIndex}</span><strong>{note}</strong><small>{state === "visited" ? "visitado" : state === "current" ? "agora" : "aguarda"}</small>
          </div>;
        })}
        <div className={finished ? "stop current" : "stop"}><span>índice 4</span><strong>?</strong><small>{finished ? "condição falsa" : "fora do array"}</small></div>
      </div>

      <div className="loop-machine" aria-live="polite">
        <article className={finished ? "false" : "true"}>
          <span>1 · TESTAR CONDIÇÃO</span>
          <code>{index} &lt; {notes.length}</code>
          <strong>{finished ? "false · encerrar" : "true · entrar"}</strong>
        </article>
        <article className={finished ? "inactive" : "active"}>
          <span>2 · ACESSAR ELEMENTO</span>
          <code>{finished ? "bloco não executa" : `notas[${index}]`}</code>
          <strong>{finished ? "nenhum acesso" : `valor ${currentNote}`}</strong>
        </article>
        <article className={finished ? "inactive" : "active"}>
          <span>3 · ATUALIZAR ÍNDICE</span>
          <code>{finished ? "laço encerrado" : "indice++"}</code>
          <strong>{finished ? "permanece 4" : `${index} → ${index + 1}`}</strong>
        </article>
      </div>

      <div className="loop-action-row">
        <div><ListOrdered size={19}/><span>Voltas concluídas</span><strong>{visitedNotes.length} de {notes.length}</strong></div>
        <button type="button" className="btn btn-primary" disabled={finished} onClick={() => setIndex(current => Math.min(current + 1, notes.length))}><Play size={16}/>{finished ? "Percurso concluído" : `Executar volta ${index + 1}`}</button>
      </div>

      <div className="loop-evidence">
        <article className="loop-console">
          <div><SquareTerminal size={17}/><span>SAÍDA CONSTRUÍDA</span></div>
          {visitedNotes.length === 0 ? <p className="empty">Nenhuma volta executada.</p> : visitedNotes.map((note, noteIndex) => <code key={`${noteIndex}-output`}>Índice {noteIndex}: {note}</code>)}
          {finished && <strong>O índice chegou a 4; o bloco não executou novamente.</strong>}
        </article>
        <article className="loop-bridge">
          <div><Calculator size={17}/><span>PONTE PARA O EXERCÍCIO 03</span></div>
          <strong>soma parcial = {partialSum}</strong>
          <p>Cada nota visitada poderia executar <code>soma += notas[indice]</code>.</p>
          {finished && <b>média = {partialSum} / {notes.length} = {partialSum / notes.length}</b>}
        </article>
      </div>

      <div className="loop-prediction">
        <div><span className="eyebrow">PREVISÃO ANTES DO CÓDIGO</span><strong>Qual condição visita todos os elementos sem acessar <code>notas[4]</code>?</strong></div>
        <div className="loop-options">
          {conditionOptions.map(option => <button type="button" key={option} className={prediction === option ? "selected" : ""} onClick={() => { setPrediction(option); setChecked(false); }}><code>{option}</code></button>)}
          <button type="button" className="check-answer" disabled={prediction === null} onClick={() => setChecked(true)}>Conferir</button>
        </div>
      </div>

      {checked && <div className={`loop-feedback ${prediction === correctCondition ? "correct" : "incorrect"}`} role="status">
        {prediction === correctCondition ? <CheckCircle2 size={18}/> : <CircleHelp size={18}/>}<span>{prediction === correctCondition
          ? "Correto. Os índices válidos são 0, 1, 2 e 3; quando indice vale 4, a condição fica falsa."
          : "Ainda não. <= deixaria o índice 4 entrar; length - 1 faria o laço parar antes de visitar o índice 3."}</span>
      </div>}

      <div className="loop-mental-rule"><ListOrdered size={21}/><p><b>Leitura mental:</b> testar → acessar → executar o bloco → incrementar → voltar para a condição.</p></div>
    </section>
  );
}
