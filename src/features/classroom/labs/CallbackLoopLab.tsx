"use client";

import { CheckCircle2, Play, RotateCcw, StepForward } from "lucide-react";
import { useState } from "react";

const products = ["Teclado", "Mouse", "Monitor"];

export default function CallbackLoopLab() {
  const [step, setStep] = useState(-1);
  const [answer, setAnswer] = useState<"array" | "undefined" | null>(null);
  const finished = step >= products.length;

  return (
    <section className="array-modern-lab callback-lab">
      <div className="modern-heading"><div><span className="eyebrow">RAIO-X DO FOREACH</span><h2>O método controla o percurso; o callback recebe a volta</h2><p>Avance uma chamada por vez e observe elemento, índice e ação.</p></div><Play/></div>
      <div className="callback-contract"><article><span>MÉTODO</span><code>produtos.forEach(...)</code><strong>cuida do percurso</strong></article><b>entrega</b><article><span>CALLBACK</span><code>function (produto, indice)</code><strong>cuida da ação</strong></article></div>
      <div className="callback-array">{products.map((product, index) => <article key={product} className={step === index ? "active" : step > index || finished ? "done" : "waiting"}><span>índice {index}</span><strong>{product}</strong>{(step > index || finished) && <CheckCircle2/>}</article>)}</div>
      <div className={`callback-call ${step >= 0 && !finished ? "running" : ""}`}><div><span>CHAMADA ATUAL</span><code>{step < 0 ? "aguardando..." : finished ? "percurso encerrado" : `callback("${products[step]}", ${step})`}</code></div><div><span>AÇÃO</span><strong>{step < 0 ? "nenhuma" : finished ? "3 linhas exibidas" : `${step + 1}. ${products[step]}`}</strong></div></div>
      <div className="modern-actions"><button className="btn btn-soft" onClick={() => setStep(-1)}><RotateCcw/> Reiniciar</button><button className="btn btn-primary" disabled={finished} onClick={() => setStep(value => value + 1)}><StepForward/> {finished ? "Percurso concluído" : step < 0 ? "Iniciar percurso" : "Próxima chamada"}</button></div>
      <div className="modern-note"><strong>Sem array de saída</strong><p><code>forEach</code> existe para efeitos como exibir, registrar ou chamar outra ação. Seu resultado final é <code>undefined</code>.</p></div>
      <div className="modern-prediction"><div><span className="eyebrow">TIPO DO RESULTADO</span><strong>O que recebe <code>const retorno = produtos.forEach(...)</code>?</strong></div><div><button onClick={() => setAnswer("array")} className={answer === "array" ? "selected" : ""}>novo array</button><button onClick={() => setAnswer("undefined")} className={answer === "undefined" ? "selected" : ""}>undefined</button></div></div>
      {answer && <div className={`modern-feedback ${answer === "undefined" ? "correct" : "incorrect"}`}><CheckCircle2/><span>{answer === "undefined" ? "Correto. forEach executa ações, mas não constrói uma coleção de retorno." : "Quem constrói um novo array por transformação é map; forEach devolve undefined."}</span></div>}
    </section>
  );
}
