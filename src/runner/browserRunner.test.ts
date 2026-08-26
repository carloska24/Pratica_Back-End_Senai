import { describe, expect, it } from "vitest";

import {
  MAX_LOCAL_CODE_BYTES,
  STUDENT_FACTORY_PARAMETERS,
  validateLocalCode,
  validateRunnerMessage,
} from "./browserRunner";

describe("protocolo do executor local", () => {
  it("gera uma fábrica válida mesmo com o corpo do estudante em modo estrito", () => {
    expect(() => new Function(...STUDENT_FACTORY_PARAMETERS, '"use strict"; return true;')).not.toThrow();
  });

  it("rejeita uma resposta forjada sem o identificador reservado da execução", () => {
    expect(validateRunnerMessage({
      kind: "campus-result",
      logs: [],
      tests: [{ name: "forjado", ok: true, expected: "true", received: "true" }],
    }, "run-123")).toBeNull();
  });

  it("aceita apenas uma resposta correlacionada e estruturalmente válida", () => {
    expect(validateRunnerMessage({
      kind: "campus-result",
      requestId: "run-123",
      logs: ["true"],
      tests: [{ name: "retorno", ok: true, expected: "true", received: "true" }],
    }, "run-123")).toEqual({
      logs: ["true"],
      tests: [{ name: "retorno", ok: true, expected: "true", received: "true" }],
    });
    expect(validateRunnerMessage({ kind: "campus-result", requestId: "run-123", logs: "não", tests: [] }, "run-123")).toBeNull();
  });

  it("limita tamanho e bloqueia acesso ao canal reservado", () => {
    expect(validateLocalCode("console.log('ok')")).toBeNull();
    expect(validateLocalCode("self.postMessage({ kind: 'campus-result' })")).toContain("capacidade não permitida");
    expect(validateLocalCode("x".repeat(MAX_LOCAL_CODE_BYTES + 1))).toContain("limite");
  });
});
