import { createOpenAI } from "@ai-sdk/openai";
import { generateText, Output } from "ai";

import { buildTutorPrompt } from "./prompt";
import { tutorContentSchema, type TutorRequest } from "./schemas";
import type { TutorAiGenerator } from "./service";

const MAX_OUTPUT_TOKENS = 1_800;
const REQUEST_TIMEOUT_MS = 20_000;

type GenerateTextLike = (
  options: Record<string, unknown>,
) => Promise<{ output: unknown }>;

type OpenAiGeneratorDependencies = {
  createModel: (apiKey: string, modelId: string) => unknown;
  generateText: GenerateTextLike;
};

export function createOpenAiTutorGenerator(
  dependencies?: OpenAiGeneratorDependencies,
): TutorAiGenerator {
  return async (input, apiKey) => {
    const prompt = buildTutorPrompt(input);
    const modelId = process.env.OPENAI_TUTOR_MODEL?.trim() || "gpt-5.6-luna";
    const commonOptions = {
      system: prompt.system,
      prompt: prompt.user,
      output: Output.object({ schema: tutorContentSchema }),
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    };

    const result = dependencies
      ? await dependencies.generateText({
          ...commonOptions,
          model: dependencies.createModel(apiKey, modelId),
        })
      : await generateText({
          ...commonOptions,
          model: createOpenAI({ apiKey }).responses(modelId),
        });

    return tutorContentSchema.parse(result.output);
  };
}

export const generateTutorWithOpenAI = createOpenAiTutorGenerator();
