"use client";

import { CheckCircle2, Copy, Layers3 } from "lucide-react";
import { useState } from "react";

export default function SpreadCloneLab() {
  const [stock, setStock] = useState(5);
  const [order, setOrder] = useState<"correct" | "reversed">("correct");
  const [answer, setAnswer] = useState<"sim" | "nao" | null>(null);
  const original = { code: "P01", stock: 8, category: { name: "Periféricos" } };
  const resultStock = order === "correct" ? stock : original.stock;

  return (
    <section className="modern-js-lab spread-lab">
      <div className="js-modern-heading"><div><span className="eyebrow">BANCADA DO SPREAD</span><h2>Copiar primeiro; sobrescrever depois</h2><p>Altere o estoque e inverta a ordem para descobrir por que a última propriedade vence.</p></div><Copy/></div>
      <div className="spread-order"><span>ORDEM DA MONTAGEM</span><div><button className={order === "correct" ? "selected" : ""} onClick={() => setOrder("correct")}>{`{ ...produto, ...alteracoes }`}</button><button className={order === "reversed" ? "selected" : ""} onClick={() => setOrder("reversed")}>{`{ ...alteracoes, ...produto }`}</button></div></div>
      <div className="spread-workbench"><article><span>ORIGINAL</span><strong>produto</strong><code>codigo: "P01"</code><code>estoque: {original.stock}</code><code>categoria: &#123;...&#125;</code></article><div><Layers3/><strong>espalha</strong><small>da esquerda para a direita</small></div><article className="changes"><span>ALTERAÇÕES</span><strong>alteracoes</strong><label>estoque <input aria-label="Novo estoque" type="number" min="0" max="30" value={stock} onChange={event => setStock(Number(event.target.value))}/></label></article><div><Copy/><strong>produz</strong><small>outra referência</small></div><article className="result"><span>NOVO OBJETO</span><strong>atualizado</strong><code>codigo: "P01"</code><code>estoque: {resultStock}</code><code>categoria: &#123;...&#125;</code></article></div>
      <div className="spread-identities"><article><span>produto === atualizado</span><strong>false</strong><small>primeiro nível foi copiado</small></article><article className="warning"><span>produto.categoria === atualizado.categoria</span><strong>true</strong><small>objeto aninhado ainda é compartilhado</small></article></div>
      <div className="js-modern-prediction"><div><span className="eyebrow">CÓPIA RASA</span><strong>Alterar <code>atualizado.categoria.nome</code> pode afetar produto.categoria.nome?</strong></div><div><button onClick={() => setAnswer("sim")} className={answer === "sim" ? "selected" : ""}>Sim</button><button onClick={() => setAnswer("nao")} className={answer === "nao" ? "selected" : ""}>Não</button></div></div>
      {answer && <div className={`js-modern-feedback ${answer === "sim" ? "correct" : "incorrect"}`}><CheckCircle2/><span>{answer === "sim" ? "Correto. Spread copia só o primeiro nível; categoria ainda aponta para o mesmo objeto." : "Essa seria uma cópia profunda. Spread mantém referências aninhadas compartilhadas."}</span></div>}
    </section>
  );
}
