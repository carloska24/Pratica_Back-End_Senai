"use client";

import { Box, CheckCircle2, PackageOpen } from "lucide-react";
import { useState } from "react";

const fields = [
  { id: "code", path: "pedido.codigo", variable: "codigo", value: '"PED-10"' },
  { id: "name", path: "pedido.cliente.nome", variable: "nomeCliente", value: '"Carlos"' },
  { id: "first", path: "pedido.itens[0]", variable: "primeiroItem", value: '"Teclado"' },
];

export default function DestructuringLab() {
  const [selected, setSelected] = useState<string[]>(["code"]);
  const [answer, setAnswer] = useState<"copia" | "extrai" | null>(null);
  const toggle = (id: string) => setSelected(values => values.includes(id) ? values.filter(value => value !== id) : [...values, id]);
  const pattern = `{ ${fields.filter(field => selected.includes(field.id)).map(field => field.id === "name" ? "cliente: { nome: nomeCliente }" : field.id === "first" ? "itens: [primeiroItem]" : "codigo").join(", ")} }`;

  return (
    <section className="modern-js-lab destructuring-lab">
      <div className="js-modern-heading"><div><span className="eyebrow">MESA DE DESESTRUTURAÇÃO</span><h2>Escolha quais valores merecem caixinhas locais</h2><p>Clique nos caminhos; o padrão de destructuring será montado na mesma ordem.</p></div><PackageOpen/></div>
      <div className="destructure-source"><div><Box/><span>OBJETO RECEBIDO</span><strong>pedido</strong></div>{fields.map(field => <button key={field.id} className={selected.includes(field.id) ? "selected" : ""} onClick={() => toggle(field.id)}><code>{field.path}</code><span>{field.value}</span>{selected.includes(field.id) && <CheckCircle2/>}</button>)}</div>
      <div className="destructure-pattern"><span>PADRÃO GERADO</span><code>const {pattern || "{ }"} = pedido;</code></div>
      <div className="destructure-boxes">{fields.filter(field => selected.includes(field.id)).map(field => <article key={field.id}><span>VARIÁVEL LOCAL</span><strong>{field.variable}</strong><code>{field.value}</code></article>)}{selected.length === 0 && <p>Selecione ao menos um caminho para criar uma variável.</p>}</div>
      <div className="rename-rule"><strong>Os dois-pontos não criam outro objeto</strong><p><code>nome: nomeCliente</code> lê a propriedade nome e cria a variável local nomeCliente.</p></div>
      <div className="js-modern-prediction"><div><span className="eyebrow">O QUE ACONTECEU?</span><strong>Destructuring remove propriedades do objeto original?</strong></div><div><button onClick={() => setAnswer("copia")} className={answer === "copia" ? "selected" : ""}>Remove</button><button onClick={() => setAnswer("extrai")} className={answer === "extrai" ? "selected" : ""}>Não remove</button></div></div>
      {answer && <div className={`js-modern-feedback ${answer === "extrai" ? "correct" : "incorrect"}`}><CheckCircle2/><span>{answer === "extrai" ? "Correto. Ele lê valores e cria variáveis; pedido continua com todas as propriedades." : "Destructuring não recorta o objeto. Ele apenas lê os valores escolhidos."}</span></div>}
    </section>
  );
}
