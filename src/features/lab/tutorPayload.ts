import type { ExecutionResult, TeachingAnalysis } from "../../runner/contracts";
import type { TutorRequest } from "../../tutor/schemas";
import type { ExecutionTrace, TraceSnapshot } from "../../interpreter/contracts";
import type { LabModuleId } from "../../runner/contracts";

export function buildTutorRequest(analysis: TeachingAnalysis, code: string, execution: ExecutionResult | null): TutorRequest {
  const symbols: TutorRequest["astSummary"]["symbols"] = [
    ...analysis.variables.map(variable => ({ name: variable.name, kind: "variable" as const, line: variable.line })),
    ...analysis.functions.flatMap(fn => [
      { name: fn.name, kind: "function" as const, line: fn.line },
      ...fn.parameters.map(parameter => ({ name: parameter, kind: "parameter" as const, line: fn.line })),
    ]),
  ].slice(0, 40);
  const executionPayload: TutorRequest["execution"] = execution
    ? {
        status: execution.timedOut ? "timeout" : execution.error ? "error" : "success",
        logs: execution.logs.slice(0, 40),
        ...(execution.error ? { error: execution.error } : {}),
        tests: execution.tests.slice(0, 30).map(test => ({
          name: test.name,
          passed: test.ok,
          message: `Esperado: ${test.expected} · Recebido: ${test.received}`.slice(0, 300),
        })),
      }
    : undefined;

  return {
    moduleId: analysis.moduleId,
    code,
    astSummary: {
      summary: analysis.summary.join(" ").slice(0, 600),
      concepts: analysis.concepts.filter(concept => concept.found).map(concept => concept.name).slice(0, 20),
      symbols,
      flow: analysis.flow.slice(0, 40).map(step => ({ label: step.label.slice(0, 180), line: step.line })),
      diagnostics: analysis.diagnostics.slice(0, 20).map(diagnostic => ({
        severity: diagnostic.kind === "syntax" ? "error" as const : "warning" as const,
        message: diagnostic.message.slice(0, 300),
        ...(diagnostic.line ? { line: diagnostic.line } : {}),
      })),
    },
    ...(executionPayload ? { execution: executionPayload } : {}),
    requestKind: "deepen",
  };
}

export function buildSnapshotTutorRequest(
  moduleId: LabModuleId,
  code: string,
  snapshot: TraceSnapshot,
  trace: ExecutionTrace,
): TutorRequest {
  const operationLabels: Record<TraceSnapshot["operation"], string> = {
    start: "preparação",
    declare: "declaração",
    call: "chamada de função",
    condition: "condição",
    loop: "iteração do laço",
    return: "retorno",
    assign: "atribuição",
    console: "saída no console",
    complete: "conclusão",
    error: "erro",
  };
  const operation = operationLabels[snapshot.operation];
  const expression = snapshot.expression
    ? `${snapshot.expression.substituted} → ${snapshot.expression.result.display}`
    : snapshot.source ?? `linha ${snapshot.line}`;
  const symbols: TutorRequest["astSummary"]["symbols"] = snapshot.variablesAfter.slice(0, 40).map(variable => ({
    name: variable.name,
    kind: variable.declaration === "parameter" ? "parameter" as const : "variable" as const,
    line: snapshot.line,
  }));

  return {
    moduleId,
    code,
    requestKind: "deepen",
    astSummary: {
      summary: `Snapshot ${snapshot.step}: ${operation}. Evidência observada: ${expression}. ${snapshot.effect?.summary ?? ""}`.trim().slice(0, 600),
      concepts: [operation, ...(snapshot.expression ? [snapshot.expression.result.type] : [])].slice(0, 20),
      symbols,
      flow: [{ label: (snapshot.effect?.summary ?? `Executa ${operation}`).slice(0, 180), line: snapshot.line }],
      diagnostics: trace.error ? [{ severity: "error", message: trace.error.message.slice(0, 300), ...(trace.error.line ? { line: trace.error.line } : {}) }] : [],
    },
    execution: {
      status: trace.status === "complete" ? "success" : trace.status === "limit-exceeded" ? "timeout" : "error",
      logs: snapshot.console.map(entry => entry.text.slice(0, 500)).slice(0, 40),
      ...(trace.error ? { error: trace.error.message.slice(0, 1_000) } : {}),
    },
  };
}
