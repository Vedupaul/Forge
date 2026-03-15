"use server";

import { revalidatePath } from "next/cache";
import { createProject, snapshotProject, updateProject } from "@/services/project-service";

export async function createProjectAction(formData: FormData) {
  const prompt = String(formData.get("prompt") ?? "");
  const templateSlug = String(formData.get("templateSlug") ?? "") || undefined;
  const project = createProject(prompt, templateSlug);
  revalidatePath("/dashboard");
  return project;
}

export async function snapshotProjectAction(projectId: string, label: string, summary: string) {
  const version = snapshotProject(projectId, label, summary);
  revalidatePath(`/projects/${projectId}`);
  return version;
}

export async function archiveProjectAction(projectId: string) {
  const project = updateProject(projectId, { archived: true, status: "ARCHIVED" });
  revalidatePath("/dashboard");
  return project;
}
