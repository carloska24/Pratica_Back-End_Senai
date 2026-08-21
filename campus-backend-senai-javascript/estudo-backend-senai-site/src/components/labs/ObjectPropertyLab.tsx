"use client";

import { useState } from "react";
import { Box, Brackets, CheckCircle2, CircleHelp, Minus, Plus, RotateCcw } from "lucide-react";

type Product = {
  codigo: string;
  nome: string;
  estoque: number;
  ultimaMovimentacao?: string;
};

type Operation = {
  code: string;
  before: string;
  after: string;
  explanation: string;
};

const initialProduct: Product = { codigo: "P002", nome: "Mouse", estoque: 12 };
const initialOperation: Operation = {
  code: "const produto = { codigo: \"P002\", nome: \"Mouse\", estoque: 12 }",
  before: "objeto ainda não alterado",
  after: "3 propriedades",
  explanation: "const protege a referência produto; as propriedades internas ainda podem mudar.",
};

function formatValue(value: string | number) {
  return typeof value === "string" ? `"${value}"` : String(value);
}

export default function ObjectPropertyLab() {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [accessMode, setAccessMode] = useState<"dot" | "brackets">("dot");
  const [operation, setOperation] = useState<Operation>(initialOperation);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const removeStock = () => {
    if (product.estoque < 3) return;
    const before = product.estoque;
    const after = before - 3;
    setProduct(current => ({ ...current, estoque: after }));
    setOperation({
      code: "produto[campo] -= 3",
      before: `estoque = ${before}`,
      after: `estoque = ${after}`,
      explanation: "campo contém \"estoque\"; os colchetes transformam esse texto na propriedade que será atualizada.",
    });
  };

  const createMovement = () => {
    const existed = product.ultimaMovimentacao !== undefined;
    setProduct(current => ({ ...current, ultimaMovimentacao: "saída" }));
    setOperation({
      code: "produto.ultimaMovimentacao = \"saída\"",
      before: existed ? "propriedade já existia" : "propriedade inexistente",
      after: "ultimaMovimentacao = \"saída\"",
      explanation: existed ? "A atribuição atualizou o valor da propriedade existente." : "Como a chave não existia, a atribuição criou uma nova propriedade no objeto.",
    });
  };

  const reset = () => {
    setProduct(initialProduct);
    setAccessMode("dot");
    setOperation(initialOperation);
    setPrediction(null);
    setChecked(false);
  };

  return (
    <section className="property-lab" aria-labelledby="property-lab-title">
      <div className="property-heading">
        <div><span className="eyebrow">BANCADA DE PROPRIEDADES</span><h2 id="property-lab-title">Leia uma chave, altere um valor, crie outra informação</h2><p>O objeto continua sendo o mesmo; apenas seu estado interno muda.</p></div>
        <button className="icon-btn" type="button" title="Reiniciar bancada" aria-label="Reiniciar bancada" onClick={reset}><RotateCcw size={18}/></button>
      </div>

      <div className="property-access">
        <div className="property-mode" aria-label="Forma de acesso">
          <span>FORMA DE ACESSO</span>
          <div><button type="button" aria-pressed={accessMode === "dot"} className={accessMode === "dot" ? "selected" : ""} onClick={() => setAccessMode("dot")}>Ponto</button><button type="button" aria-pressed={accessMode === "brackets"} className={accessMode === "brackets" ? "selected" : ""} onClick={() => setAccessMode("brackets")}>Colchetes</button></div>
        </div>
        <div className="dynamic-key"><span>CHAVE DINÂMICA</span><code>const campo = "estoque"</code></div>
        <div className="access-expression"><span>EXPRESSÃO</span><code>{accessMode === "dot" ? "produto.estoque" : "produto[campo]"}</code><strong>→ {product.estoque}</strong></div>
      </div>

      <div className="property-workbench">
        <div className="property-object">
          <div className="property-object-title"><Box size={18}/><div><span>ESTADO ATUAL</span><strong>const produto</strong></div><small>{Object.keys(product).length} propriedades</small></div>
          <div className="property-list">
            {Object.entries(product).map(([key, value]) => <div key={key} className={key === "ultimaMovimentacao" ? "created" : key === "estoque" ? "changed" : ""}><code>{key}</code><b>:</b><strong>{formatValue(value)}</strong><small>{typeof value}</small></div>)}
          </div>
        </div>

        <div className="property-commands">
          <button type="button" onClick={removeStock} disabled={product.estoque < 3}><Minus size={18}/><span><b>Registrar saída de 3</b><small>produto[campo] -= 3</small></span></button>
          <button type="button" onClick={createMovement}><Plus size={18}/><span><b>Criar movimentação</b><small>produto.ultimaMovimentacao = "saída"</small></span></button>
        </div>
      </div>

      <div className="property-operation" aria-live="polite">
        <div><span>LINHA EXECUTADA</span><code>{operation.code}</code></div>
        <div className="property-diff"><span>{operation.before}</span><b>→</b><strong>{operation.after}</strong></div>
        <p>{operation.explanation}</p>
      </div>

      <div className="property-comparison">
        <article><span>PONTO</span><code>produto.estoque</code><p>A chave está escrita diretamente no código.</p></article>
        <article><span>COLCHETES</span><code>produto[campo]</code><p>O valor da variável campo decide qual chave acessar.</p></article>
        <article><span>CONST</span><code>produto.estoque = 9</code><p>Permitido: a referência não foi trocada; uma propriedade mudou.</p></article>
      </div>

      <div className="property-prediction">
        <div><span className="eyebrow">PREVISÃO ANTES DE EXECUTAR</span><strong>Se <code>ultimaMovimentacao</code> ainda não existe, o que a atribuição faz?</strong></div>
        <div className="property-options">
          <button type="button" className={prediction === "error" ? "selected" : ""} onClick={() => { setPrediction("error"); setChecked(false); }}>Gera erro</button>
          <button type="button" className={prediction === "create" ? "selected" : ""} onClick={() => { setPrediction("create"); setChecked(false); }}>Cria a propriedade</button>
          <button type="button" className={prediction === "replace" ? "selected" : ""} onClick={() => { setPrediction("replace"); setChecked(false); }}>Troca o objeto</button>
          <button type="button" className="check-answer" disabled={prediction === null} onClick={() => setChecked(true)}>Conferir</button>
        </div>
      </div>

      {checked && <div className={`property-feedback ${prediction === "create" ? "correct" : "incorrect"}`} role="status">{prediction === "create" ? <CheckCircle2 size={18}/> : <CircleHelp size={18}/>}<span>{prediction === "create" ? "Correto. A atribuição cria a nova chave dentro do mesmo objeto." : "A referência produto continua igual. JavaScript permite adicionar uma propriedade que ainda não existia."}</span></div>}

      <div className="property-mental-rule"><Brackets size={21}/><p><b>Leitura mental:</b> ponto usa uma chave conhecida; colchetes resolvem uma chave dinâmica; atribuição atualiza ou cria.</p></div>
    </section>
  );
}
