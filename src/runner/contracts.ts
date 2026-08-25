export type ExecutionTest = { name: string; ok: boolean; expected: string; received: string };
export type ExecutionResult = { logs: string[]; tests: ExecutionTest[]; error?: string; timedOut?: boolean };
export type LabModuleId = "M01" | "M02" | "M03" | "M04" | "M05" | "M06" | "M07" | "M08" | "M09" | "M10" | "M11" | "M12";
export type MissionId = Extract<LabModuleId, "M07" | "M08" | "M09" | "M10" | "M11" | "M12">;

type LabModuleBase = {
  id: LabModuleId;
  title: string;
  concepts: readonly string[];
};

export type ReviewLabModule = LabModuleBase & {
  kind: "review";
};

export type MissionLabModule = LabModuleBase & {
  kind: "mission";
  mission: {
    fileName: string;
    code: string;
    expectedTests: number;
  };
};

export type LabModuleDefinition = ReviewLabModule | MissionLabModule;

export type TeachingVariable = {
  name: string;
  declaration: "const" | "let" | "var";
  line: number;
  initialValue?: string;
  scope: string;
};

export type TeachingFunction = {
  name: string;
  parameters: string[];
  line: number;
  calls: string[];
  returns: string[];
};

export type TeachingDiagnostic = {
  kind: "syntax" | "attention";
  message: string;
  line?: number;
  column?: number;
};

export type ConceptEvidence = {
  name: string;
  found: boolean;
  expected: boolean;
};

export type TeachingFlowStep = {
  id: string;
  kind: "function" | "variable" | "decision" | "loop" | "return" | "call";
  label: string;
  line: number;
  evidence: "inferred";
};

export type RetentionQuestion = {
  prompt: string;
  answer: string;
  explanation: string;
};

export type TeachingAnalysis = {
  sourceVersion: string;
  moduleId: LabModuleId;
  summary: string[];
  concepts: ConceptEvidence[];
  variables: TeachingVariable[];
  functions: TeachingFunction[];
  flow: TeachingFlowStep[];
  diagnostics: TeachingDiagnostic[];
  question: RetentionQuestion | null;
};
