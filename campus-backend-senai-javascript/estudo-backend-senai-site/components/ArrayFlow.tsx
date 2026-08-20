"use client";

import { useState } from "react";
import { Brackets, CheckCircle2, CircleHelp, RotateCcw } from "lucide-react";

const items = ["Cortar", "Montar", "Testar", "Embalar"];

export default function ArrayFlow() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const selectedValue = items[selectedIndex];

  const reset = () => {
    setSelectedIndex(0);
    setPrediction(null);
    setChecked(false);
  };

  return (
    <section className="array-lab" aria-labelledby="array-lab-title">
      <div className="array-lab-heading">
        <div><span className="eyebrow">MAPA VISUAL DO ARRAY</span><h2 id="array-lab-title">Uma lista, dois números diferentes</h2><p><code>length</code> conta os elementos; o índice aponta o endereço de um deles.</p></div>
        <button className="icon-btn" type="button" title="Reiniciar mapa" aria-label="Reiniciar mapa" onClick={reset}><RotateCcw size={18}/></button>
      </div>

      <div className="array-shelf" aria-label="Array etapas">
        {items.map((item, index) => <button type="button" key={item} className={selectedIndex === index ? "active" : ""} onClick={() => setSelectedIndex(index)}>
          <span>índice {index}</span><strong>{item}</strong><code>etapas[{index}]</code>
        </button>)}
      </div>

      <div className="array-facts">
        <article><span>QUANTIDADE</span><strong>length = {items.length}</strong><p>Existem quatro elementos.</p></article>
        <article><span>ÚLTIMO ENDEREÇO</span><strong>length - 1 = {items.length - 1}</strong><p>O último índice válido é 3.</p></article>
        <article className={selectedValue === undefined ? "undefined" : "value"}><span>ACESSO ATUAL</span><strong>etapas[{selectedIndex}]</strong><p>{selectedValue === undefined ? "undefined: não existe elemento nesse endereço." : `Valor encontrado: "${selectedValue}".`}</p></article>
      </div>

      <div className="array-actions">
        <div><CircleHelp size={18}/><span>O que acontece em <code>etapas[4]</code>?</span></div>
        <button className="btn btn-soft" type="button" onClick={() => setSelectedIndex(4)}>Testar índice 4</button>
      </div>

      <div className="array-prediction">
        <div><span className="eyebrow">PREVISÃO ANTES DE EXECUTAR</span><strong>Em qual índice está o valor &quot;Testar&quot;?</strong></div>
        <div className="array-options">
          {[1, 2, 3].map(option => <button type="button" key={option} className={prediction === option ? "selected" : ""} onClick={() => { setPrediction(option); setChecked(false); }}>{option}</button>)}
          <button type="button" className="check-answer" disabled={prediction === null} onClick={() => setChecked(true)}>Conferir</button>
        </div>
      </div>

      {checked && <div className={`array-feedback ${prediction === 2 ? "correct" : "incorrect"}`} role="status">
        {prediction === 2 ? <CheckCircle2 size={18}/> : <CircleHelp size={18}/>}<span>{prediction === 2 ? "Correto. Testar é o terceiro elemento, mas mora no índice 2." : "Conte os endereços a partir de zero: Cortar = 0, Montar = 1, Testar = 2."}</span>
      </div>}

      <div className="array-mental-rule"><Brackets size={21}/><p><b>Leitura mental:</b> quatro elementos não criam o índice 4. Eles ocupam os índices 0, 1, 2 e 3.</p></div>
    </section>
  );
}
