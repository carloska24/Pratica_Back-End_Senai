export type RuntimePrimitive = string | number | boolean | null | undefined;

export type RuntimeDisplayValue = {
  type: "string" | "number" | "boolean" | "null" | "undefined" | "function";
  display: string;
  raw?: RuntimePrimitive;
};

export type InterpreterLimits = {
  maxSteps: number;
  maxDurationMs: number;
  maxCallDepth: number;
};

export type VariableSnapshot = {
  name: string;
  declaration: "const" | "let" | "var" | "parameter" | "function";
  scope: string;
  value: RuntimeDisplayValue;
  change?: "created" | "updated";
};

export type CallFrameSnapshot = {
  kind: "global" | "function";
  name: string;
  parameters: Array<{ name: string; value: RuntimeDisplayValue }>;
};

export type ConsoleEntry = {
  step: number;
  level: "log";
  text: string;
  values: RuntimeDisplayValue[];
};

export type TraceOperation =
  | "start"
  | "declare"
  | "call"
  | "condition"
  | "loop"
  | "return"
  | "assign"
  | "console"
  | "complete"
  | "error";

export type TraceSnapshot = {
  step: number;
  operation: TraceOperation;
  line: number;
  source?: string;
  expression?: {
    source: string;
    substituted: string;
    result: RuntimeDisplayValue;
  };
  effect?: {
    kind: "branch" | "declaration" | "call" | "return" | "output" | "completion" | "error";
    summary: string;
    nextLine?: number;
  };
  variablesBefore: VariableSnapshot[];
  variablesAfter: VariableSnapshot[];
  callStack: CallFrameSnapshot[];
  console: ConsoleEntry[];
  returnValue?: RuntimeDisplayValue;
};

export type ExecutionTrace = {
  status: "complete" | "error" | "limit-exceeded";
  snapshots: TraceSnapshot[];
  console: ConsoleEntry[];
  error?: { code: string; message: string; line?: number };
};
