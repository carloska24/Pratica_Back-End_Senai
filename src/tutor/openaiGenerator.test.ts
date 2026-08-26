import { describe, expect, it, vi } from "vitest";

import { createOpenAiTutorGenerator } from "./openaiGenerator";
import { validAiContent, validTutorRequest } from "./testFixtures";

describe("createOpenAiTutorGenerator", () => {
  it("limita a geração, usa saída estruturada e não habilita ferramentas", async () => {
    const generateText = vi.fn().mockResolvedValue({ output: validAiContent });
    const model = { specificationVersion: "v4" };
    const generator = createOpenAiTutorGenerator({
      createModel: vi.fn().mockReturnValue(model),
      generateText,
    });

    const result = await generator(validTutorRequest(), "test-key");
    const options = generateText.mock.calls[0][0];

    expect(result).toEqual(validAiContent);
    expect(options.model).toBe(model);
    expect(options.maxOutputTokens).toBeLessThanOrEqual(2_000);
    expect(options.tools).toBeUndefined();
    expect(options.output).toBeDefined();
    expect(options.system).not.toContain(validTutorRequest().code);
  });
});
