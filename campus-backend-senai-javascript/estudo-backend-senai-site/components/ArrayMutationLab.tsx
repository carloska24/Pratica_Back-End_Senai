"use client";

import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  CircleHelp,
  RotateCcw,
  Rows3,
} from "lucide-react";

const initialQueue = ["P001", "P002"];

type Operation = {
  method: "início" | "push" | "pop";
  code: string;
  result: string;
  explanation: string;
};

const initialOperation: Operation = {
  method: "início",
  code: "const fila = [\"P001\", \"P002\"]",
  result: "fila criada",
  explanation: "A variável aponta para um array com dois códigos.",
};

export default function ArrayMutationLab() {
  const [queue, setQueue] = useState(initialQueue);
  const [nextNumber, setNextNumber] = useState(3);
  const [operation, setOperation] = useState<Operation>(initialOperation);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const pushCode = () => {
    const nextCode = `P${String(nextNumber).padStart(3, "0")}`;
    const nextQueue = [...queue, nextCode];
    setQueue(nextQueue);
    setNextNumber(number => number + 1);
    setOperation({
      method: "push",
      code: `fila.push(\"${nextCode}\")`,
      result: String(nextQueue.length),
      explanation: `O código ${nextCode} entrou no final. push devolveu o novo length.`,
    });
  };

  const popCode = () => {
    const removed = queue.at(-1);
    setQueue(current => current.slice(0, -1));
    setOperation({
      method: "pop",
      code: "const removido = fila.pop()",
      result: removed === undefined ? "undefined" : `\"${removed}\"`,
      explanation: removed === undefined
        ? "O array já estava vazio; não havia valor para remover."
        : `${removed} saiu do final e foi devolvido para a variável removido.`,
    });
  };

  const reset = () => {
    setQueue(initialQueue);
    setNextNumber(3);
    setOperation(initialOperation);
    setPrediction(null);
    setChecked(false);
  };

  const predictionCorrect = prediction === "P003";

  return (
    <section className="mutation-lab" aria-labelledby="mutation-lab-title">
      <div className="mutation-heading">
        <div>
          <span className="eyebrow">SIMULADOR DE MUTAÇÃO</span>
          <h2 id="mutation-lab-title">Veja o array mudar e o método responder</h2>
          <p>O array fica de um jeito; o valor devolvido pelo método pode ser guardado em outra variável.</p>
        </div>
        <button className="icon-btn" type="button" title="Reiniciar simulador" aria-label="Reiniciar simulador" onClick={reset}><RotateCcw size={18}/></button>
      </div>

      <div className="mutation-workbench">
        <div className="mutation-state">
          <div className="mutation-state-title"><Rows3 size={18}/><div><span>FILA AGORA</span><strong>length = {queue.length}</strong></div></div>
          {queue.length > 0 ? <div className="mutation-queue" aria-label={`Fila com ${queue.length} códigos`}>
            {queue.map((code, index) => <div key={code}><span>índice {index}</span><strong>{code}</strong>{index === queue.length - 1 && <small>final</small>}</div>)}
          </div> : <div className="mutation-empty"><strong>[]</strong><span>Array vazio: length = 0</span></div>}
        </div>

        <div className="mutation-controls" aria-label="Operações do array">
          <button type="button" className="mutation-command push" onClick={pushCode} disabled={queue.length >= 5}>
            <ArrowDownToLine size={18}/><span><b>push</b><small>adicionar no final</small></span>
          </button>
          <button type="button" className="mutation-command pop" onClick={popCode}>
            <ArrowUpFromLine size={18}/><span><b>pop</b><small>remover do final</small></span>
          </button>
        </div>
      </div>

      <div className={`mutation-return method-${operation.method}`} aria-live="polite">
        <div><span>LINHA EXECUTADA</span><code>{operation.code}</code></div>
        <div><span>VALOR DEVOLVIDO</span><strong>{operation.result}</strong></div>
        <p>{operation.explanation}</p>
      </div>

      <div className="mutation-comparison">
        <div><span>push</span><strong>muda o array</strong><p>Adiciona no final e devolve o novo <code>length</code>.</p></div>
        <div><span>pop</span><strong>muda o array</strong><p>Remove do final e devolve o elemento removido.</p></div>
      </div>

      <div className="mutation-prediction">
        <div><span className="eyebrow">PREVISÃO DO EXERCÍCIO 02</span><strong>Depois de adicionar P003 e executar <code>fila.pop()</code>, qual valor fica em <code>removido</code>?</strong></div>
        <div className="mutation-options">
          {["P001", "P003", "3"].map(option => <button type="button" key={option} className={prediction === option ? "selected" : ""} onClick={() => { setPrediction(option); setChecked(false); }}>{option}</button>)}
          <button type="button" className="check-answer" disabled={prediction === null} onClick={() => setChecked(true)}>Conferir</button>
        </div>
      </div>

      {checked && <div className={`mutation-feedback ${predictionCorrect ? "correct" : "incorrect"}`} role="status">
        {predictionCorrect ? <CheckCircle2 size={18}/> : <CircleHelp size={18}/>}<span>{predictionCorrect
          ? "Correto. P003 foi o último a entrar e, por isso, é o primeiro a sair pelo pop."
          : "Observe o final do array: pop não devolve a quantidade nem o primeiro item; ele devolve o último item removido."}</span>
      </div>}

      <div className="mutation-mental-rule"><Rows3 size={21}/><p><b>Leitura mental:</b> <code>push</code> empurra para o final; <code>pop</code> destaca o último elemento e o entrega como resposta.</p></div>
    </section>
  );
}
