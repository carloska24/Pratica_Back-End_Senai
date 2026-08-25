import { describe, expect, it } from "vitest";
import { courseLibrary } from "@/course/courseLibrary";
import { interpretJavaScript } from "./interpreter";

const maioridadeCode = `function verificarMaioridade(idade) {
  if (idade >= 18) {
    return true;
  }
  return false;
}

const resultado = verificarMaioridade(20);
console.log(resultado);`;

describe("interpretJavaScript", () => {
  it("produz uma trilha pedagógica determinística para chamada, condição, retorno e console", () => {
    const first = interpretJavaScript(maioridadeCode);
    const second = interpretJavaScript(maioridadeCode);

    expect(second).toEqual(first);
    expect(first.status).toBe("complete");
    expect(first.snapshots.map(snapshot => snapshot.operation)).toEqual([
      "start",
      "declare",
      "call",
      "condition",
      "return",
      "assign",
      "console",
      "complete",
    ]);
    expect(first.snapshots.map(snapshot => snapshot.step)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(first.snapshots[0]).toMatchObject({ source: "Início do programa", effect: { nextLine: 1 } });
    expect(first.snapshots[1].source).toBe("function verificarMaioridade(idade)");
    expect(first.snapshots.at(-1)?.source).toBe("Fim do programa");
  });

  it("substitui valores reais na condição e registra o caminho escolhido", () => {
    const trace = interpretJavaScript(maioridadeCode);
    const condition = trace.snapshots.find(snapshot => snapshot.operation === "condition");

    expect(condition).toMatchObject({
      line: 2,
      expression: {
        source: "idade >= 18",
        substituted: "20 >= 18",
        result: { type: "boolean", display: "true", raw: true },
      },
      effect: {
        kind: "branch",
        summary: "A condição é verdadeira; a execução entra no bloco do if.",
        nextLine: 3,
      },
    });
    expect(condition?.callStack.at(-1)).toMatchObject({
      kind: "function",
      name: "verificarMaioridade",
      parameters: [{ name: "idade", value: { type: "number", display: "20", raw: 20 } }],
    });
  });

  it("mostra antes e depois quando o retorno chega à variável chamadora", () => {
    const trace = interpretJavaScript(maioridadeCode);
    const assignment = trace.snapshots.find(snapshot => snapshot.operation === "assign" && snapshot.line === 8);

    expect(assignment?.variablesBefore.find(variable => variable.name === "resultado")?.value).toEqual({
      type: "undefined",
      display: "não definido",
    });
    expect(assignment?.variablesAfter.find(variable => variable.name === "resultado")).toMatchObject({
      declaration: "const",
      change: "created",
      value: { type: "boolean", display: "true", raw: true },
    });
    expect(assignment?.callStack).toHaveLength(1);
    expect(assignment?.returnValue).toEqual({ type: "boolean", display: "true", raw: true });
  });

  it("preserva o console acumulado no snapshot final", () => {
    const trace = interpretJavaScript(maioridadeCode);
    const consoleSnapshot = trace.snapshots.find(snapshot => snapshot.operation === "console");
    const finalSnapshot = trace.snapshots.at(-1);

    expect(consoleSnapshot?.console).toEqual([
      {
        step: consoleSnapshot?.step,
        level: "log",
        text: "true",
        values: [{ type: "boolean", display: "true", raw: true }],
      },
    ]);
    expect(finalSnapshot?.console).toEqual(consoleSnapshot?.console);
    expect(finalSnapshot?.callStack).toEqual([]);
  });

  it("acompanha atribuições e incrementos sem perder o valor anterior", () => {
    const trace = interpretJavaScript(`const base = 2;
let total = base + 3;
total *= 2;
total++;
console.log(total);`);

    expect(trace.status).toBe("complete");
    expect(trace.console.at(-1)?.text).toBe("11");
    const updates = trace.snapshots.filter(snapshot => snapshot.operation === "assign" && snapshot.line >= 3);
    expect(updates).toHaveLength(2);
    expect(updates[0].variablesBefore.find(variable => variable.name === "total")?.value.raw).toBe(5);
    expect(updates[0].variablesAfter.find(variable => variable.name === "total")?.value.raw).toBe(10);
    expect(updates[1].variablesAfter.find(variable => variable.name === "total")?.value.raw).toBe(11);
  });

  it("executa o caminho else e explica a substituição da condição", () => {
    const trace = interpretJavaScript(`const idade = 15;
let mensagem;
if (idade >= 18) {
  mensagem = "adulto";
} else {
  mensagem = "menor";
}
console.log(mensagem);`);

    expect(trace.status).toBe("complete");
    expect(trace.console.at(-1)?.text).toBe("menor");
    expect(trace.snapshots.find(snapshot => snapshot.operation === "condition")?.expression).toMatchObject({
      source: "idade >= 18",
      substituted: "15 >= 18",
      result: { raw: false },
    });
  });

  it("expõe cada iteração de um for e respeita o limite de passos", () => {
    const trace = interpretJavaScript(`let soma = 0;
for (let i = 1; i <= 3; i++) {
  soma += i;
}
console.log(soma);`);

    expect(trace.status).toBe("complete");
    expect(trace.console.at(-1)?.text).toBe("6");
    expect(trace.snapshots.filter(snapshot => snapshot.operation === "loop")).toHaveLength(4);

    const limited = interpretJavaScript("while (true) {}", { maxSteps: 8 });
    expect(limited.status).toBe("limit-exceeded");
    expect(limited.error?.code).toBe("STEP_LIMIT");
  });

  it("mantém escopos e pilha em chamadas de função aninhadas", () => {
    const trace = interpretJavaScript(`function dobro(valor) {
  return valor * 2;
}
function calcular(numero) {
  const parcial = dobro(numero);
  return parcial + 1;
}
const resposta = calcular(4);
console.log(resposta);`);

    expect(trace.status).toBe("complete");
    expect(trace.console.at(-1)?.text).toBe("9");
    const nestedReturn = trace.snapshots.find(snapshot => snapshot.operation === "return" && snapshot.line === 2);
    expect(nestedReturn?.callStack.map(frame => frame.name)).toEqual(["programa", "calcular", "dobro"]);
  });

  it("respeita sombra de let em bloco e escopo funcional de var", () => {
    const blockTrace = interpretJavaScript(`let valor = "fora";
if (true) {
  let valor = "dentro";
  console.log(valor);
}
console.log(valor);`);
    expect(blockTrace.console.map(entry => entry.text)).toEqual(["dentro", "fora"]);

    const functionTrace = interpretJavaScript(`function exemplo() {
  if (true) {
    var resposta = 2;
  }
  return resposta;
}
console.log(exemplo());`);
    expect(functionTrace.console.at(-1)?.text).toBe("2");
  });

  it.each(["eval('2 + 2')", "fetch('https://example.com')", "document.body", "import('x')"])(
    "recusa capacidade fora da linguagem pedagógica: %s",
    code => {
      const trace = interpretJavaScript(code);
      expect(trace.status).toBe("error");
      expect(trace.error?.code).toMatch(/UNSUPPORTED|FORBIDDEN/);
    },
  );

  it("recusa capacidade insegura mesmo quando aparece em um caminho não executado", () => {
    const trace = interpretJavaScript("function oculto() { eval('2 + 2'); }\nconsole.log('seguro');");
    expect(trace.status).toBe("error");
    expect(trace.console).toEqual([]);
    expect(trace.error?.code).toBe("FORBIDDEN_CAPABILITY");
  });

  it("interpreta todos os exemplos executáveis do currículo M01–M07", () => {
    const examples = courseLibrary
      .filter(module => Number(module.id.slice(1)) <= 7)
      .flatMap(module => module.items.filter(item => item.code).map(item => ({ id: item.id, code: item.code! })));

    const results = examples.map(example => ({ id: example.id, trace: interpretJavaScript(example.code) }));
    expect(results.filter(result => result.trace.status !== "complete").map(result => ({
      id: result.id,
      error: result.trace.error,
    }))).toEqual([]);
  });
});
