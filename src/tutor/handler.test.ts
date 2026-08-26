import { describe, expect, it, vi } from "vitest";

import { handleTutorPost } from "./handler";
import { validTutorRequest } from "./testFixtures";

describe("handleTutorPost", () => {
  it("rejeita corpos acima do limite antes de interpretar o JSON", async () => {
    const request = new Request("http://localhost/api/tutor", {
      method: "POST",
      body: JSON.stringify({ payload: "x".repeat(300_000) }),
      headers: { "content-type": "application/json" },
    });

    const response = await handleTutorPost(request, {});

    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({
      error: { code: "PAYLOAD_TOO_LARGE", message: "Solicitação do tutor excede o limite permitido." },
    });
  });

  it("retorna 400 para JSON malformado", async () => {
    const request = new Request("http://localhost/api/tutor", {
      method: "POST",
      body: "{",
      headers: { "content-type": "application/json" },
    });

    const response = await handleTutorPost(request, {});

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { code: "INVALID_JSON", message: "Corpo JSON inválido." },
    });
  });

  it("retorna 400 para entrada fora do contrato sem expor detalhes internos", async () => {
    const request = new Request("http://localhost/api/tutor", {
      method: "POST",
      body: JSON.stringify({ ...validTutorRequest(), moduleId: "M13" }),
      headers: { "content-type": "application/json" },
    });

    const response = await handleTutorPost(request, {});
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: { code: "INVALID_INPUT", message: "Solicitação do tutor inválida." },
    });
  });

  it("responde com fallback quando não há chave", async () => {
    const generate = vi.fn();
    const request = new Request("http://localhost/api/tutor", {
      method: "POST",
      body: JSON.stringify(validTutorRequest()),
      headers: { "content-type": "application/json" },
    });

    const response = await handleTutorPost(request, { generate });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.provider).toBe("local");
    expect(generate).not.toHaveBeenCalled();
  });
});
