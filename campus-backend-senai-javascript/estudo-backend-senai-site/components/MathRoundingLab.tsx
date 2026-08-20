"use client";

import { Boxes, CheckCircle2, Sigma } from "lucide-react";
import { useState } from "react";

export default function MathRoundingLab() {
  const [value, setValue] = useState(12.67);
  const [answer, setAnswer] = useState<"2" | "3" | null>(null);
  const rules = [
    { name: "Math.floor", result: Math.floor(value), meaning: "desce: só unidades completas" },
    { name: "Math.round", result: Math.round(value), meaning: "vai ao inteiro mais próximo" },
    { name: "Math.ceil", result: Math.ceil(value), meaning: "sobe: qualquer sobra exige outra unidade" },
  ];

  return (
    <section className="m10-lab math-lab">
      <div className="m10-heading"><div><span className="eyebrow">MESA DE ARREDONDAMENTO</span><h2>O decimal é o mesmo; a regra muda a resposta</h2><p>Arraste o valor e compare três decisões de negócio diferentes.</p></div><Sigma/></div>
      <div className="math-control"><label><span>VALOR ANALISADO</span><strong>{value.toFixed(2)}</strong></label><input aria-label="Valor decimal" type="range" min="1" max="19.99" step="0.01" value={value} onChange={event => setValue(Number(event.target.value))}/></div>
      <div className="rounding-rules">{rules.map(rule => <article key={rule.name}><code>{rule.name}({value.toFixed(2)})</code><strong>{rule.result}</strong><p>{rule.meaning}</p></article>)}</div>
      <div className="box-scenario"><Boxes/><div><span>REGRA REAL</span><strong>23 itens ÷ 10 por caixa = 2,3 caixas</strong><p>Duas caixas deixam três itens de fora. Por isso a necessidade física usa <code>Math.ceil(2.3)</code> e exige 3 caixas.</p></div></div>
      <div className="m10-prediction"><div><span className="eyebrow">PREVEJA A REGRA</span><strong>Quanto vale <code>Math.floor(2.9)</code>?</strong></div><div><button onClick={() => setAnswer("2")} className={answer === "2" ? "selected" : ""}>2</button><button onClick={() => setAnswer("3")} className={answer === "3" ? "selected" : ""}>3</button></div></div>
      {answer && <div className={`m10-feedback ${answer === "2" ? "correct" : "incorrect"}`}><CheckCircle2/><span>{answer === "2" ? "Correto. floor sempre desce, mesmo quando a parte decimal é 0,9." : "round daria 3; floor descarta a parte decimal e devolve 2."}</span></div>}
    </section>
  );
}
