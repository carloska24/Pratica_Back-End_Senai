"use client";

import { CheckCircle2, CircleHelp, RotateCcw, StepForward, XCircle } from "lucide-react";
import { useState } from "react";

type Mode = "find" | "some" | "every";
const products = [
  { code: "P01", price: 249.9, stock: 8 },
  { code: "P02", price: 89.5, stock: 0 },
  { code: "P03", price: 799, stock: 3 },
];

const modes = {
  find: { question: "Qual é o produto P02?", expression: 'produto.codigo === "P02"', stop: 1, result: "{ codigo: P02, ... }" },
  some: { question: "Existe algum produto esgotado?", expression: "produto.estoque === 0", stop: 1, result: "true" },
  every: { question: "Todos os preços são positivos?", expression: "produto.preco > 0", stop: 2, result: "true" },
};

export default function ArrayQuestionLab() {
  const [mode, setMode] = useState<Mode>("find");
  const [step, setStep] = useState(-1);
  const [answer, setAnswer] = useState<"null" | "undefined" | null>(null);
  const config = modes[mode];
  const finished = step >= config.stop;
  const setQuestion = (next: Mode) => { setMode(next); setStep(-1); };
  const passes = (index: number) => mode === "every" ? true : index === 1;

  return (
    <section className="array-modern-lab question-lab">
      <div className="modern-heading"><div><span className="eyebrow">CENTRAL DE PERGUNTAS</span><h2>Mesma coleção, formatos de resposta diferentes</h2><p>Escolha a pergunta e acompanhe o curto-circuito quando a resposta já estiver decidida.</p></div><CircleHelp/></div>
      <div className="question-tabs">{(["find", "some", "every"] as Mode[]).map(name => <button key={name} className={mode === name ? "selected" : ""} onClick={() => setQuestion(name)}><code>{name}()</code><span>{modes[name].question}</span></button>)}</div>
      <div className="question-expression"><span>PREDICADO</span><code>{config.expression}</code></div>
      <div className="question-trace">{products.map((product, index) => { const visited = step >= index; const passed = visited && passes(index); return <article key={product.code} className={step === index ? "active" : visited ? passed ? "pass" : "fail" : "waiting"}><span>índice {index}</span><strong>{product.code}</strong><small>R$ {product.price} · estoque {product.stock}</small>{visited && (passed ? <CheckCircle2/> : <XCircle/>)}</article>; })}</div>
      <div className={`question-result ${finished ? "ready" : ""}`}><div><span>RESPOSTA DO {mode.toUpperCase()}</span><strong>{finished ? config.result : "ainda não determinada"}</strong></div><p>{finished ? mode === "every" ? "Todos foram visitados porque nenhum false apareceu." : `A resposta surgiu no índice ${config.stop}; os índices seguintes não precisam ser visitados.` : "O método ainda precisa perguntar ao próximo elemento."}</p></div>
      <div className="modern-actions"><button className="btn btn-soft" onClick={() => setStep(-1)}><RotateCcw/> Reiniciar</button><button className="btn btn-primary" disabled={finished} onClick={() => setStep(value => value + 1)}><StepForward/> {finished ? "Resposta determinada" : "Verificar elemento"}</button></div>
      <div className="modern-prediction"><div><span className="eyebrow">BUSCA SEM RESULTADO</span><strong>O que find devolve quando nenhum elemento atende?</strong></div><div><button onClick={() => setAnswer("null")} className={answer === "null" ? "selected" : ""}>null</button><button onClick={() => setAnswer("undefined")} className={answer === "undefined" ? "selected" : ""}>undefined</button></div></div>
      {answer && <div className={`modern-feedback ${answer === "undefined" ? "correct" : "incorrect"}`}><CheckCircle2/><span>{answer === "undefined" ? "Correto. O código chamador decide se converterá essa ausência para null ou outro contrato." : "find devolve undefined. null só aparece se o seu código escolher usá-lo explicitamente."}</span></div>}
    </section>
  );
}
