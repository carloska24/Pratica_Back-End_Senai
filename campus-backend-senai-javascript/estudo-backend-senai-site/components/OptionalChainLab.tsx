"use client";

import { CheckCircle2, Link2, ShieldCheck, XCircle } from "lucide-react";
import { useState } from "react";

type Payload = "complete" | "noAddress" | "noUser";
const payloads = {
  complete: { label: "completo", user: true, address: true, city: "Campinas" },
  noAddress: { label: "sem endereço", user: true, address: false, city: undefined },
  noUser: { label: "sem usuário", user: false, address: false, city: undefined },
};

export default function OptionalChainLab() {
  const [payload, setPayload] = useState<Payload>("noAddress");
  const [answer, setAnswer] = useState<"zero" | "dez" | null>(null);
  const data = payloads[payload];
  const safe = data.city ?? "Não informada";

  return (
    <section className="modern-js-lab optional-lab">
      <div className="js-modern-heading"><div><span className="eyebrow">ROTA DE ACESSO SEGURO</span><h2>Cada ?. pergunta se ainda existe caminho</h2><p>Remova partes do payload e compare o acesso direto com optional chaining.</p></div><ShieldCheck/></div>
      <div className="payload-tabs">{(Object.keys(payloads) as Payload[]).map(name => <button key={name} className={payload === name ? "selected" : ""} onClick={() => setPayload(name)}>{payloads[name].label}</button>)}</div>
      <div className="optional-path"><article className="exists"><span>payload</span><strong>&#123;...&#125;</strong><CheckCircle2/></article><Link2/><article className={data.user ? "exists" : "missing"}><span>usuario</span><strong>{data.user ? "{...}" : "undefined"}</strong>{data.user ? <CheckCircle2/> : <XCircle/>}</article><b>?.</b><article className={data.address ? "exists" : "missing"}><span>endereco</span><strong>{data.address ? "{...}" : "undefined"}</strong>{data.address ? <CheckCircle2/> : <XCircle/>}</article><b>?.</b><article className={data.city ? "exists" : "missing"}><span>cidade</span><strong>{data.city ? `"${data.city}"` : "undefined"}</strong>{data.city ? <CheckCircle2/> : <XCircle/>}</article></div>
      <div className="access-comparison"><article className={data.user && data.address ? "safe" : "error"}><span>ACESSO DIRETO</span><code>payload.usuario.endereco.cidade</code><strong>{data.user && data.address ? `"${data.city}"` : "TypeError: caminho interrompido"}</strong></article><article className="safe"><span>ACESSO SEGURO + FALLBACK</span><code>payload.usuario?.endereco?.cidade ?? "Não informada"</code><strong>"{safe}"</strong></article></div>
      <div className="nullish-rule"><strong>?? preserva valores válidos falsos</strong><p><code>0</code>, <code>false</code> e <code>""</code> não são ausência. Somente null e undefined acionam o lado direito.</p></div>
      <div className="js-modern-prediction"><div><span className="eyebrow">NULLISH COALESCING</span><strong>Quanto vale <code>0 ?? 10</code>?</strong></div><div><button onClick={() => setAnswer("zero")} className={answer === "zero" ? "selected" : ""}>0</button><button onClick={() => setAnswer("dez")} className={answer === "dez" ? "selected" : ""}>10</button></div></div>
      {answer && <div className={`js-modern-feedback ${answer === "zero" ? "correct" : "incorrect"}`}><CheckCircle2/><span>{answer === "zero" ? "Correto. Zero existe e é preservado; apenas null ou undefined usariam 10." : "Isso aconteceria com 0 || 10. O operador ?? preserva o zero."}</span></div>}
    </section>
  );
}
