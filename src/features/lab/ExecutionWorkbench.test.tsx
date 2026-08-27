// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ExecutionTrace } from "../../interpreter/contracts";
import { ExecutionWorkbench } from "./ExecutionWorkbench";

const trace: ExecutionTrace = {
  status: "complete",
  snapshots: [
    {
      step: 1,
      operation: "start",
      line: 1,
      source: "function verificarMaioridade(idade) {",
      effect: { kind: "declaration", summary: "O programa preparou o escopo global.", nextLine: 2 },
      variablesBefore: [],
      variablesAfter: [],
      callStack: [{ kind: "global", name: "programa global", parameters: [] }],
      console: [],
    },
    {
      step: 2,
      operation: "condition",
      line: 2,
      source: "if (idade >= 18) {",
      expression: {
        source: "idade >= 18",
        substituted: "20 >= 18",
        result: { type: "boolean", display: "true", raw: true },
      },
      effect: { kind: "branch", summary: "A condição é verdadeira; o bloco será executado.", nextLine: 3 },
      variablesBefore: [
        { name: "idade", declaration: "parameter", scope: "verificarMaioridade", value: { type: "number", display: "20", raw: 20 } },
      ],
      variablesAfter: [
        { name: "idade", declaration: "parameter", scope: "verificarMaioridade", value: { type: "number", display: "20", raw: 20 } },
      ],
      callStack: [
        { kind: "global", name: "programa global", parameters: [] },
        { kind: "function", name: "verificarMaioridade", parameters: [{ name: "idade", value: { type: "number", display: "20", raw: 20 } }] },
      ],
      console: [],
    },
    {
      step: 3,
      operation: "console",
      line: 7,
      source: "console.log(resultado);",
      expression: {
        source: "resultado",
        substituted: "true",
        result: { type: "boolean", display: "true", raw: true },
      },
      effect: { kind: "output", summary: "O console recebeu true." },
      variablesBefore: [
        { name: "resultado", declaration: "const", scope: "global", value: { type: "boolean", display: "true", raw: true } },
      ],
      variablesAfter: [
        { name: "resultado", declaration: "const", scope: "global", value: { type: "boolean", display: "true", raw: true } },
      ],
      callStack: [{ kind: "global", name: "programa global", parameters: [] }],
      console: [{ step: 3, level: "log", text: "true", values: [{ type: "boolean", display: "true", raw: true }] }],
    },
  ],
  console: [{ step: 3, level: "log", text: "true", values: [{ type: "boolean", display: "true", raw: true }] }],
};

