import type { ExecutionResult, ExecutionTest, MissionId } from "@/runner/contracts";
import { missionTests } from "@/runner/missions";

export const MAX_LOCAL_CODE_BYTES = 128 * 1024;
const MAX_LOG_LINES = 100;
const MAX_LOG_LENGTH = 2_000;
const MAX_TESTS = 20;

export const STUDENT_FACTORY_PARAMETERS = [
  "console", "self", "postMessage", "globalThis", "Worker", "SharedWorker",
  "BroadcastChannel", "indexedDB", "caches", "navigator", "location",
  "importScripts", "XMLHttpRequest", "WebSocket", "EventSource", "fetch",
  "Function", "Blob", "URL",
] as const;

const missionExports: Record<MissionId, readonly string[]> = {
  M07: ["calcularSubtotal", "calcularDesconto", "calcularTotalPedido"],
  M08: ["possuiCodigo", "calcularMedia", "registrarCodigo"],
  M09: ["calcularTotalPedido", "resumirPedido", "registrarItem"],
  M10: ["normalizarEmail", "calcularPrecoFinal", "criarRegistro"],
  M11: ["selecionarDisponiveis", "criarEtiquetas", "buscarPorCodigo", "todosPrecosValidos", "calcularValorEstoque"],
  M12: ["criarEtiqueta", "atualizarProduto", "somarValores", "criarResumoUsuario"],
};

const forbiddenCapabilityPattern = /\b(?:self|globalThis|postMessage|Worker|SharedWorker|BroadcastChannel|indexedDB|caches|navigator|location|importScripts|XMLHttpRequest|WebSocket|EventSource|fetch|eval|Function|Blob|URL)\b|\bconstructor\b|__proto__|\bimport\s*\(/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isExecutionTest(value: unknown): value is ExecutionTest {
  return isRecord(value)
    && typeof value.name === "string"
    && value.name.length <= 160
    && typeof value.ok === "boolean"
    && typeof value.expected === "string"
    && value.expected.length <= 2_000
    && typeof value.received === "string"
    && value.received.length <= 2_000;
}

export function validateRunnerMessage(value: unknown, requestId: string): ExecutionResult | null {
  if (!isRecord(value) || value.kind !== "campus-result" || value.requestId !== requestId) return null;
  if (!Array.isArray(value.logs) || value.logs.length > MAX_LOG_LINES || !value.logs.every(line => typeof line === "string" && line.length <= MAX_LOG_LENGTH)) return null;
  if (!Array.isArray(value.tests) || value.tests.length > MAX_TESTS || !value.tests.every(isExecutionTest)) return null;
  if (typeof value.error !== "undefined" && (typeof value.error !== "string" || value.error.length > 1_000)) return null;
  if (typeof value.timedOut !== "undefined" && typeof value.timedOut !== "boolean") return null;

  return {
    logs: value.logs,
    tests: value.tests,
    ...(typeof value.error === "string" ? { error: value.error } : {}),
    ...(value.timedOut === true ? { timedOut: true } : {}),
  };
}

export function validateLocalCode(code: string): string | null {
  if (new TextEncoder().encode(code).byteLength > MAX_LOCAL_CODE_BYTES) {
    return `O arquivo excede o limite local de ${MAX_LOCAL_CODE_BYTES} bytes.`;
  }
  if (forbiddenCapabilityPattern.test(code)) {
    return "O código usa uma capacidade não permitida neste executor local.";
  }
  return null;
}

function createRequestId() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `run-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createStudentBody(code: string, mission: MissionId | null) {
  const exports = mission
    ? missionExports[mission].map(name => `${JSON.stringify(name)}: typeof ${name} === "function" ? ${name} : undefined`).join(",")
    : "";
  return `"use strict";\n${code}\n;return {${exports}};`;
}

export function runJavaScriptLocally(code: string, mission: MissionId | null): Promise<ExecutionResult> {
  const validationError = validateLocalCode(code);
  if (validationError) return Promise.resolve({ logs: [], tests: [], error: validationError });

  return new Promise(resolve => {
    const requestId = createRequestId();
    const tests = mission ? missionTests[mission] : "const __tests = [];";
    const exportedNames = mission ? missionExports[mission] : [];
    const bindings = mission ? `const { ${exportedNames.join(", ")} } = __student;` : "";
    const studentBody = createStudentBody(code, mission);
    const studentFactoryParameters = STUDENT_FACTORY_PARAMETERS.map(parameter => JSON.stringify(parameter)).join(", ");

    const workerSource = `
const __requestId = ${JSON.stringify(requestId)};
const __sendResult = self.postMessage.bind(self);
const __logs = [];
const __format = value => {
  if (typeof value === "string") return value.slice(0, ${MAX_LOG_LENGTH});
  let output;
  try { output = JSON.stringify(value); } catch { output = String(value); }
  return String(output).slice(0, ${MAX_LOG_LENGTH});
};
const __writeLog = (prefix, values) => {
  if (__logs.length >= ${MAX_LOG_LINES}) throw new Error("Limite de ${MAX_LOG_LINES} linhas de console atingido.");
  __logs.push(prefix + values.map(__format).join(" "));
};
const __safeConsole = Object.freeze({
  log: (...values) => __writeLog("", values),
  error: (...values) => __writeLog("ERRO: ", values)
});

try {
  const __studentFactory = new Function(
    ${studentFactoryParameters},
    ${JSON.stringify(studentBody)}
  );
  const __student = __studentFactory(__safeConsole);
  ${bindings}
  ${tests}
  __sendResult({ kind: "campus-result", requestId: __requestId, logs: __logs, tests: __tests });
} catch (error) {
  __sendResult({
    kind: "campus-result",
    requestId: __requestId,
    logs: __logs,
    tests: [],
    error: error instanceof Error ? String(error.message).slice(0, 1000) : "Falha ao executar o código."
  });
}`;

    let worker: Worker;
    let url: string;
    try {
      url = URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" }));
      worker = new Worker(url);
    } catch {
      resolve({ logs: [], tests: [], error: "Não foi possível iniciar o executor local." });
      return;
    }

    let finished = false;
    const finish = (result: ExecutionResult) => {
      if (finished) return;
      finished = true;
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(result);
    };
    const timeout = window.setTimeout(() => finish({ logs: [], tests: [], timedOut: true, error: "Execução interrompida após 1,5 segundo. Verifique se existe um loop infinito." }), 1500);

    worker.onmessage = event => {
      const result = validateRunnerMessage(event.data, requestId);
      if (!result) {
        window.clearTimeout(timeout);
        finish({ logs: [], tests: [], error: "O executor local retornou uma resposta inválida." });
        return;
      }
      window.clearTimeout(timeout);
      finish(result);
    };
    worker.onerror = () => {
      window.clearTimeout(timeout);
      finish({ logs: [], tests: [], error: "Não foi possível executar o código." });
    };
  });
}
