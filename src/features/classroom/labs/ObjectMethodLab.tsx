"use client";

import { useState } from "react";
import {
  Box,
  CheckCircle2,
  CircleHelp,
  CornerDownLeft,
  Minus,
  Play,
  Plus,
  RotateCcw,
  Route,
} from "lucide-react";

const price = 18.5;

export default function ObjectMethodLab() {
  const [quantity, setQuantity] = useState(4);
  const [step, setStep] = useState(0);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const subtotal = price * quantity;

  const changeQuantity = (next: number) => {
    setQuantity(Math.min(9, Math.max(1, next)));
    setStep(0);
  };

  const reset = () => {
    setQuantity(4);
    setStep(0);
    setPrediction(null);
    setChecked(false);
  };

  const trace = [
    { label: "1 · CHAMADA", code: "item.calcularSubtotal()", result: "o objeto item recebe a chamada" },
    { label: "2 · IDENTIDADE", code: "this === item", result: "this aponta para quem recebeu a chamada" },
    { label: "3 · LEITURA", code: `this.preco * this.quantidade`, result: `${price} * ${quantity} = ${subtotal}` },
    { label: "4 · RETORNO", code: `return ${subtotal}`, result: "o número volta para a linha da chamada" },
  ];

  return (
    <section className="method-lab" aria-labelledby="method-lab-title">
      <div className="method-heading">
        <div><span className="eyebrow">RASTREAMENTO DE MÉTODO</span><h2 id="method-lab-title">Quem está antes do ponto vira o this</h2><p>A chamada parte do objeto, entra na função guardada nele e usa os dados da mesma entidade.</p></div>
        <button className="icon-btn" type="button" title="Reiniciar rastreamento" aria-label="Reiniciar rastreamento" onClick={reset}><RotateCcw size={18}/></button>
      </div>

      <div className="method-setup">
        <div className="method-object">
          <div className="method-object-title"><Box size={18}/><div><span>OBJETO</span><strong>const item</strong></div></div>
          <div><code>preco</code><b>:</b><strong>{price}</strong></div>
          <div><code>quantidade</code><b>:</b><strong>{quantity}</strong></div>
          <div className="method-property"><code>calcularSubtotal</code><b>:</b><strong>function () {`{ ... }`}</strong></div>
        </div>

        <div className="quantity-control">
          <span>QUANTIDADE DO ITEM</span>
          <div><button type="button" title="Diminuir quantidade" aria-label="Diminuir quantidade" disabled={quantity === 1} onClick={() => changeQuantity(quantity - 1)}><Minus size={17}/></button><strong>{quantity}</strong><button type="button" title="Aumentar quantidade" aria-label="Aumentar quantidade" disabled={quantity === 9} onClick={() => changeQuantity(quantity + 1)}><Plus size={17}/></button></div>
          <p>Alterar o objeto reinicia o rastreamento.</p>
        </div>
      </div>

      <div className="method-call" aria-live="polite">
        <div className={step >= 1 ? "receiver active" : "receiver"}><span>RECEBEDOR</span><strong>item</strong></div>
        <b>.</b>
        <div className={step >= 1 ? "behavior active" : "behavior"}><span>COMPORTAMENTO</span><strong>calcularSubtotal()</strong></div>
        <b>→</b>
        <div className={step >= 2 ? "this-link active" : "this-link"}><span>DENTRO DO MÉTODO</span><strong>this → item</strong></div>
      </div>

      <div className="method-trace">
        {trace.map((phase, index) => {
          const phaseNumber = index + 1;
          const status = step === trace.length || step > phaseNumber ? "done" : step === phaseNumber ? "active" : "waiting";
          return <article key={phase.label} className={status}><span>{phase.label}</span><code>{phase.code}</code><strong>{phase.result}</strong>{status === "done" && <CheckCircle2 size={15}/>}</article>;
        })}
      </div>

      <div className="method-action-row">
        <div><Route size={19}/><span>Etapa observada</span><strong>{step} de {trace.length}</strong></div>
        <button type="button" className="btn btn-primary" disabled={step === trace.length} onClick={() => setStep(current => Math.min(trace.length, current + 1))}><Play size={16}/>{step === 0 ? "Iniciar chamada" : step === trace.length ? "Rastreamento concluído" : "Próximo passo"}</button>
      </div>

      <div className={`method-result ${step === trace.length ? "ready" : ""}`}>
        <CornerDownLeft size={20}/><div><span>VALOR DEVOLVIDO</span><strong>{step === trace.length ? subtotal : "aguardando return"}</strong><p>{step === trace.length ? `item.calcularSubtotal() produziu ${subtotal}.` : "O resultado só chega à chamada quando a execução alcança o return."}</p></div>
      </div>

      <div className="method-concepts">
        <article><span>MÉTODO</span><strong>função dentro do objeto</strong><p>O comportamento pertence à entidade.</p></article>
        <article><span>THIS</span><strong>objeto que recebeu a chamada</strong><p>Nesta chamada, <code>this === item</code>.</p></article>
        <article><span>RETURN</span><strong>entrega o subtotal</strong><p>A chamada pode guardar ou exibir o número.</p></article>
      </div>

      <div className="method-prediction">
        <div><span className="eyebrow">PREVISÃO ANTES DE EXECUTAR</span><strong>Se <code>item.quantidade</code> valer 5, quanto o método devolverá?</strong></div>
        <div className="method-options">
          {[74, 92.5, 18.5].map(option => <button type="button" key={option} className={prediction === option ? "selected" : ""} onClick={() => { setPrediction(option); setChecked(false); }}>{option}</button>)}
          <button type="button" className="check-answer" disabled={prediction === null} onClick={() => setChecked(true)}>Conferir</button>
        </div>
      </div>

      {checked && <div className={`method-feedback ${prediction === 92.5 ? "correct" : "incorrect"}`} role="status">{prediction === 92.5 ? <CheckCircle2 size={18}/> : <CircleHelp size={18}/>}<span>{prediction === 92.5 ? "Correto. this.preco vale 18.5 e this.quantidade vale 5: 18.5 × 5 = 92.5." : "O método lê as duas propriedades do item atual. Multiplique 18.5 pela nova quantidade 5."}</span></div>}

      <div className="method-warning"><CircleHelp size={19}/><p><b>Nesta etapa, use <code>function ()</code> em métodos que dependem de this.</b> Arrow functions não criam o próprio this; elas serão estudadas com calma no módulo de JavaScript moderno.</p></div>
    </section>
  );
}