const code = [
  "function verificarMaioridade(idade) {",
  "  if (idade >= 18) {",
  "    return true;",
  "  }",
  "  return false;",
  "}",
  "console.log(resultado);",
].join("\n");

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Bancada de Execução", () => {
  it("usa gramática JavaScript real sem alterar o texto ou a estrutura das linhas", async () => {
    const coloredCode = 'function validar(idade) {\n  return /\\d+/.test(String(idade)); // argumento\n}';
    render(<ExecutionWorkbench trace={trace} code={coloredCode} />);

    const firstLine = screen.getByTestId("code-line-1");
    expect(firstLine.textContent).toContain("function validar(idade) {");

    await waitFor(
      () => expect(screen.getByLabelText("Código com a linha 1 ativa").getAttribute("data-highlighter")).toBe("shiki"),
      { timeout: 10_000 },
    );

    const keyword = Array.from(firstLine.children[1].querySelectorAll("span")).find(token => token.textContent === "function");
    expect(keyword?.getAttribute("style")).toMatch(/color:\s*(#569cd6|rgb\(86, 156, 214\))/i);
    expect(screen.getByTestId("code-line-2").textContent).toContain("/\\d+/.test(String(idade)); // argumento");
    const closingBracket = Array.from(screen.getByTestId("code-line-3").children[1].querySelectorAll("span")).find(token => token.textContent === "}");
    expect(closingBracket?.getAttribute("style")).toMatch(/color:\s*(#ffd700|rgb\(255, 215, 0\))/i);
  }, 10_000);

  it("expõe o componente dedicado da trilha", async () => {
    const modulePath = "./ExecutionWorkbench";
    const module = await import(/* @vite-ignore */ modulePath).catch(() => ({}));

    expect((module as { ExecutionWorkbench?: unknown }).ExecutionWorkbench).toBeTypeOf("function");
  });

  it("relaciona linha ativa, Professor Agora, memória, pilha e console", () => {
    render(<ExecutionWorkbench trace={trace} code={code} />);

    expect(screen.getByRole("heading", { name: "Bancada de Execução" })).toBeTruthy();
    const persistentNavigation = screen.getByLabelText("Navegação persistente da execução");
    expect(persistentNavigation.contains(screen.getByLabelText("Controles da execução"))).toBe(true);
    expect(persistentNavigation.contains(screen.getByLabelText("Timeline da execução"))).toBe(true);
    expect(screen.getByRole("status").textContent).toContain("Passo 1 de 3");
    expect(screen.getByTestId("code-line-1").getAttribute("data-active")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Próximo passo" }));

    expect(screen.getByRole("status").textContent).toContain("Passo 2 de 3");
    expect(screen.getByTestId("code-line-2").getAttribute("data-active")).toBe("true");
    expect(screen.getAllByText("20 >= 18").length).toBeGreaterThan(0);
    expect(screen.getAllByText("true").length).toBeGreaterThan(0);
    expect(screen.getByText("A condição é verdadeira; o bloco será executado.")).toBeTruthy();
    expect(screen.getAllByText("verificarMaioridade").length).toBeGreaterThan(0);
    expect(screen.getAllByText("idade").length).toBeGreaterThan(0);
    expect(screen.getByRole("log")).toBeTruthy();
  });

  it("permite avançar, voltar, saltar pela timeline e reiniciar", () => {
    render(<ExecutionWorkbench trace={trace} code={code} />);

    fireEvent.click(screen.getByRole("button", { name: "Próximo passo" }));
    fireEvent.click(screen.getByRole("button", { name: "Próximo passo" }));
    expect(screen.getByRole("status").textContent).toContain("Passo 3 de 3");
    expect(screen.getByRole("button", { name: "Próximo passo" }).hasAttribute("disabled")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Passo 2: condição" }));
    expect(screen.getByRole("status").textContent).toContain("Passo 2 de 3");

    fireEvent.click(screen.getByRole("button", { name: "Passo anterior" }));
    expect(screen.getByRole("status").textContent).toContain("Passo 1 de 3");

    fireEvent.click(screen.getByRole("button", { name: "Próximo passo" }));
    fireEvent.click(screen.getByRole("button", { name: "Reiniciar execução" }));
    expect(screen.getByRole("status").textContent).toContain("Passo 1 de 3");
    expect(screen.getByRole("button", { name: "Passo 1: preparação" }).getAttribute("tabindex")).toBe("0");
    expect(screen.getByRole("button", { name: "Passo 2: condição" }).getAttribute("tabindex")).toBe("-1");
  });

  it("reproduz e pausa a trilha usando a velocidade escolhida", () => {
    vi.useFakeTimers();
    render(<ExecutionWorkbench trace={trace} code={code} />);

    fireEvent.change(screen.getByLabelText("Velocidade da reprodução"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: "Reproduzir execução" }));
    expect(screen.getByRole("button", { name: "Pausar execução" })).toBeTruthy();

    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole("status").textContent).toContain("Passo 2 de 3");
    expect(screen.getByRole("button", { name: "Reproduzir execução" })).toBeTruthy();
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole("status").textContent).toContain("Passo 2 de 3");
  });

  it("pausa automaticamente antes de um momento pedagógico", () => {
    vi.useFakeTimers();
    render(<ExecutionWorkbench trace={trace} code={code} />);
    fireEvent.click(screen.getByRole("button", { name: "Reproduzir execução" }));
    act(() => vi.advanceTimersByTime(2_000));
    expect(screen.getByRole("status").textContent).toContain("Passo 2 de 3");
    expect(screen.getByRole("button", { name: "Reproduzir execução" })).toBeTruthy();
  });

  it("implementa abas móveis com seleção e painéis associados", () => {
    render(<ExecutionWorkbench trace={trace} code={code} />);
    const tabs = screen.getByRole("tablist", { name: "Detalhes da execução" });
    const stateTab = within(tabs).getByRole("tab", { name: "Estado" });

    expect(within(tabs).getByRole("tab", { name: "Código" }).getAttribute("aria-selected")).toBe("true");
    fireEvent.click(stateTab);

    expect(stateTab.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel", { name: "Estado" }).getAttribute("data-mobile-active")).toBe("true");
  });

  it("permite navegar pelas abas com setas, Home e End", () => {
    render(<ExecutionWorkbench trace={trace} code={code} />);
    const tabs = screen.getByRole("tablist", { name: "Detalhes da execução" });
    const codeTab = within(tabs).getByRole("tab", { name: "Código" });
    const stateTab = within(tabs).getByRole("tab", { name: "Estado" });
    const outputTab = within(tabs).getByRole("tab", { name: "Saída" });

    codeTab.focus();
    fireEvent.keyDown(codeTab, { key: "ArrowRight" });
    expect(stateTab.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(stateTab);

    fireEvent.keyDown(stateTab, { key: "End" });
    expect(outputTab.getAttribute("aria-selected")).toBe("true");

    fireEvent.keyDown(outputTab, { key: "Home" });
    expect(codeTab.getAttribute("aria-selected")).toBe("true");
  });

  it("oferece saída acessível sem tornar a ação obrigatória", () => {
    const onExit = vi.fn();
    const { rerender } = render(<ExecutionWorkbench trace={trace} code={code} onExit={onExit} />);

    fireEvent.click(screen.getByRole("button", { name: "Sair da bancada" }));
    expect(onExit).toHaveBeenCalledTimes(1);

    rerender(<ExecutionWorkbench trace={trace} code={code} />);
    expect(screen.queryByRole("button", { name: "Sair da bancada" })).toBeNull();
  });

  it("mostra um erro de preparação mesmo quando não há snapshots", () => {
    render(<ExecutionWorkbench trace={{
      status: "error",
      snapshots: [],
      console: [],
      error: { code: "PARSE_ERROR", message: "Feche a chave aberta na linha 2.", line: 2 },
    }} code="if (true) {" />);

    expect(screen.getByRole("alert").textContent).toContain("Feche a chave aberta na linha 2.");
  });

  it("aprofunda somente o snapshot atual quando o Tutor é solicitado", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        provider: "local",
        isFallback: true,
        notice: "Explicação local segura.",
        title: "Entendendo este passo",
        overview: "A condição compara a idade recebida com o limite informado.",
        learningGoal: "Prever o caminho escolhido.",
        concepts: [],
        walkthrough: [{ title: "Substituição", explanation: "A idade 20 ocupa o lugar da variável.", lines: [2] }],
        diagnostics: [],
        checkQuestion: null,
        nextStep: "Avance e confira o retorno.",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<ExecutionWorkbench trace={trace} code={code} moduleId="M07" />);

    fireEvent.click(screen.getByRole("button", { name: "Aprofundar este passo com o Tutor" }));
    expect(await screen.findByText("Entendendo este passo")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][1]?.body)).toContain('"moduleId":"M07"');
  });

  it("cancela a solicitação do Tutor ao sair da bancada", () => {
    const fetchMock = vi.fn().mockImplementation(() => new Promise(() => {}));
    vi.stubGlobal("fetch", fetchMock);
    const { unmount } = render(<ExecutionWorkbench trace={trace} code={code} moduleId="M07" />);

    fireEvent.click(screen.getByRole("button", { name: "Aprofundar este passo com o Tutor" }));
    const signal = fetchMock.mock.calls[0][1]?.signal as AbortSignal;
    expect(signal.aborted).toBe(false);

    unmount();

    expect(signal.aborted).toBe(true);
  });
});
