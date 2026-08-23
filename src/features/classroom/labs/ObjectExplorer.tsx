"use client";

import { useState } from "react";
import { Braces, CheckCircle2, CircleHelp, KeyRound, RotateCcw } from "lucide-react";

const properties = [
  { key: "codigo", value: "P001", type: "string" },
  { key: "nome", value: "Teclado mecânico", type: "string" },
  { key: "preco", value: 249.9, type: "number" },
  { key: "ativo", value: true, type: "boolean" },
] as const;

function formatValue(value: string | number | boolean) {
  return typeof value === "string" ? `"${value}"` : String(value);
}

export default function ObjectExplorer() {
  const [selectedKey, setSelectedKey] = useState<(typeof properties)[number]["key"]>("codigo");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const selected = properties.find(property => property.key === selectedKey) ?? properties[0];

  const reset = () => {
    setSelectedKey("codigo");
    setPrediction(null);
    setChecked(false);
  };

  return (
    <section className="object-lab" aria-labelledby="object-lab-title">
      <div className="object-heading">
        <div>
          <span className="eyebrow">ANATOMIA DO OBJETO</span>
          <h2 id="object-lab-title">Uma entidade, várias características nomeadas</h2>
          <p>Clique em uma propriedade para acompanhar a chave até o valor que ela identifica.</p>
        </div>
        <button className="icon-btn" type="button" title="Reiniciar explorador" aria-label="Reiniciar explorador" onClick={reset}><RotateCcw size={18}/></button>
      </div>

      <div className="object-workbench">
        <div className="object-identity">
          <span>VARIÁVEL</span>
          <strong>produto</strong>
          <p>Aponta para uma única entidade.</p>
          <Braces size={32}/>
        </div>

        <div className="object-shape" aria-label="Objeto produto">
          <div className="object-brace">{"{"}</div>
          <div className="object-properties">
            {properties.map(property => <button type="button" key={property.key} className={selectedKey === property.key ? "selected" : ""} onClick={() => setSelectedKey(property.key)}>
              <span className="object-key">{property.key}</span><b>:</b><code className={`value-${property.type}`}>{formatValue(property.value)}</code><i>,</i><small>{property.type}</small>
            </button>)}
          </div>
          <div className="object-brace">{"}"}</div>
        </div>
      </div>

      <div className="object-reading" aria-live="polite">
        <article><span><KeyRound size={15}/> CHAVE ESCOLHIDA</span><strong>{selected.key}</strong><p>É o nome da informação.</p></article>
        <article><span>VALOR ENCONTRADO</span><strong className={`value-${selected.type}`}>{formatValue(selected.value)}</strong><p>É o conteúdo ligado à chave.</p></article>
        <article><span>TIPO DO VALOR</span><strong>{selected.type}</strong><p><code>typeof produto.{selected.key}</code></p></article>
      </div>

      <div className="object-access-map">
        <div><span>ACESSO POR PONTO</span><code>produto.{selected.key}</code></div>
        <b>=</b>
        <div><span>ACESSO POR COLCHETES</span><code>produto["{selected.key}"]</code></div>
        <b>→</b>
        <div className="result"><span>RESULTADO</span><code>{formatValue(selected.value)}</code></div>
      </div>

      <div className="object-concept-strip">
        <div><span>CHAVE</span><strong>preco</strong><p>O endereço possui nome.</p></div>
        <div><span>VALOR</span><strong>249.9</strong><p>A informação pode mudar.</p></div>
        <div><span>PROPRIEDADE</span><strong>preco: 249.9</strong><p>É o par completo.</p></div>
      </div>

      <div className="object-prediction">
        <div><span className="eyebrow">PREVISÃO ANTES DE EXECUTAR</span><strong>Qual valor e tipo são devolvidos por <code>produto.preco</code>?</strong></div>
        <div className="object-options">
          <button type="button" className={prediction === "string" ? "selected" : ""} onClick={() => { setPrediction("string"); setChecked(false); }}><code>"249.90"</code><small>string</small></button>
          <button type="button" className={prediction === "number" ? "selected" : ""} onClick={() => { setPrediction("number"); setChecked(false); }}><code>249.9</code><small>number</small></button>
          <button type="button" className={prediction === "key" ? "selected" : ""} onClick={() => { setPrediction("key"); setChecked(false); }}><code>"preco"</code><small>string</small></button>
          <button type="button" className="check-answer" disabled={prediction === null} onClick={() => setChecked(true)}>Conferir</button>
        </div>
      </div>

      {checked && <div className={`object-feedback ${prediction === "number" ? "correct" : "incorrect"}`} role="status">
        {prediction === "number" ? <CheckCircle2 size={18}/> : <CircleHelp size={18}/>}<span>{prediction === "number"
          ? "Correto. preco é a chave; 249.9 é o valor guardado e seu tipo é number."
          : "A expressão devolve o valor ligado à chave, não o nome da chave. Sem aspas, 249.9 é number."}</span>
      </div>}

      <div className="object-mental-rule"><Braces size={21}/><p><b>Leitura mental:</b> produto é a entidade → o ponto escolhe a chave → a propriedade entrega o valor.</p></div>
    </section>
  );
}
