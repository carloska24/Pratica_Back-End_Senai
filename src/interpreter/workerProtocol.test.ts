import { describe, expect, it } from "vitest";
import {
  DEFAULT_MAX_CODE_BYTES,
  codeSizeInBytes,
  isWorkerRequest,
  isWorkerResponse,
} from "./workerProtocol";

describe("workerProtocol", () => {
  it("accepts only discriminated serializable run and cancel requests", () => {
    expect(isWorkerRequest({ type: "run", requestId: "run-1", code: "const x = 1;" })).toBe(true);
    expect(isWorkerRequest({
      type: "run",
      requestId: "run-1",
      code: "const x = 1;",
      limits: { maxSteps: 100, maxDurationMs: 500, maxCallDepth: 8 },
    })).toBe(true);
    expect(isWorkerRequest({ type: "cancel", requestId: "run-1" })).toBe(true);
    expect(isWorkerRequest({ type: "run", requestId: "", code: "" })).toBe(false);
    expect(isWorkerRequest({ type: "run", requestId: "run-1", code: 42 })).toBe(false);
    expect(isWorkerRequest({ type: "unknown", requestId: "run-1" })).toBe(false);
    expect(isWorkerRequest({
      type: "run",
      requestId: "run-1",
      code: "while (true) {}",
      limits: { maxSteps: 1_000_000 },
    })).toBe(false);
  });

  it("accepts correlated results and deterministic errors", () => {
    expect(isWorkerResponse({
      type: "error",
      requestId: "run-1",
      error: { code: "INVALID_REQUEST", message: "Solicitação inválida." },
    })).toBe(true);
    expect(isWorkerResponse({ type: "cancelled", requestId: "run-1" })).toBe(true);
    expect(isWorkerResponse({ type: "error", requestId: "run-1", error: new Error("leak") })).toBe(false);
    expect(isWorkerResponse({
      type: "error",
      requestId: "run-1",
      error: { code: "PRIVATE_STACK", message: "detail" },
    })).toBe(false);
    expect(isWorkerResponse({
      type: "result",
      requestId: "run-1",
      trace: { status: "complete", snapshots: [() => undefined], console: [] },
    })).toBe(false);
    expect(isWorkerResponse({
      type: "result",
      requestId: "run-1",
      trace: {
        status: "complete",
        snapshots: [{ step: 1, operation: "desconhecida", line: 1, variablesBefore: [], variablesAfter: [], callStack: [], console: [] }],
        console: [],
      },
    })).toBe(false);
  });

  it("measures UTF-8 bytes and publishes a finite default code limit", () => {
    expect(codeSizeInBytes("ação")).toBe(6);
    expect(DEFAULT_MAX_CODE_BYTES).toBeGreaterThan(0);
    expect(DEFAULT_MAX_CODE_BYTES).toBeLessThanOrEqual(256 * 1024);
  });
});
