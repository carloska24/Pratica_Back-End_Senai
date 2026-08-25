import { createTutorResponse, type TutorAiGenerator } from "./service";
import { tutorRequestSchema } from "./schemas";

type TutorHandlerDependencies = {
  apiKey?: string;
  generate?: TutorAiGenerator;
};

export const MAX_TUTOR_REQUEST_BYTES = 256_000;

const jsonError = (status: number, code: string, message: string) =>
  Response.json({ error: { code, message } }, { status });

export async function handleTutorPost(
  request: Request,
  dependencies: TutorHandlerDependencies,
): Promise<Response> {
  let body: unknown;

  try {
    const declaredLength = Number(request.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_TUTOR_REQUEST_BYTES) {
      return jsonError(413, "PAYLOAD_TOO_LARGE", "Solicitação do tutor excede o limite permitido.");
    }
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_TUTOR_REQUEST_BYTES) {
      return jsonError(413, "PAYLOAD_TOO_LARGE", "Solicitação do tutor excede o limite permitido.");
    }
    body = JSON.parse(rawBody);
  } catch {
    return jsonError(400, "INVALID_JSON", "Corpo JSON inválido.");
  }

  const parsed = tutorRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "INVALID_INPUT", "Solicitação do tutor inválida.");
  }

  const response = await createTutorResponse(parsed.data, dependencies);
  return Response.json(response, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
