"use client";

import { CheckCircle2, Filter, RotateCcw, StepForward, XCircle } from "lucide-react";
import { useState } from "react";

const products = [
  { code: "P01", active: true, stock: 8 },
  { code: "P02", active: false, stock: 4 },
  { code: "P03", active: true, stock: 0 },
  { code: "P04", active: true, stock: 5 },
];

export default function FilterGateLab() {
  const [rule, setRule] = useState<"active" | "available">("available");
  const [step, setStep] = useState(-1);
  const [answer, setAnswer] = useState<"original" | "novo" | null>(null);
  const accepted = products.slice(0, Math.max(0, step + 1)).filter(product => rule === "active" ? product.active : product.active && product.stock > 0);
  const current = step >= 0 && step < products.length ? products[step] : null;
  const currentPasses = current ? (rule === "active" ? current.active : current.active && current.stock > 0) : false;
  const finished = step >= products.length;

  const changeRule = (next: "active" | "available") => { setRule(next); setStep(-1); };
  return (
    <section className="array-modern-lab filter-lab">
      <div className="modern-heading"><div><span className="eyebrow">PORTA DO FILTER</span><h2>O predicado devolve true para deixar passar</h2><p>Avalie os produtos um por vez e veja que os rejeitados não são apagados do original.</p></div><Filter/></div>
      <div className="filter-rule"><span>REGRA DO PREDICADO</span><div><button className={rule === "active" ? "selected" : ""} onClick={() => changeRule("active")}>produto.ativo</button><button className={rule === "available" ? "selected" : ""} onClick={() => changeRule("available")}>ativo && estoque &gt; 0</button></div></div>
      <div className="filter-workbench"><div className="filter-source"><span>ORIGINAL</span>{products.map((product, index) => <article key={product.code} className={step === index ? "active" : step > index || finished ? "checked" : ""}><strong>{product.code}</strong><small>ativo: {String(product.active)} · estoque: {product.stock}</small></article>)}</div><div className={`filter-gate ${current ? currentPasses ? "pass" : "reject" : ""}`}><span>PREDICADO</span><code>{current ? `${current.code} → ${String(currentPasses)}` : "aguardando"}</code>{current && (currentPasses ? <CheckCircle2/> : <XCircle/>)}<strong>{current ? currentPasses ? "ENTRA" : "NÃO ENTRA" : "?"}</strong></div><div className="filter-output"><span>NOVO ARRAY</span>{accepted.length ? accepted.map(product => <article key={product.code}><CheckCircle2/><strong>{product.code}</strong></article>) : <p>Nenhum selecionado ainda.</p>}</div></div>
      <div className="modern-actions"><button className="btn btn-soft" onClick={() => setStep(-1)}><RotateCcw/> Reiniciar</button><button className="btn btn-primary" disabled={finished} onClick={() => setStep(value => value + 1)}><StepForward/> {finished ? "Filtro concluído" : step < 0 ? "Avaliar primeiro" : "Avaliar próximo"}</button></div>
      <div className="modern-prediction"><div><span className="eyebrow">ONDE FICAM OS REJEITADOS?</span><strong>filter remove os elementos rejeitados do array original?</strong></div><div><button onClick={() => setAnswer("original")} className={answer === "original" ? "selected" : ""}>Sim</button><button onClick={() => setAnswer("novo")} className={answer === "novo" ? "selected" : ""}>Não</button></div></div>
      {answer && <div className={`modern-feedback ${answer === "novo" ? "correct" : "incorrect"}`}><CheckCircle2/><span>{answer === "novo" ? "Correto. A seleção forma um novo array; o original continua completo." : "filter não apaga do original. Ele devolve outra coleção apenas com os aprovados."}</span></div>}
    </section>
  );
}
