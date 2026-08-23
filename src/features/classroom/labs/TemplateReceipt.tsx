"use client";

import { CheckCircle2, Minus, Plus, ReceiptText } from "lucide-react";
import { useState } from "react";

export default function TemplateReceipt() {
  const [quantity, setQuantity] = useState(4);
  const [answer, setAnswer] = useState<"number" | "string" | null>(null);
  const product = "Cabo de rede";
  const price = 18.5;
  const subtotal = price * quantity;

  return (
    <section className="m10-lab receipt-lab">
      <div className="m10-heading"><div><span className="eyebrow">MONTADOR DE RECIBO</span><h2>Valores entram; uma string pronta sai</h2><p>A crase mantém o molde legível e cada expressão ocupa um lugar marcado.</p></div><ReceiptText/></div>

      <div className="receipt-values">
        <article><span>produto</span><strong>{product}</strong><small>string</small></article>
        <article><span>preco</span><strong>{price}</strong><small>number</small></article>
        <article className="quantity-card"><span>quantidade</span><div><button aria-label="Diminuir quantidade" disabled={quantity === 1} onClick={() => setQuantity(value => value - 1)}><Minus/></button><strong>{quantity}</strong><button aria-label="Aumentar quantidade" disabled={quantity === 9} onClick={() => setQuantity(value => value + 1)}><Plus/></button></div><small>number</small></article>
        <article><span>subtotal</span><strong>{subtotal}</strong><small>number</small></article>
      </div>

      <div className="template-map"><code>`</code><span><b>{"${quantidade}"}</b><small>{quantity}</small></span><code>x </code><span><b>{"${produto}"}</b><small>{product}</small></span><code> | R$ </code><span><b>{"${subtotal.toFixed(2)}"}</b><small>{subtotal.toFixed(2)}</small></span><code>`</code></div>
      <div className="receipt-output"><span>STRING PRODUZIDA</span><strong>{`${quantity}x ${product} | R$ ${subtotal.toFixed(2)}`}</strong></div>

      <div className="m10-prediction"><div><span className="eyebrow">TIPO DO RESULTADO</span><strong>Qual é o tipo devolvido por <code>subtotal.toFixed(2)</code>?</strong></div><div><button onClick={() => setAnswer("number")} className={answer === "number" ? "selected" : ""}>number</button><button onClick={() => setAnswer("string")} className={answer === "string" ? "selected" : ""}>string</button></div></div>
      {answer && <div className={`m10-feedback ${answer === "string" ? "correct" : "incorrect"}`}><CheckCircle2/><span>{answer === "string" ? "Correto. toFixed prepara a exibição e devolve texto." : "A aparência é numérica, mas toFixed devolve uma string formatada."}</span></div>}
    </section>
  );
}
