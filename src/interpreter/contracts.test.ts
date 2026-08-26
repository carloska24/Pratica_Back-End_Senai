import { describe, expectTypeOf, it } from "vitest";
import type {
  ExecutionTrace,
  InterpreterLimits,
  RuntimeDisplayValue,
  TraceSnapshot,
} from "./contracts";

describe("contratos públicos do interpretador", () => {
  it("mantém entrada, saída e limites serializáveis e explícitos", () => {
    expectTypeOf<InterpreterLimits>().toMatchTypeOf<{
      maxSteps: number;
      maxDurationMs: number;
      maxCallDepth: number;
    }>();
    expectTypeOf<RuntimeDisplayValue>().toHaveProperty("type");
    expectTypeOf<TraceSnapshot>().toHaveProperty("operation");
    expectTypeOf<ExecutionTrace>().toHaveProperty("snapshots");
  });
});
