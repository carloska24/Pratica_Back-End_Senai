import type { ExecutionTrace, InterpreterLimits } from "./contracts";
import {
  codeSizeInBytes,
  DEFAULT_MAX_CODE_BYTES,
  isWorkerResponse,
  type WorkerError,
  type WorkerRequest,
} from "./workerProtocol";

type WorkerLike = {
  onmessage: ((event: MessageEvent<unknown>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  postMessage(message: WorkerRequest): void;
  terminate(): void;
};

export class InterpreterWorkerError extends Error {
  readonly code: WorkerError["code"];

  constructor(code: WorkerError["code"], message: string) {
    super(message);
    this.name = "InterpreterWorkerError";
    this.code = code;
  }
}

export type InterpreterWorkerExecution = {
  requestId: string;
  result: Promise<ExecutionTrace>;
  cancel(): boolean;
};

export type InterpreterWorkerClient = {
  run(code: string, limits?: Partial<InterpreterLimits>): InterpreterWorkerExecution;
  cancel(requestId: string): boolean;
  dispose(): void;
};

type ClientOptions = {
  workerFactory?: () => WorkerLike;
  timeoutMs?: number;
  maxCodeBytes?: number;
};

type PendingExecution = {
  worker: WorkerLike;
  timer: ReturnType<typeof setTimeout>;
  reject(error: InterpreterWorkerError): void;
};

const DEFAULT_TIMEOUT_MS = 2_500;

function createBrowserWorker(): WorkerLike {
  return new Worker(new URL("./interpreter.worker.ts", import.meta.url), { type: "module" });
}

export function createInterpreterWorkerClient(options: ClientOptions = {}): InterpreterWorkerClient {
  const workerFactory = options.workerFactory ?? createBrowserWorker;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxCodeBytes = options.maxCodeBytes ?? DEFAULT_MAX_CODE_BYTES;
  const pending = new Map<string, PendingExecution>();
  let sequence = 0;

  const finish = (requestId: string) => {
    const execution = pending.get(requestId);
    if (!execution) return;
    clearTimeout(execution.timer);
    execution.worker.terminate();
    pending.delete(requestId);
  };

  const cancel = (requestId: string): boolean => {
    const execution = pending.get(requestId);
    if (!execution) return false;
    finish(requestId);
    execution.reject(new InterpreterWorkerError("WORKER_CANCELLED", "A execução pedagógica foi cancelada."));
    return true;
  };

  return {
    run(code, limits) {
      const requestId = `interpreter-${++sequence}`;
      if (codeSizeInBytes(code) > maxCodeBytes) {
        return {
          requestId,
          result: Promise.reject(new InterpreterWorkerError(
            "CODE_TOO_LARGE",
            `O código excede o limite permitido de ${maxCodeBytes} bytes.`,
          )),
          cancel: () => false,
        };
      }

      let worker: WorkerLike;
      try {
        worker = workerFactory();
      } catch {
        return {
          requestId,
          result: Promise.reject(new InterpreterWorkerError("WORKER_FAILURE", "Não foi possível iniciar o ambiente isolado.")),
          cancel: () => false,
        };
      }

      let rejectExecution!: (error: InterpreterWorkerError) => void;
      const result = new Promise<ExecutionTrace>((resolve, reject) => {
        rejectExecution = reject;
        worker.onmessage = event => {
          const response = event.data;
          if (!isWorkerResponse(response)) {
            finish(requestId);
            reject(new InterpreterWorkerError("INVALID_RESPONSE", "O ambiente isolado retornou uma resposta inválida."));
            return;
          }
          if (response.requestId !== requestId) return;

          finish(requestId);
          if (response.type === "result") {
            resolve(response.trace);
          } else if (response.type === "cancelled") {
            reject(new InterpreterWorkerError("WORKER_CANCELLED", "A execução pedagógica foi cancelada."));
          } else {
            reject(new InterpreterWorkerError(response.error.code, response.error.message));
          }
        };
        worker.onerror = () => {
          finish(requestId);
          reject(new InterpreterWorkerError("WORKER_FAILURE", "O ambiente isolado não conseguiu concluir a execução."));
        };
      });

      const timer = setTimeout(() => {
        const execution = pending.get(requestId);
        if (!execution) return;
        finish(requestId);
        execution.reject(new InterpreterWorkerError("WORKER_TIMEOUT", "A execução excedeu o tempo permitido."));
      }, timeoutMs);
      pending.set(requestId, { worker, timer, reject: rejectExecution });

      const request: WorkerRequest = { type: "run", requestId, code, ...(limits ? { limits } : {}) };
      try {
        worker.postMessage(request);
      } catch {
        finish(requestId);
        rejectExecution(new InterpreterWorkerError("WORKER_FAILURE", "Não foi possível enviar o código ao ambiente isolado."));
      }

      return { requestId, result, cancel: () => cancel(requestId) };
    },
    cancel,
    dispose() {
      for (const requestId of [...pending.keys()]) cancel(requestId);
    },
  };
}
