export type ExecutionTest = { name: string; ok: boolean; expected: string; received: string };
export type ExecutionResult = { logs: string[]; tests: ExecutionTest[]; error?: string; timedOut?: boolean };
export type MissionId = "M07" | "M08" | "M09" | "M10" | "M11" | "M12";
