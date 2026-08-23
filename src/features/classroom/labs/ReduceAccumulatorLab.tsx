"use client";

import { CheckCircle2, RotateCcw, Sigma, StepForward } from "lucide-react";
import { useState } from "react";

const items = [
  { name: "Cabo", price: 10, quantity: 2 },
  { name: "Mouse", price: 25, quantity: 3 },
  { name: "Adaptador", price: 8, quantity: 4 },
];

export default function ReduceAccumulatorLab() {
  const [initial, setInitial] = useState(0);
  const [step, setStep] = useState(-1);
  const [answer, setAnswer] = useState<"seguro" | "arriscado" | null>(null);
  const partials = items.map((item, index) => items.slice(0, index + 1).reduce((sum, current) => sum + current.price * current.quantity, initial));
  const before = step <= 0 ? initial : partials[Math.min(step - 1, partials.length - 1)];
  const current = step >= 0 && step < items.length ? items[step] : null;
  const after = current ? partials[step] : step >= items.length ? partials.at(-1) ?? initial : initial;
  const finished = step >= items.length;
  const changeInitial = (value: number) => { setInitial(value); setStep(-1); };

  return (
    <section className="array-modern-lab reduce-lab">
      <div className="modern-heading"><div><span className="eyebrow">MEMÓRIA DO REDUCE</span><h2>O return de hoje vira o acumulador da próxima volta</h2><p>Avance pelo pedido e acompanhe o resultado parcial sendo carregado.</p></div><Sigma/></div>
      <div className="reduce-initial"><span>VALOR INICIAL</span><div><button className={initial === 0 ? "selected" : ""} onClick={() => changeInitial(0)}>0</button><button className={initial === 100 ? "selected" : ""} onClick={() => changeInitial(100)}>100</button></div><code>reduce(callback, {initial})</code></div>
      <div className="reduce-items">{items.map((item, index) => <article key={item.name} className={step === index ? "active" : step > index || finished ? "done" : "waiting"}><span>item {index}</span><strong>{item.name}</strong><small>{item.price} × {item.quantity} = {item.price * item.quantity}</small>{(step > index || finished) && <CheckCircle2/>}</article>)}</div>
      <div className={`reduce-equation ${current || finished ? "ready" : ""}`}><article><span>ACUMULADOR RECEBIDO</span><strong>{before}</strong></article><b>+</b><article><span>SUBTOTAL ATUAL</span><strong>{current ? current.price * current.quantity : finished ? "fim" : "?"}</strong></article><b>=</b><article><span>RETURN DO CALLBACK</span><strong>{after}</strong></article></div>
      <div className="modern-actions"><button className="btn btn-soft" onClick={() => setStep(-1)}><RotateCcw/> Reiniciar</button><button className="btn btn-primary" disabled={finished} onClick={() => setStep(value => value + 1)}><StepForward/> {finished ? "Redução concluída" : step < 0 ? "Iniciar redução" : "Próxima volta"}</button></div>
      <div className="modern-note"><strong>Contrato previsível</strong><p>Com valor inicial <code>0</code>, um array vazio devolve 0. Sem valor inicial, reduzir um array vazio lança erro.</p></div>
      <div className="modern-prediction"><div><span className="eyebrow">ARRAY VAZIO</span><strong>Para somar valores, usar <code>reduce(callback, 0)</code> é a opção...</strong></div><div><button onClick={() => setAnswer("seguro")} className={answer === "seguro" ? "selected" : ""}>previsível</button><button onClick={() => setAnswer("arriscado")} className={answer === "arriscado" ? "selected" : ""}>arriscada</button></div></div>
      {answer && <div className={`modern-feedback ${answer === "seguro" ? "correct" : "incorrect"}`}><CheckCircle2/><span>{answer === "seguro" ? "Correto. O zero define a identidade da soma e cobre também o array vazio." : "Sem valor inicial é que o array vazio se torna arriscado; com 0 o contrato é previsível."}</span></div>}
    </section>
  );
}
