import { getProject } from "@/services/project-service";
import { createZip } from "@/services/zip";

export async function GET(_request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = getProject(projectId);
  if (!project) {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }

  const zip = createZip(project.files);
  return new Response(zip, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${project.slug}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
