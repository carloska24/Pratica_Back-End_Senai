import type { TraceSnapshot } from "./contracts";

export type PedagogicalExplanation = {
  title: string;
  explanation: string;
  evidence: string;
  prompt: string;
  tone: "neutral" | "decision" | "memory" | "call" | "output" | "success" | "error";
};

export function explainSnapshot(snapshot: TraceSnapshot): PedagogicalExplanation {
  if ((snapshot.operation === "condition" || snapshot.operation === "loop") && snapshot.expression) {
    return {
      title: snapshot.operation === "loop" ? "O laço decide se repete" : "A condição escolhe o caminho",
      explanation: snapshot.effect?.summary ?? "O JavaScript transforma a expressão em verdadeiro ou falso antes de continuar.",
      evidence: `${snapshot.expression.substituted} → ${snapshot.expression.result.display}`,
      prompt: snapshot.operation === "loop" ? "Antes de avançar: haverá outra iteração?" : "Antes de avançar: qual bloco será executado?",
      tone: "decision",
    };
  }

  if (snapshot.operation === "assign") {
    const changed = snapshot.variablesAfter.find(variable => variable.change);
    const previous = changed && snapshot.variablesBefore.find(variable => variable.name === changed.name);
    return {
      title: changed?.change === "created" ? "Uma caixinha foi criada" : "Uma caixinha mudou",
      explanation: snapshot.effect?.summary ?? "O resultado da expressão foi armazenado na memória do programa.",
      evidence: changed ? `${changed.name}: ${previous?.value.display ?? "não definido"} → ${changed.value.display}` : "A memória foi atualizada.",
      prompt: "Que valor esta variável terá no próximo passo?",
      tone: "memory",
    };
  }

  if (snapshot.operation === "call") return {
    title: "Entrando em uma função",
    explanation: snapshot.effect?.summary ?? "A chamada cria um novo contexto de execução.",
    evidence: snapshot.source ?? `Linha ${snapshot.line}`,
    prompt: "Quais argumentos serão ligados aos parâmetros?",
    tone: "call",
  };

  if (snapshot.operation === "return") return {
    title: "A função devolve um valor",
    explanation: snapshot.effect?.summary ?? "return encerra esta chamada e entrega o resultado ao ponto de origem.",
    evidence: snapshot.returnValue?.display ?? "não definido",
    prompt: "Onde esse valor será usado quando a chamada terminar?",
    tone: "call",
  };

  if (snapshot.operation === "console") return {
    title: "O programa produziu uma saída",
    explanation: "console.log mostra o valor observado neste momento da execução.",
    evidence: snapshot.console.at(-1)?.text ?? "sem saída",
    prompt: "A saída confirma o valor que você previu?",
    tone: "output",
  };

  if (snapshot.operation === "complete") return {
    title: "Execução concluída",
    explanation: "Não existem mais instruções para executar neste caminho.",
    evidence: `${snapshot.step} snapshots observados`,
    prompt: "Você consegue reconstruir o caminho sem olhar a timeline?",
    tone: "success",
  };

  if (snapshot.operation === "error") return {
    title: "A execução foi interrompida",
    explanation: snapshot.effect?.summary ?? "O interpretador encontrou uma instrução que não pode executar com segurança.",
    evidence: snapshot.source ?? `Linha ${snapshot.line}`,
    prompt: "Qual é a menor alteração capaz de corrigir este ponto?",
    tone: "error",
  };

  return {
    title: snapshot.operation === "start" ? "Preparando a execução" : "Uma estrutura ficou disponível",
    explanation: snapshot.effect?.summary ?? "O programa avançou para a próxima instrução.",
    evidence: snapshot.source ?? `Linha ${snapshot.line}`,
    prompt: "O que você espera que aconteça no próximo passo?",
    tone: "neutral",
  };
}
