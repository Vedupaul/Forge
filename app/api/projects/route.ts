import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/services/project-service";
import { rateLimit } from "@/lib/rate-limit";

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limited = await rateLimit(`project:create:${ip}`, 20, 60);
  if (!limited.success) {
    return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
  }

  const body = (await request.json()) as { prompt?: string; templateSlug?: string };
  const project = await createProject(body.prompt ?? "", body.templateSlug);
  return NextResponse.json({ project }, { status: 201 });
}
