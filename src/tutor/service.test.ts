import { describe, expect, it, vi } from "vitest";

import { createTutorResponse } from "./service";
import { validAiContent, validTutorRequest } from "./testFixtures";

describe("createTutorResponse", () => {
  it("não chama IA quando a chave não existe", async () => {
    const generate = vi.fn();

    const response = await createTutorResponse(validTutorRequest(), {
      apiKey: undefined,
      generate,
    });

    expect(generate).not.toHaveBeenCalled();
    expect(response.provider).toBe("local");
  });

  it("usa o gerador injetado quando a chave existe", async () => {
    const generate = vi.fn().mockResolvedValue(validAiContent);

    const response = await createTutorResponse(validTutorRequest(), {
      apiKey: "test-key",
      generate,
    });

    expect(generate).toHaveBeenCalledOnce();
    expect(response.provider).toBe("openai");
    expect(response.isFallback).toBe(false);
  });

  it("retorna fallback local se o provedor falhar", async () => {
    const generate = vi.fn().mockRejectedValue(new Error("falha confidencial"));

    const response = await createTutorResponse(validTutorRequest(), {
      apiKey: "test-key",
      generate,
    });

    expect(response.provider).toBe("local");
    expect(response.notice).not.toContain("falha confidencial");
  });

  it("descarta saída do modelo que viola o schema", async () => {
    const generate = vi.fn().mockResolvedValue({
      ...validAiContent,
      overview: "<strong>conteúdo não permitido</strong>",
    });

    const response = await createTutorResponse(validTutorRequest(), {
      apiKey: "test-key",
      generate,
    });

    expect(response.provider).toBe("local");
  });
});
