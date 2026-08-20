"use client";

import { ArrowDown, CheckCircle2, CopyPlus } from "lucide-react";
import { useState } from "react";

const prices = [10, 20, 30];

export default function MapTransformationLab() {
  const [rate, setRate] = useState(10);
  const [answer, setAnswer] = useState<"sim" | "nao" | null>(null);
  const transformed = prices.map(price => price * (1 + rate / 100));

  return (
    <section className="array-modern-lab map-lab">
      <div className="modern-heading"><div><span className="eyebrow">ESTEIRA DO MAP</span><h2>Um elemento entra; o return ocupa a mesma posição</h2><p>Troque a taxa e compare o array original com a nova coleção.</p></div><CopyPlus/></div>
      <div className="map-rate"><span>TAXA DA TRANSFORMAÇÃO</span><div>{[10, 20, 50].map(value => <button key={value} className={rate === value ? "selected" : ""} onClick={() => setRate(value)}>+{value}%</button>)}</div></div>
      <div className="map-columns"><div><span>ARRAY ORIGINAL</span>{prices.map((price, index) => <article key={price}><small>[{index}]</small><strong>{price}</strong></article>)}</div><div className="map-callback"><span>CALLBACK</span><code>return preco * {(1 + rate / 100).toFixed(1)}</code>{prices.map((price, index) => <div key={price}><span>{price}</span><ArrowDown/><strong>{transformed[index]}</strong></div>)}</div><div className="new-array"><span>NOVO ARRAY</span>{transformed.map((price, index) => <article key={`${price}-${index}`}><small>[{index}]</small><strong>{price}</strong></article>)}</div></div>
      <div className="map-invariant"><span>MESMO TAMANHO</span><strong>{prices.length} elementos entram → {transformed.length} elementos saem</strong><p>O original ainda é <code>[{prices.join(", ")}]</code>.</p></div>
      <div className="modern-prediction"><div><span className="eyebrow">IMUTABILIDADE DA COLEÇÃO</span><strong>Depois de <code>const novos = precos.map(...)</code>, precos foi substituído?</strong></div><div><button onClick={() => setAnswer("sim")} className={answer === "sim" ? "selected" : ""}>Sim</button><button onClick={() => setAnswer("nao")} className={answer === "nao" ? "selected" : ""}>Não</button></div></div>
      {answer && <div className={`modern-feedback ${answer === "nao" ? "correct" : "incorrect"}`}><CheckCircle2/><span>{answer === "nao" ? "Correto. map devolve outro array e preserva a referência original." : "map não substitui a variável original; ele devolve uma nova coleção."}</span></div>}
    </section>
  );
}
