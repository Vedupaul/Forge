import { NextResponse } from "next/server";
import { getProject, updateProject } from "@/services/project-service";

export async function POST(_request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = getProject(projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  updateProject(projectId, { visibility: "PUBLIC" });
  return NextResponse.json({
    shareUrl: `/share/${project.slug}`,
    project,
  });
}
