import { handleTutorPost } from "@/tutor/handler";
import { generateTutorWithOpenAI } from "@/tutor/openaiGenerator";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  return handleTutorPost(request, {
    apiKey: process.env.OPENAI_API_KEY,
    generate: generateTutorWithOpenAI,
  });
}
