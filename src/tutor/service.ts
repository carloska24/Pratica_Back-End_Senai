import { createLocalTutorFallback } from "./fallback";
import {
  tutorContentSchema,
  tutorResponseSchema,
  type TutorContent,
  type TutorRequest,
  type TutorResponse,
} from "./schemas";

export type TutorAiGenerator = (
  input: TutorRequest,
  apiKey: string,
) => Promise<unknown>;

type TutorServiceDependencies = {
  apiKey?: string;
  generate?: TutorAiGenerator;
};

export async function createTutorResponse(
  input: TutorRequest,
  dependencies: TutorServiceDependencies,
): Promise<TutorResponse> {
  if (!dependencies.apiKey || !dependencies.generate) {
    return createLocalTutorFallback(input);
  }

  try {
    const generated = await dependencies.generate(input, dependencies.apiKey);
    const content: TutorContent = tutorContentSchema.parse(generated);

    return tutorResponseSchema.parse({
      ...content,
      provider: "openai",
      isFallback: false,
      notice: null,
    });
  } catch {
    return createLocalTutorFallback(input);
  }
}
