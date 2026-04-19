"use server";

import { revalidatePath } from "next/cache";
import { createProject, snapshotProject, updateProject } from "@/services/project-service";

export async function createProjectAction(formData: FormData) {
  const prompt = String(formData.get("prompt") ?? "");
  const templateSlug = String(formData.get("templateSlug") ?? "") || undefined;
  const project = await createProject(prompt, templateSlug);
  revalidatePath("/dashboard");
  return project;
}

export async function snapshotProjectAction(projectId: string, label: string, summary: string) {
  const version = await snapshotProject(projectId, label, summary);
  revalidatePath(`/projects/${projectId}`);
  return version;
}

export async function archiveProjectAction(projectId: string) {
  const project = await updateProject(projectId, { archived: true, status: "ARCHIVED" });
  revalidatePath("/dashboard");
  return project;
}
