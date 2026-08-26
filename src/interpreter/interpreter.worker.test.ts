import { describe, expect, it } from "vitest";
import { processWorkerRequest } from "./interpreter.worker";
import { isWorkerResponse } from "./workerProtocol";

describe("interpreter worker boundary", () => {
  it("runs valid code and preserves the request id", () => {
    const response = processWorkerRequest({
      type: "run",
      requestId: "lesson-7",
      code: "const resposta = 42;",
    });

    expect(response.type).toBe("result");
    expect(response.requestId).toBe("lesson-7");
  });

  it("rejects oversized code before invoking the interpreter", () => {
    const response = processWorkerRequest({
      type: "run",
      requestId: "large-1",
      code: "x".repeat(33),
    }, { maxCodeBytes: 32 });

    expect(response).toEqual({
      type: "error",
      requestId: "large-1",
      error: {
        code: "CODE_TOO_LARGE",
        message: "O código excede o limite permitido de 32 bytes.",
      },
    });
  });

  it("maps malformed messages and internal failures to safe deterministic errors", () => {
    expect(processWorkerRequest({ type: "run", requestId: "bad-1", code: 7 })).toEqual({
      type: "error",
      requestId: "bad-1",
      error: { code: "INVALID_REQUEST", message: "Solicitação inválida para o interpretador." },
    });

    const response = processWorkerRequest(
      { type: "run", requestId: "crash-1", code: "const x = 1;" },
      { interpret: () => { throw new Error("private stack detail"); } },
    );
    expect(response).toEqual({
      type: "error",
      requestId: "crash-1",
      error: { code: "INTERPRETER_FAILURE", message: "Não foi possível preparar a execução pedagógica." },
    });
  });

  it("mantém resultados numéricos não finitos dentro do protocolo serializável", () => {
    const response = processWorkerRequest({ type: "run", requestId: "infinity-1", code: "console.log(1 / 0);" });
    expect(isWorkerResponse(response)).toBe(true);
    expect(response.type === "result" ? response.trace.console[0]?.values[0] : null).toEqual({
      type: "number",
      display: "Infinity",
    });
  });
});
