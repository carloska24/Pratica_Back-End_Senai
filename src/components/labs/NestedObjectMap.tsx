"use client";

import { useState } from "react";
import {
  Braces,
  Brackets,
  CheckCircle2,
  CircleHelp,
  GitBranch,
  RotateCcw,
} from "lucide-react";

const order = {
  numero: 1042,
  cliente: { nome: "Carlos", cidade: "São Paulo" },
  itens: [
    { descricao: "Teclado", preco: 249.5, quantidade: 1 },
    { descricao: "Mouse", preco: 89.75, quantidade: 2 },
  ],
};

type PathId = "customerName" | "secondDescription" | "itemsLength";

const paths = {
  customerName: {
    label: "Nome do cliente",
    code: "pedido.cliente.nome",
    result: '"Carlos"',
    type: "string",
    segments: ["pedido", "cliente", "nome"],
  },
  secondDescription: {
    label: "Descrição do segundo item",
    code: "pedido.itens[1].descricao",
    result: '"Mouse"',
    type: "string",
    segments: ["pedido", "itens", "[1]", "descricao"],
  },
  itemsLength: {
    label: "Quantidade de itens",
    code: "pedido.itens.length",
    result: "2",
    type: "number",
    segments: ["pedido", "itens", "length"],
  },
} as const;

export default function NestedObjectMap() {
  const [pathId, setPathId] = useState<PathId>("customerName");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const path = paths[pathId];
  const followsCustomer = pathId === "customerName";
  const followsItems = !followsCustomer;

  const reset = () => {
    setPathId("customerName");
    setPrediction(null);
    setChecked(false);
  };

  return (
    <section className="nested-lab" aria-labelledby="nested-lab-title">
      <div className="nested-heading">
        <div><span className="eyebrow">MAPA DE DADOS ANINHADOS</span><h2 id="nested-lab-title">Siga um caminho até encontrar o valor</h2><p>Cada ponto avança por uma chave; cada colchete escolhe uma posição do array.</p></div>
        <button className="icon-btn" type="button" title="Reiniciar mapa" aria-label="Reiniciar mapa" onClick={reset}><RotateCcw size={18}/></button>
      </div>

      <div className="nested-route-picker" aria-label="Caminhos disponíveis">
        {(Object.entries(paths) as [PathId, (typeof paths)[PathId]][]).map(([id, option]) => <button type="button" key={id} className={pathId === id ? "selected" : ""} onClick={() => setPathId(id)}><span>{option.label}</span><code>{option.code}</code></button>)}
      </div>

      <div className="nested-breadcrumb" aria-live="polite">
        {path.segments.map((segment, index) => <div key={`${pathId}-${segment}`}><span>{index === 0 ? "RAIZ" : segment.startsWith("[") ? "ÍNDICE" : "CHAVE"}</span><strong>{segment}</strong>{index < path.segments.length - 1 && <b>→</b>}</div>)}
      </div>

      <div className="nested-tree">
        <div className="nested-root"><Braces size={21}/><span>OBJETO RAIZ</span><strong>pedido</strong><small>numero · cliente · itens</small></div>
        <div className="nested-tree-line"><GitBranch size={22}/></div>
        <div className="nested-branches">
          <article className={followsCustomer ? "active customer" : "customer"}>
            <div className="nested-branch-title"><Braces size={18}/><span>CHAVE</span><strong>cliente {`{}`}</strong></div>
            <div className={followsCustomer ? "nested-leaf selected" : "nested-leaf"}><code>nome</code><b>:</b><strong>"{order.cliente.nome}"</strong></div>
            <div className="nested-leaf"><code>cidade</code><b>:</b><strong>"{order.cliente.cidade}"</strong></div>
          </article>

          <article className={followsItems ? "active items" : "items"}>
            <div className="nested-branch-title"><Brackets size={18}/><span>CHAVE</span><strong>itens [{order.itens.length}]</strong></div>
            <div className="nested-items">
              {order.itens.map((item, index) => <div key={item.descricao} className={pathId === "secondDescription" && index === 1 ? "nested-item selected" : "nested-item"}><span>ÍNDICE {index}</span><strong>{`{`} descricao: "{item.descricao}" {`}`}</strong><small>preco {item.preco} · quantidade {item.quantidade}</small></div>)}
            </div>
            <div className={pathId === "itemsLength" ? "nested-length selected" : "nested-length"}><code>length</code><strong>{order.itens.length}</strong></div>
          </article>
        </div>
      </div>

      <div className="nested-result">
        <div><span>CAMINHO EXECUTADO</span><code>{path.code}</code></div><b>→</b><div><span>VALOR ENCONTRADO</span><strong>{path.result}</strong><small>{path.type}</small></div>
      </div>

      <div className="nested-language-map">
        <article><Braces size={19}/><div><span>OBJETO {`{}`}</span><strong>navegue por chaves</strong><p><code>pedido.cliente</code></p></div></article>
        <article><Brackets size={19}/><div><span>ARRAY []</span><strong>navegue por índices</strong><p><code>pedido.itens[1]</code></p></div></article>
        <article><GitBranch size={19}/><div><span>JSON DA API</span><strong>preserva essa organização</strong><p>Dados viajam sem métodos ou funções.</p></div></article>
      </div>

      <div className="nested-total-bridge">
        <span>PONTE PARA O DESAFIO</span><div><code>249.5 × 1</code><b>+</b><code>89.75 × 2</code><b>=</b><strong>429</strong></div><p>Uma função percorre <code>pedido.itens</code> e acumula o subtotal de cada objeto.</p>
      </div>

      <div className="nested-prediction">
        <div><span className="eyebrow">PREVISÃO ANTES DE EXECUTAR</span><strong>Qual valor sai de <code>pedido.itens[1].descricao</code>?</strong></div>
        <div className="nested-options">
          {["Teclado", "Mouse", "undefined"].map(option => <button type="button" key={option} className={prediction === option ? "selected" : ""} onClick={() => { setPrediction(option); setChecked(false); }}>{option}</button>)}
          <button type="button" className="check-answer" disabled={prediction === null} onClick={() => setChecked(true)}>Conferir</button>
        </div>
      </div>

      {checked && <div className={`nested-feedback ${prediction === "Mouse" ? "correct" : "incorrect"}`} role="status">{prediction === "Mouse" ? <CheckCircle2 size={18}/> : <CircleHelp size={18}/>}<span>{prediction === "Mouse" ? "Correto. itens[1] escolhe o segundo objeto; .descricao lê o valor Mouse." : "Lembre que o primeiro item está no índice 0. O índice 1 aponta para o segundo objeto do array."}</span></div>}

      <div className="nested-mental-rule"><GitBranch size={21}/><p><b>Leitura mental:</b> comece na raiz → avance uma chave por ponto → escolha posições por índice → termine na propriedade desejada.</p></div>
    </section>
  );
}
