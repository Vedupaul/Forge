import { NextResponse } from "next/server";
import { createVercelDeployment } from "@/services/deploy-service";
import { getProject } from "@/services/project-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { projectId: string };
    const project = await getProject(body.projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const deployment = await createVercelDeployment({
      name: project.slug,
      files: project.files as any,
    });

    return NextResponse.json({ deployment });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Deployment failed." },
      { status: 412 },
    );
  }
}
