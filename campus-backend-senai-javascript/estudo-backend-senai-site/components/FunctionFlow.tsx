"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BrainCircuit, CheckCircle2, RotateCcw, Target } from "lucide-react";

export default function FunctionFlow() {
  const [age, setAge] = useState(20);
  const [step, setStep] = useState(0);
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const [checked, setChecked] = useState(false);
  const result = age >= 18;

  const trace = useMemo(() => [
    { label: "Chamada", value: `verificarMaioridade(${age})`, note: `${age} é o argumento enviado.` },
    { label: "Parâmetro", value: `idade = ${age}`, note: "A caixinha idade recebe o argumento." },
    { label: "Decisão", value: `${age} >= 18`, note: `A comparação resulta em ${result}.` },
    { label: "Retorno", value: `return ${result}`, note: "A função entrega a resposta e termina." },
    { label: "Destino", value: `resultado = ${result}`, note: "Quem chamou guarda o valor devolvido." },
  ], [age, result]);

  const reset = (nextAge: number) => {
    setAge(nextAge);
    setStep(0);
    setPrediction(null);
    setChecked(false);
  };

  return (
    <section className="function-lab" aria-labelledby="function-lab-title">
      <div className="function-lab-heading">
        <div><span className="eyebrow">MAPA MENTAL EXECUTÁVEL</span><h2 id="function-lab-title">Siga o valor até ele voltar pelo return</h2></div>
        <button className="icon-btn" type="button" title="Reiniciar simulação" aria-label="Reiniciar simulação" onClick={() => reset(20)}><RotateCcw size={18}/></button>
      </div>

      <div className="function-controls">
        <label htmlFor="age-simulator"><span>Idade enviada</span><strong>{age} anos</strong></label>
        <input id="age-simulator" type="range" min="12" max="25" value={age} onChange={(event) => reset(Number(event.target.value))}/>
        <div className="prediction-group" aria-label="Previsao do retorno">
          <span>Antes de avançar, qual valor volta?</span>
          <div>
            <button type="button" className={prediction === true ? "selected" : ""} onClick={() => { setPrediction(true); setChecked(false); }}>true</button>
            <button type="button" className={prediction === false ? "selected" : ""} onClick={() => { setPrediction(false); setChecked(false); }}>false</button>
            <button type="button" className="check-prediction" disabled={prediction === null} onClick={() => setChecked(true)}>Conferir</button>
          </div>
        </div>
      </div>

      {checked && <div className={`prediction-feedback ${prediction === result ? "correct" : "incorrect"}`} role="status">
        {prediction === result ? <CheckCircle2 size={18}/> : <Target size={18}/>}<span>{prediction === result ? "Boa leitura: você previu o caminho antes de executar." : `Olhe novamente para a comparação: ${age} >= 18 resulta em ${result}.`}</span>
      </div>}

      <div className="function-flow" aria-label="Fluxo da execução">
        {trace.map((item, index) => <div className="function-flow-piece" key={item.label}>
          <button type="button" className={`${index === step ? "active" : ""} ${index < step ? "visited" : ""}`} onClick={() => setStep(index)}>
            <span>{String(index + 1).padStart(2, "0")} · {item.label}</span><strong>{item.value}</strong>
          </button>
          {index < trace.length - 1 && <ArrowRight className={index < step ? "visited" : ""} size={18}/>} 
        </div>)}
      </div>

      <div className="trace-reader">
        <BrainCircuit size={20}/><div><span>O computador está neste ponto</span><strong>{trace[step].note}</strong></div>
        <button className="btn btn-primary" type="button" disabled={step === trace.length - 1} onClick={() => setStep(current => Math.min(trace.length - 1, current + 1))}>{step === trace.length - 1 ? "Fluxo concluído" : "Próximo passo"}<ArrowRight size={16}/></button>
      </div>
    </section>
  );
}
