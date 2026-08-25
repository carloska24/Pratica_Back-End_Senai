import type { ExecutionTrace, InterpreterLimits } from "./contracts";
import { interpretJavaScript } from "./interpreter";
import {
  codeSizeInBytes,
  DEFAULT_MAX_CODE_BYTES,
  isWorkerRequest,
  type WorkerRequest,
  type WorkerResponse,
} from "./workerProtocol";

type WorkerBoundaryOptions = {
  maxCodeBytes?: number;
  interpret?: (code: string, limits?: Partial<InterpreterLimits>) => ExecutionTrace;
};

function requestIdFrom(value: unknown): string {
  if (value && typeof value === "object" && "requestId" in value && typeof value.requestId === "string") {
    return value.requestId.slice(0, 128) || "unknown";
  }
  return "unknown";
}

export function processWorkerRequest(
  value: unknown,
  options: WorkerBoundaryOptions = {},
): WorkerResponse {
  if (!isWorkerRequest(value)) {
    return {
      type: "error",
      requestId: requestIdFrom(value),
      error: { code: "INVALID_REQUEST", message: "Solicitação inválida para o interpretador." },
    };
  }

  if (value.type === "cancel") {
    return { type: "cancelled", requestId: value.requestId };
  }

  const maxCodeBytes = options.maxCodeBytes ?? DEFAULT_MAX_CODE_BYTES;
  if (codeSizeInBytes(value.code) > maxCodeBytes) {
    return {
      type: "error",
      requestId: value.requestId,
      error: {
        code: "CODE_TOO_LARGE",
        message: `O código excede o limite permitido de ${maxCodeBytes} bytes.`,
      },
    };
  }

  try {
    const trace = (options.interpret ?? interpretJavaScript)(value.code, value.limits);
    return { type: "result", requestId: value.requestId, trace };
  } catch {
    return {
      type: "error",
      requestId: value.requestId,
      error: {
        code: "INTERPRETER_FAILURE",
        message: "Não foi possível preparar a execução pedagógica.",
      },
    };
  }
}

type WorkerScope = {
  postMessage(message: WorkerResponse): void;
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
};

const possibleWorkerScope = globalThis as unknown as Partial<WorkerScope> & { document?: unknown };
if (typeof possibleWorkerScope.postMessage === "function" && typeof possibleWorkerScope.document === "undefined") {
  const scope = possibleWorkerScope as WorkerScope;
  scope.onmessage = event => {
    scope.postMessage(processWorkerRequest(event.data));
  };
}
