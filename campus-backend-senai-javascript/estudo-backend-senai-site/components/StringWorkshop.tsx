"use client";

import { ArrowRight, CheckCircle2, Eraser, Type } from "lucide-react";
import { useState } from "react";

type Operation = "trim" | "lower" | "upper";

export default function StringWorkshop() {
  const [source, setSource] = useState("  CARLOS@EMAIL.COM  ");
  const [operation, setOperation] = useState<Operation>("trim");
  const [answer, setAnswer] = useState<"sim" | "nao" | null>(null);

  const result = operation === "trim" ? source.trim() : operation === "lower" ? source.toLowerCase() : source.toUpperCase();
  const visible = (value: string) => value.replaceAll(" ", "·") || "(string vazia)";

  return (
    <section className="m10-lab string-workshop">
      <div className="m10-heading"><div><span className="eyebrow">OFICINA DE STRING</span><h2>Veja exatamente o que muda no texto</h2><p>Os pontos representam espaços, inclusive os que normalmente ficam invisíveis.</p></div><Type/></div>

      <label className="string-input"><span>VALOR RECEBIDO</span><input value={source} maxLength={36} onChange={event => setSource(event.target.value)} aria-label="Texto recebido" /></label>

      <div className="string-pipeline">
        <article><span>ANTES</span><code>{visible(source)}</code><small>{source.length} caracteres</small></article>
        <ArrowRight/>
        <div className="string-operations" aria-label="Transformação aplicada">
          <button className={operation === "trim" ? "selected" : ""} onClick={() => setOperation("trim")}><Eraser/>trim()</button>
          <button className={operation === "lower" ? "selected" : ""} onClick={() => setOperation("lower")}>a↓ toLowerCase()</button>
          <button className={operation === "upper" ? "selected" : ""} onClick={() => setOperation("upper")}>A↑ toUpperCase()</button>
        </div>
        <ArrowRight/>
        <article className="result"><span>DEPOIS</span><code>{visible(result)}</code><small>{result.length} caracteres</small></article>
      </div>

      <div className="m10-rule"><strong>String é imutável</strong><p>O método devolve outra string. A variável original continua guardando <code>{visible(source)}</code>.</p></div>

      <div className="m10-prediction"><div><span className="eyebrow">PREVEJA ANTES DE AVANÇAR</span><strong>Depois de <code>const limpo = original.trim()</code>, original foi alterado?</strong></div><div><button onClick={() => setAnswer("sim")} className={answer === "sim" ? "selected" : ""}>Sim</button><button onClick={() => setAnswer("nao")} className={answer === "nao" ? "selected" : ""}>Não</button></div></div>
      {answer && <div className={`m10-feedback ${answer === "nao" ? "correct" : "incorrect"}`}><CheckCircle2/><span>{answer === "nao" ? "Correto. limpo recebe um novo valor; original permanece intacto." : "Quase. Métodos de string não modificam a string que já existia."}</span></div>}
    </section>
  );
}
