import { z } from "zod";

const moduleIds = [
  "M01",
  "M02",
  "M03",
  "M04",
  "M05",
  "M06",
  "M07",
  "M08",
  "M09",
  "M10",
  "M11",
  "M12",
] as const;

const boundedInputText = (max: number) => z.string().trim().min(1).max(max);
const htmlTagPattern = /<\/?[a-z][^>]*>/i;
const plainOutputText = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((value) => !htmlTagPattern.test(value), "HTML não é permitido.");

const lineSchema = z.number().int().min(1).max(100_000);

export const astSummarySchema = z.strictObject({
  summary: boundedInputText(600),
  concepts: z.array(boundedInputText(80)).max(20),
  symbols: z
    .array(
      z.strictObject({
        name: boundedInputText(80),
        kind: z.enum(["variable", "function", "parameter", "class", "import"]),
        line: lineSchema,
      }),
    )
    .max(40),
  flow: z
    .array(
      z.strictObject({
        label: boundedInputText(180),
        line: lineSchema.optional(),
      }),
    )
    .max(40),
  diagnostics: z
    .array(
      z.strictObject({
        severity: z.enum(["info", "warning", "error"]),
        message: boundedInputText(300),
        line: lineSchema.optional(),
      }),
    )
    .max(20),
});

export const tutorExecutionSchema = z.strictObject({
  status: z.enum(["success", "error", "timeout"]),
  logs: z.array(z.string().max(500)).max(40),
  error: z.string().trim().max(1_000).optional(),
  tests: z
    .array(
      z.strictObject({
        name: boundedInputText(120),
        passed: z.boolean(),
        message: z.string().trim().max(300).optional(),
      }),
    )
    .max(30)
    .optional(),
});

export const tutorRequestSchema = z.strictObject({
  moduleId: z.enum(moduleIds),
  code: z.string().max(12_000),
  astSummary: astSummarySchema,
  execution: tutorExecutionSchema.optional(),
  requestKind: z.enum(["explain", "diagnose", "deepen", "quiz"]),
});

const conceptSchema = z.strictObject({
  name: plainOutputText(80),
  explanation: plainOutputText(500),
  evidenceLines: z.array(lineSchema).max(12),
});

const walkthroughStepSchema = z.strictObject({
  title: plainOutputText(100),
  explanation: plainOutputText(600),
  lines: z.array(lineSchema).max(12),
});

const tutorDiagnosticSchema = z.strictObject({
  severity: z.enum(["info", "warning", "error"]),
  title: plainOutputText(100),
  explanation: plainOutputText(500),
  line: lineSchema.optional(),
});

const checkQuestionSchema = z.strictObject({
  prompt: plainOutputText(300),
  hint: plainOutputText(240),
  answer: plainOutputText(300),
});

export const tutorContentSchema = z.strictObject({
  title: plainOutputText(100),
  overview: plainOutputText(900),
  learningGoal: plainOutputText(300),
  concepts: z.array(conceptSchema).max(12),
  walkthrough: z.array(walkthroughStepSchema).max(16),
  diagnostics: z.array(tutorDiagnosticSchema).max(10),
  checkQuestion: checkQuestionSchema.nullable(),
  nextStep: plainOutputText(300),
});

export const tutorResponseSchema = tutorContentSchema.extend({
  provider: z.enum(["local", "openai"]),
  isFallback: z.boolean(),
  notice: plainOutputText(240).nullable(),
});

export type TutorRequest = z.infer<typeof tutorRequestSchema>;
export type TutorContent = z.infer<typeof tutorContentSchema>;
export type TutorResponse = z.infer<typeof tutorResponseSchema>;
