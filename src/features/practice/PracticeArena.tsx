"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Code2, Lightbulb, LockKeyhole, RotateCcw, Target } from "lucide-react";
import { readSequentialIntegers } from "@/progress/storage";

const challenges = [
  {
    title: "Parâmetro x argumento",
    level: "Leitura",
    code: `function dobrar(numero) {\n  return numero * 2;\n}\n\nconst resultado = dobrar(6);`,
    question: "Na chamada dobrar(6), quem é o parâmetro e quem é o argumento?",
    options: ["numero é parâmetro; 6 é argumento", "6 é parâmetro; numero é argumento", "resultado é parâmetro; dobrar é argumento"],
    answer: 0,
    explanation: "numero é a caixinha preparada na definição. O valor 6 é colocado nela quando a função é chamada."
  },
  {
    title: "console.log ou return?",
    level: "Decisao",
    code: `function calcularTotal(preco, quantidade) {\n  return preco * quantidade;\n}\n\nconst total = calcularTotal(15, 3);`,
    question: "Por que return é necessário neste caso?",
    options: ["Para repetir a função", "Para entregar 45 e permitir que total guarde o valor", "Para mostrar 45 automaticamente no console"],
    answer: 1,
    explanation: "return entrega o valor para a linha da chamada. Ele não imprime nada sozinho; total passa a guardar 45."
  },
  {
    title: "Função + if",
    level: "Fluxo",
    code: `function podeAcessar(idade) {\n  if (idade >= 18) {\n    return true;\n  }\n  return false;\n}\n\nconst acesso = podeAcessar(16);`,
    question: "Qual valor fica guardado em acesso?",
    options: ["true", "false", "16", "undefined"],
    answer: 1,
    explanation: "16 >= 18 é false. O primeiro return não executa; o fluxo chega ao return false."
  },
  {
    title: "Return encerra",
    level: "Rastreamento",
    code: `function classificar(nota) {\n  if (nota >= 7) return "Aprovado";\n  return "Revisar";\n  console.log("Fim");\n}\n\nclassificar(8);`,
    question: "O console.log da função será executado?",
    options: ["Sim, depois de devolver Aprovado", "Não, a função termina no primeiro return", "Sim, antes do if"],
    answer: 1,
    explanation: "Assim que return executa, aquela chamada termina. Linhas colocadas depois dele ficam inacessíveis nesse caminho."
  },
  {
    title: "Função chamando função",
    level: "Composição",
    code: `function desconto(preco) {\n  return preco * 0.1;\n}\n\nfunction precoFinal(preco) {\n  return preco - desconto(preco);\n}\n\nprecoFinal(200);`,
    question: "Qual é a ordem dos valores devolvidos?",
    options: ["200 e depois 20", "20 e depois 180", "180 e depois 20"],
    answer: 1,
    explanation: "desconto(200) devolve 20 primeiro. Depois precoFinal calcula 200 - 20 e devolve 180."
  },
  {
    title: "Mini sistema",
    level: "Integração",
    code: `function estaAprovado(nota, frequencia) {\n  return nota >= 7 && frequencia >= 75;\n}\n\nconst situacao = estaAprovado(8, 70);`,
    question: "Qual é o valor de situacao e por quê?",
    options: ["true, porque a nota é 8", "false, porque uma das duas regras falhou", "70, porque é o último argumento"],
    answer: 1,
    explanation: "O operador && exige as duas condições verdadeiras. A nota passa, mas a frequência 70 não chega a 75."
  }
] as const;

const STORAGE_KEY = "campus-practice-challenges";

export default function PracticeArena() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = readSequentialIntegers(STORAGE_KEY, challenges.length);
      setSolved(saved);
      setActive(Math.min(saved.length, challenges.length - 1));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {}
  }, []);

  const challenge = challenges[active];
  const isCorrect = selected === challenge.answer;
  const unlockedThrough = Math.min(challenges.length - 1, solved.length);

  const chooseChallenge = (index: number) => {
    if (index > unlockedThrough) return;
    setActive(index);
    setSelected(null);
    setChecked(false);
  };

  const checkAnswer = () => {
    if (selected === null) return;
    setChecked(true);
    if (selected === challenge.answer && !solved.includes(active)) {
      const next = [...solved, active].sort((a, b) => a - b);
      setSolved(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("campus-progress-changed"));
    }
  };

  const reset = () => {
    setSolved([]);
    setActive(0);
    setSelected(null);
    setChecked(false);
    localStorage.setItem(STORAGE_KEY, "[]");
    window.dispatchEvent(new Event("campus-progress-changed"));
  };

  return (
    <div className="arena-practice panel">
      <header className="arena-practice-header">
        <div><span className="eyebrow">ARENA DE FUNÇÕES</span><h1>Leia, preveja, responda, explique.</h1><p>Cada etapa libera a seguinte. Depois da resposta, compare seu raciocínio com a justificativa exibida.</p></div>
        <div className="arena-progress"><strong>{solved.length}/{challenges.length}</strong><span>resolvidos</span><button className="icon-btn" type="button" title="Reiniciar desafios" aria-label="Reiniciar desafios" onClick={reset}><RotateCcw size={17}/></button></div>
      </header>

      {solved.length === challenges.length && <div className="module-mastery-callout"><CheckCircle2 size={22}/><div><span>FECHAMENTO DE FUNÇÕES LIBERADO</span><strong>Reconstrua o Desafio01_Pedido.js no Laboratório sem consultar a solução.</strong><p>O M07 só deve ser considerado concluído quando você conseguir explicar parâmetros, prever cada return e justificar por que as três funções possuem responsabilidades separadas.</p></div></div>}

      <div className="arena-practice-layout">
        <nav className="challenge-list" aria-label="Desafios de funções">
          {challenges.map((item, index) => {
            const locked = index > unlockedThrough;
            return <button type="button" key={item.title} disabled={locked} className={`${index === active ? "active" : ""} ${solved.includes(index) ? "done" : ""}`} onClick={() => chooseChallenge(index)}>
              <span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.title}</strong><small>{item.level}</small></div>{locked ? <LockKeyhole size={16}/> : solved.includes(index) ? <CheckCircle2 size={17}/> : <ArrowRight size={17}/>} 
            </button>;
          })}
        </nav>

        <section className="challenge-station">
          <div className="challenge-station-top"><span className="eyebrow">DESAFIO {String(active + 1).padStart(2, "0")} · {challenge.level.toUpperCase()}</span><Target size={20}/></div>
          <h2>{challenge.title}</h2>
          <div className="challenge-code"><div><Code2 size={16}/> Leia sem executar</div><pre>{challenge.code}</pre></div>
          <p className="challenge-question">{challenge.question}</p>
          <div className="answer-list">
            {challenge.options.map((option, index) => <button type="button" key={option} className={selected === index ? "selected" : ""} onClick={() => { setSelected(index); setChecked(false); }}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}
          </div>
          {checked && <div className={`answer-explanation ${isCorrect ? "correct" : "incorrect"}`} role="status"><Lightbulb size={19}/><div><strong>{isCorrect ? "Raciocínio correto" : "Ainda não"}</strong><p>{challenge.explanation}</p></div></div>}
          <div className="challenge-actions">
            <button className="btn btn-primary" type="button" disabled={selected === null} onClick={checkAnswer}>Conferir raciocínio</button>
            {checked && isCorrect && active < challenges.length - 1 && <button className="btn btn-soft" type="button" onClick={() => chooseChallenge(active + 1)}>Próximo desafio <ArrowRight size={16}/></button>}
          </div>
        </section>
      </div>
    </div>
  );
}
