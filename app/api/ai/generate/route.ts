import { NextResponse } from "next/server";
import { generateDeterministicSite } from "@/ai/generator";
import { createProject } from "@/services/project-service";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limited = await rateLimit(`ai:generate:${ip}`, 20, 60);
  if (!limited.success) {
    return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
  }

  const body = (await request.json()) as { prompt?: string; persist?: boolean };
  const prompt = body.prompt?.trim();
  if (!prompt) {
    return NextResponse.json({ error: "prompt is required." }, { status: 400 });
  }

  const result = generateDeterministicSite(prompt);
  const project = body.persist ? createProject(prompt) : null;
  return NextResponse.json({ result, project });
}
