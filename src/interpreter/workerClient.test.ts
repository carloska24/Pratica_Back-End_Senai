import { afterEach, describe, expect, it, vi } from "vitest";
import type { WorkerRequest, WorkerResponse } from "./workerProtocol";
import { createInterpreterWorkerClient, InterpreterWorkerError } from "./workerClient";

class FakeWorker {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  readonly posted: WorkerRequest[] = [];
  terminated = false;

  postMessage(message: WorkerRequest) {
    this.posted.push(message);
  }

  terminate() {
    this.terminated = true;
  }

  emit(message: WorkerResponse) {
    this.onmessage?.({ data: message } as MessageEvent<unknown>);
  }
}

class ThrowingWorker extends FakeWorker {
  override postMessage() {
    throw new DOMException("native clone detail", "DataCloneError");
  }
}

describe("interpreter worker client", () => {
  afterEach(() => vi.useRealTimers());

  it("correlates a result by request id and terminates its isolated worker", async () => {
    const worker = new FakeWorker();
    const client = createInterpreterWorkerClient({ workerFactory: () => worker });
    const execution = client.run("const resposta = 42;");

    expect(execution.requestId).toBe("interpreter-1");
    expect(worker.posted).toEqual([{ type: "run", requestId: "interpreter-1", code: "const resposta = 42;" }]);

    worker.emit({ type: "cancelled", requestId: "outra-execucao" });
    expect(worker.terminated).toBe(false);

    worker.emit({
      type: "result",
      requestId: execution.requestId,
      trace: { status: "complete", snapshots: [], console: [] },
    });

    await expect(execution.result).resolves.toMatchObject({ status: "complete" });
    expect(worker.terminated).toBe(true);
  });

  it("rejects oversized code without creating a worker", async () => {
    const factory = vi.fn(() => new FakeWorker());
    const client = createInterpreterWorkerClient({ workerFactory: factory, maxCodeBytes: 8 });
    const execution = client.run("123456789");

    await expect(execution.result).rejects.toMatchObject({ code: "CODE_TOO_LARGE" });
    expect(factory).not.toHaveBeenCalled();
  });

  it("terminates and rejects deterministically on timeout", async () => {
    vi.useFakeTimers();
    const worker = new FakeWorker();
    const client = createInterpreterWorkerClient({ workerFactory: () => worker, timeoutMs: 50 });
    const execution = client.run("while (true) {}");
    const rejection = expect(execution.result).rejects.toEqual(
      expect.objectContaining({ code: "WORKER_TIMEOUT", name: "InterpreterWorkerError" }),
    );

    await vi.advanceTimersByTimeAsync(51);

    await rejection;
    expect(worker.terminated).toBe(true);
  });

  it("supports explicit idempotent cancellation", async () => {
    const worker = new FakeWorker();
    const client = createInterpreterWorkerClient({ workerFactory: () => worker });
    const execution = client.run("let x = 1;");

    expect(execution.cancel()).toBe(true);
    expect(execution.cancel()).toBe(false);
    await expect(execution.result).rejects.toEqual(
      expect.objectContaining({ code: "WORKER_CANCELLED", name: "InterpreterWorkerError" }),
    );
    expect(worker.terminated).toBe(true);
  });

  it("rejects malformed responses and does not expose native worker details", async () => {
    const worker = new FakeWorker();
    const client = createInterpreterWorkerClient({ workerFactory: () => worker });
    const execution = client.run("let x = 1;");

    worker.emit({ type: "result", requestId: execution.requestId, trace: null } as never);

    await expect(execution.result).rejects.toEqual(
      expect.objectContaining({ code: "INVALID_RESPONSE", name: "InterpreterWorkerError" }),
    );
    expect(worker.terminated).toBe(true);
  });

  it("uses a stable public error type", () => {
    const error = new InterpreterWorkerError("WORKER_FAILURE", "Falha segura.");
    expect(error).toMatchObject({ name: "InterpreterWorkerError", code: "WORKER_FAILURE", message: "Falha segura." });
  });

  it("cleans up and maps a synchronous postMessage failure", async () => {
    const worker = new ThrowingWorker();
    const client = createInterpreterWorkerClient({ workerFactory: () => worker });
    const execution = client.run("const x = 1;");

    await expect(execution.result).rejects.toEqual(
      expect.objectContaining({ code: "WORKER_FAILURE", name: "InterpreterWorkerError" }),
    );
    expect(worker.terminated).toBe(true);
  });
});
