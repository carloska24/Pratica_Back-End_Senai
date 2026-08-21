"use client";

import { CheckCircle2, ListPlus, Plus, X } from "lucide-react";
import { useState } from "react";

export default function FlexibleParametersLab() {
  const [level, setLevel] = useState<"undefined" | "WARN" | "ERROR">("undefined");
  const [messages, setMessages] = useState(["API iniciada", "porta 3000"]);
  const [answer, setAnswer] = useState<"padrao" | "null" | null>(null);
  const effectiveLevel = level === "undefined" ? "INFO" : level;
  const addMessage = () => setMessages(values => values.length >= 4 ? values : [...values, `mensagem ${values.length + 1}`]);

  return (
    <section className="modern-js-lab parameters-lab">
      <div className="js-modern-heading"><div><span className="eyebrow">PAINEL DE PARÂMETROS</span><h2>Uma entrada tem padrão; as restantes viram array</h2><p>Altere o nível e a quantidade de mensagens para acompanhar default e rest.</p></div><ListPlus/></div>
      <div className="parameter-signature"><code>criarLog(nivel = "INFO", ...mensagens)</code></div>
      <div className="parameter-inputs"><article><span>ARGUMENTO 1 · NIVEL</span><div>{(["undefined", "WARN", "ERROR"] as const).map(value => <button key={value} className={level === value ? "selected" : ""} onClick={() => setLevel(value)}>{value}</button>)}</div><strong>nivel = "{effectiveLevel}"</strong></article><article><span>ARGUMENTOS RESTANTES</span><div className="message-list">{messages.map((message, index) => <button key={`${message}-${index}`} title="Remover mensagem" onClick={() => setMessages(values => values.filter((_, itemIndex) => itemIndex !== index))}><code>{message}</code><X/></button>)}<button className="add" disabled={messages.length >= 4} onClick={addMessage}><Plus/> adicionar</button></div><strong>mensagens.length = {messages.length}</strong></article></div>
      <div className="rest-array"><span>ARRAY CRIADO PELO REST</span><code>[{messages.map(message => `"${message}"`).join(", ")}]</code></div>
      <div className="parameter-output"><span>RESULTADO</span><strong>[{effectiveLevel}] {messages.join(" | ")}</strong></div>
      <div className="js-modern-prediction"><div><span className="eyebrow">QUANDO O DEFAULT ATIVA?</span><strong>Se o argumento enviado for <code>null</code>, nivel recebe "INFO"?</strong></div><div><button onClick={() => setAnswer("padrao")} className={answer === "padrao" ? "selected" : ""}>Sim</button><button onClick={() => setAnswer("null")} className={answer === "null" ? "selected" : ""}>Não</button></div></div>
      {answer && <div className={`js-modern-feedback ${answer === "null" ? "correct" : "incorrect"}`}><CheckCircle2/><span>{answer === "null" ? "Correto. O parâmetro padrão entra apenas para undefined ou argumento ausente; null é mantido." : "null foi enviado de propósito e não ativa o default. Apenas undefined ativa o valor INFO."}</span></div>}
    </section>
  );
}
