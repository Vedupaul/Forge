import { NextResponse } from "next/server";
import { getProject, updateProject } from "@/services/project-service";
import { pushFilesToRepository } from "@/services/github-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      projectId: string;
      owner: string;
      repo: string;
      branch?: string;
      message?: string;
    };
    const project = await getProject(body.projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const result = await pushFilesToRepository({
      owner: body.owner,
      repo: body.repo,
      branch: body.branch,
      message: body.message ?? `Update ${project.name} from Forge`,
      files: project.files as any,
    });

    await updateProject(project.id, {
      repository: {
        owner: body.owner,
        repo: body.repo,
        branch: body.branch ?? "main",
      },
    });

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "GitHub push failed." },
      { status: 412 },
    );
  }
}
