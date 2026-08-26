import type { ExecutionTrace, InterpreterLimits } from "./contracts";

export const DEFAULT_MAX_CODE_BYTES = 128 * 1024;
export const INTERPRETER_LIMIT_CEILINGS: Readonly<InterpreterLimits> = {
  maxSteps: 1_000,
  maxDurationMs: 2_000,
  maxCallDepth: 32,
};

export type WorkerRunRequest = {
  type: "run";
  requestId: string;
  code: string;
  limits?: Partial<InterpreterLimits>;
};

export type WorkerCancelRequest = {
  type: "cancel";
  requestId: string;
};

export type WorkerRequest = WorkerRunRequest | WorkerCancelRequest;

export type WorkerError = {
  code:
    | "INVALID_REQUEST"
    | "CODE_TOO_LARGE"
    | "INTERPRETER_FAILURE"
    | "INVALID_RESPONSE"
    | "WORKER_FAILURE"
    | "WORKER_TIMEOUT"
    | "WORKER_CANCELLED";
  message: string;
};

export type WorkerResponse =
  | { type: "result"; requestId: string; trace: ExecutionTrace }
  | { type: "error"; requestId: string; error: WorkerError }
  | { type: "cancelled"; requestId: string };

const encoder = new TextEncoder();

export function codeSizeInBytes(code: string): number {
  return encoder.encode(code).byteLength;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isSerializableData(
  value: unknown,
  seen = new Set<object>(),
  depth = 0,
  budget = { remaining: 100_000 },
): boolean {
  budget.remaining -= 1;
  if (budget.remaining < 0 || depth > 32) return false;
  if (value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "undefined") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object" || seen.has(value)) return false;

  seen.add(value);
  const entries = Array.isArray(value) ? value : Object.values(value);
  const valid = entries.every(entry => isSerializableData(entry, seen, depth + 1, budget));
  seen.delete(value);
  return valid;
}

function hasRequestId(value: Record<string, unknown>): value is Record<string, unknown> & { requestId: string } {
  return typeof value.requestId === "string" && value.requestId.length > 0 && value.requestId.length <= 128;
}

function isSafePositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function hasValidLimits(value: unknown): boolean {
  if (typeof value === "undefined") return true;
  if (!isRecord(value)) return false;
  const allowed = new Set(["maxSteps", "maxDurationMs", "maxCallDepth"]);
  return Object.entries(value).every(([key, entry]) => {
    if (!allowed.has(key) || !isSafePositiveInteger(entry)) return false;
    return entry <= INTERPRETER_LIMIT_CEILINGS[key as keyof InterpreterLimits];
  });
}

export function isWorkerRequest(value: unknown): value is WorkerRequest {
  if (!isRecord(value) || !hasRequestId(value)) return false;
  if (value.type === "cancel") return true;
  return value.type === "run" && typeof value.code === "string" && hasValidLimits(value.limits);
}

function isDisplayValue(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (!["string", "number", "boolean", "null", "undefined", "function"].includes(String(value.type))) return false;
  if (typeof value.display !== "string" || value.display.length > 20_000) return false;
  return !("raw" in value) || value.raw === null || ["string", "number", "boolean", "undefined"].includes(typeof value.raw);
}

function isConsoleEntry(value: unknown): boolean {
  return isRecord(value)
    && isSafePositiveInteger(value.step)
    && value.level === "log"
    && typeof value.text === "string"
    && value.text.length <= 20_000
    && Array.isArray(value.values)
    && value.values.length <= 100
    && value.values.every(isDisplayValue);
}

function isVariable(value: unknown): boolean {
  return isRecord(value)
    && typeof value.name === "string"
    && value.name.length <= 200
    && ["const", "let", "var", "parameter", "function"].includes(String(value.declaration))
    && typeof value.scope === "string"
    && value.scope.length <= 300
    && isDisplayValue(value.value)
    && (typeof value.change === "undefined" || ["created", "updated"].includes(String(value.change)));
}

function isFrame(value: unknown): boolean {
  return isRecord(value)
    && ["global", "function"].includes(String(value.kind))
    && typeof value.name === "string"
    && value.name.length <= 200
    && Array.isArray(value.parameters)
    && value.parameters.length <= 100
    && value.parameters.every(parameter => isRecord(parameter) && typeof parameter.name === "string" && isDisplayValue(parameter.value));
}

function isSnapshot(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const operations = ["start", "declare", "call", "condition", "loop", "return", "assign", "console", "complete", "error"];
  if (!isSafePositiveInteger(value.step) || !operations.includes(String(value.operation)) || !isSafePositiveInteger(value.line)) return false;
  if (typeof value.source !== "undefined" && (typeof value.source !== "string" || value.source.length > 128_000)) return false;
  if (!Array.isArray(value.variablesBefore) || value.variablesBefore.length > 1_000 || !value.variablesBefore.every(isVariable)) return false;
  if (!Array.isArray(value.variablesAfter) || value.variablesAfter.length > 1_000 || !value.variablesAfter.every(isVariable)) return false;
  if (!Array.isArray(value.callStack) || value.callStack.length > INTERPRETER_LIMIT_CEILINGS.maxCallDepth || !value.callStack.every(isFrame)) return false;
  if (!Array.isArray(value.console) || value.console.length > INTERPRETER_LIMIT_CEILINGS.maxSteps || !value.console.every(isConsoleEntry)) return false;
  if (typeof value.returnValue !== "undefined" && !isDisplayValue(value.returnValue)) return false;
  if (typeof value.expression !== "undefined") {
    if (!isRecord(value.expression) || typeof value.expression.source !== "string" || typeof value.expression.substituted !== "string" || !isDisplayValue(value.expression.result)) return false;
  }
  if (typeof value.effect !== "undefined") {
    if (!isRecord(value.effect) || !["branch", "declaration", "call", "return", "output", "completion", "error"].includes(String(value.effect.kind)) || typeof value.effect.summary !== "string") return false;
    if (typeof value.effect.nextLine !== "undefined" && !isSafePositiveInteger(value.effect.nextLine)) return false;
  }
  return true;
}

function isExecutionTrace(value: unknown): value is ExecutionTrace {
  if (!isRecord(value) || !isSerializableData(value)) return false;
  if (!["complete", "error", "limit-exceeded"].includes(String(value.status))) return false;
  if (!Array.isArray(value.snapshots) || value.snapshots.length > INTERPRETER_LIMIT_CEILINGS.maxSteps || !value.snapshots.every(isSnapshot)) return false;
  if (!Array.isArray(value.console) || value.console.length > INTERPRETER_LIMIT_CEILINGS.maxSteps || !value.console.every(isConsoleEntry)) return false;
  if (typeof value.error !== "undefined" && (!isRecord(value.error) || typeof value.error.code !== "string" || typeof value.error.message !== "string" || (typeof value.error.line !== "undefined" && !isSafePositiveInteger(value.error.line)))) return false;
  return true;
}

function isWorkerError(value: unknown): value is WorkerError {
  const codes: ReadonlySet<WorkerError["code"]> = new Set([
    "INVALID_REQUEST",
    "CODE_TOO_LARGE",
    "INTERPRETER_FAILURE",
    "INVALID_RESPONSE",
    "WORKER_FAILURE",
    "WORKER_TIMEOUT",
    "WORKER_CANCELLED",
  ]);
  return isRecord(value)
    && typeof value.code === "string"
    && codes.has(value.code as WorkerError["code"])
    && typeof value.message === "string";
}

export function isWorkerResponse(value: unknown): value is WorkerResponse {
  if (!isRecord(value) || !hasRequestId(value)) return false;
  if (value.type === "cancelled") return true;
  if (value.type === "error") return isWorkerError(value.error);
  return value.type === "result" && isExecutionTrace(value.trace);
}
