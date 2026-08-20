"use client";

import { CalendarClock, CheckCircle2, ChevronRight, Globe2 } from "lucide-react";
import { useState } from "react";

const samples = [
  "2026-08-20T15:30:00.000Z",
  "2027-01-05T08:15:30.000Z",
  "2028-12-31T23:59:59.000Z",
];

export default function DateTimeline() {
  const [iso, setIso] = useState(samples[0]);
  const [answer, setAnswer] = useState<"7" | "8" | null>(null);
  const date = new Date(iso);
  const parts = [
    ["ANO", date.getUTCFullYear()], ["MÊS + 1", date.getUTCMonth() + 1], ["DIA", date.getUTCDate()],
    ["HORA", String(date.getUTCHours()).padStart(2, "0")], ["MINUTO", String(date.getUTCMinutes()).padStart(2, "0")], ["FUSO", "UTC"],
  ];

  return (
    <section className="m10-lab date-lab">
      <div className="m10-heading"><div><span className="eyebrow">LINHA DO TEMPO DA API</span><h2>Uma string ISO representa um instante</h2><p>Troque o registro e observe como o Date separa partes previsíveis em UTC.</p></div><CalendarClock/></div>
      <div className="date-picker" aria-label="Instantes disponíveis">{samples.map(value => <button key={value} className={iso === value ? "selected" : ""} onClick={() => setIso(value)}><Globe2/><span>REGISTRO ISO</span><code>{value}</code></button>)}</div>
      <div className="date-flow"><article><span>1 · TEXTO RECEBIDO</span><code>{iso}</code></article><ChevronRight/><article><span>2 · CONSTRUTOR</span><code>new Date(dataIso)</code></article><ChevronRight/><article className="active"><span>3 · INSTANTE</span><strong>{date.toISOString()}</strong></article></div>
      <div className="date-parts">{parts.map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div>
      <div className="date-note"><Globe2/><p>O <b>Z</b> no final significa UTC. Para este curso e para integrações, ele impede que “15:30” seja interpretado como um horário local sem referência.</p></div>
      <div className="m10-prediction"><div><span className="eyebrow">A ARMADILHA DO MÊS</span><strong>Em agosto, quanto devolve <code>getUTCMonth()</code> sem somar 1?</strong></div><div><button onClick={() => setAnswer("7")} className={answer === "7" ? "selected" : ""}>7</button><button onClick={() => setAnswer("8")} className={answer === "8" ? "selected" : ""}>8</button></div></div>
      {answer && <div className={`m10-feedback ${answer === "7" ? "correct" : "incorrect"}`}><CheckCircle2/><span>{answer === "7" ? "Correto. Em Date, janeiro é 0; agosto é 7. Somamos 1 para exibir o mês humano." : "Agosto é o mês humano 8, mas getUTCMonth() começa janeiro no índice 0."}</span></div>}
    </section>
  );
}
