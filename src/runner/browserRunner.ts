import type { ExecutionResult, MissionId } from "@/runner/contracts";
import { missionTests } from "@/runner/missions";

export function runJavaScriptLocally(code: string, mission: MissionId | null): Promise<ExecutionResult> {
  return new Promise(resolve => {
    const tests = mission ? missionTests[mission] : "const __tests = [];";

    const workerSource = `
const __sendResult = self.postMessage.bind(self);
const __logs = [];
const __format = value => {
  if (typeof value === "string") return value;
  try { return JSON.stringify(value); } catch { return String(value); }
};
console.log = (...values) => __logs.push(values.map(__format).join(" "));
console.error = (...values) => __logs.push("ERRO: " + values.map(__format).join(" "));
self.fetch = () => Promise.reject(new Error("Rede desativada neste laboratório"));
self.XMLHttpRequest = undefined;
self.WebSocket = undefined;
self.EventSource = undefined;
self.importScripts = () => { throw new Error("Importação externa desativada"); };

try {
${code}
${tests}
  __sendResult({ kind: "campus-result", logs: __logs, tests: __tests });
} catch (error) {
  __sendResult({ kind: "campus-result", logs: __logs, tests: [], error: error instanceof Error ? error.message : String(error) });
}`;

    const url = URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" }));
    const worker = new Worker(url);
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
      if (event.data?.kind !== "campus-result") return;
      window.clearTimeout(timeout);
      finish(event.data);
    };
    worker.onerror = event => {
      window.clearTimeout(timeout);
      finish({ logs: [], tests: [], error: event.message || "Não foi possível executar o código." });
    };
  });
}
