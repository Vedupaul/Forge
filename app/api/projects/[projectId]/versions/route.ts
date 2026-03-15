import { NextResponse } from "next/server";
import { listVersions, snapshotProject } from "@/services/project-service";

export async function GET(_request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return NextResponse.json({ versions: listVersions(projectId) });
}

export async function POST(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const body = (await request.json()) as { label?: string; summary?: string; prompt?: string };
  const version = snapshotProject(
    projectId,
    body.label ?? "Manual snapshot",
    body.summary ?? "Saved project snapshot.",
    body.prompt,
  );

  if (!version) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ version }, { status: 201 });
}
