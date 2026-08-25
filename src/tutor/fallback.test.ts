import { describe, expect, it } from "vitest";

import { createLocalTutorFallback } from "./fallback";
import { tutorResponseSchema } from "./schemas";
import { validTutorRequest } from "./testFixtures";

describe("createLocalTutorFallback", () => {
  it("gera sempre uma resposta local válida e determinística", () => {
    const request = validTutorRequest();

    const first = createLocalTutorFallback(request);
    const second = createLocalTutorFallback(request);

    expect(first).toEqual(second);
    expect(first.provider).toBe("local");
    expect(first.isFallback).toBe(true);
    expect(first.concepts.map((concept) => concept.name)).toContain("função");
    expect(tutorResponseSchema.safeParse(first).success).toBe(true);
  });

  it("não replica HTML ou instruções executáveis vindas do resumo AST", () => {
    const response = createLocalTutorFallback({
      ...validTutorRequest(),
      astSummary: {
        ...validTutorRequest().astSummary,
        concepts: ["<img src=x onerror=alert(1)>", "função"],
      },
    });

    expect(JSON.stringify(response)).not.toMatch(/<img|onerror=/i);
    expect(tutorResponseSchema.safeParse(response).success).toBe(true);
  });
});
