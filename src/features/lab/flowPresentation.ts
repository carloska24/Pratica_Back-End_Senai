import type { TeachingAnalysis } from "../../runner/contracts";

export function shouldUseInteractiveFlow(analysis: Pick<TeachingAnalysis, "flow" | "functions">) {
  if (analysis.flow.length >= 8) return true;
  if (analysis.flow.length >= 5 && analysis.flow.some(step => step.kind === "decision" || step.kind === "loop")) return true;
  return analysis.functions.some(fn => fn.calls.length > 0);
}
