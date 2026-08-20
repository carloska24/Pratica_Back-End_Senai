"use client";

import { ArrowRight, CheckCircle2, FunctionSquare } from "lucide-react";
import { useState } from "react";

type Form = "traditional" | "arrow" | "implicit";

export default function ArrowFunctionBridge() {
  const [form, setForm] = useState<Form>("traditional");
  const [value, setValue] = useState(5);
  const [answer, setAnswer] = useState<"sim" | "nao" | null>(null);
  const codes = {
    traditional: "function dobrar(numero) { return numero * 2; }",
    arrow: "const dobrar = (numero) => { return numero * 2; };",
    implicit: "const dobrar = numero => numero * 2;",
  };

  return (
    <section className="modern-js-lab arrow-bridge">
      <div className="js-modern-heading"><div><span className="eyebrow">PONTE PARA ARROW FUNCTION</span><h2>A roupa muda; o contrato da função permanece</h2><p>Escolha uma forma e acompanhe a mesma entrada produzir a mesma saída.</p></div><FunctionSquare/></div>
      <div className="arrow-tabs">{(["traditional", "arrow", "implicit"] as Form[]).map((name, index) => <button key={name} className={form === name ? "selected" : ""} onClick={() => setForm(name)}><span>0{index + 1}</span><strong>{name === "traditional" ? "function" : name === "arrow" ? "arrow com bloco" : "arrow implícita"}</strong></button>)}</div>
      <div className="arrow-code"><span>SINTAXE ESCOLHIDA</span><code>{codes[form]}</code></div>
      <div className="arrow-contract"><article><span>ARGUMENTO</span><strong>{value}</strong></article><ArrowRight/><article><span>PARÂMETRO</span><strong>numero = {value}</strong></article><ArrowRight/><article><span>EXPRESSÃO</span><strong>{value} × 2</strong></article><ArrowRight/><article className="result"><span>RETORNO</span><strong>{value * 2}</strong></article></div>
      <label className="arrow-value"><span>TESTE OUTRO ARGUMENTO</span><input aria-label="Argumento da função" type="range" min="1" max="20" value={value} onChange={event => setValue(Number(event.target.value))}/><strong>{value}</strong></label>
      <div className="js-modern-note"><strong>Atenção ao this</strong><p>Arrow function não cria o próprio <code>this</code>. Para os métodos de objeto estudados no M09, a função tradicional continua sendo a escolha mais clara.</p></div>
      <div className="js-modern-prediction"><div><span className="eyebrow">CHAVES MUDAM A REGRA</span><strong>Em <code>numero =&gt; &#123; numero * 2 &#125;</code>, o valor volta sem escrever return?</strong></div><div><button onClick={() => setAnswer("sim")} className={answer === "sim" ? "selected" : ""}>Sim</button><button onClick={() => setAnswer("nao")} className={answer === "nao" ? "selected" : ""}>Não</button></div></div>
      {answer && <div className={`js-modern-feedback ${answer === "nao" ? "correct" : "incorrect"}`}><CheckCircle2/><span>{answer === "nao" ? "Correto. Ao abrir chaves, você precisa escrever return explicitamente." : "O retorno implícito existe apenas quando a expressão vem sem chaves."}</span></div>}
    </section>
  );
}
