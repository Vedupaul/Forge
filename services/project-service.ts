import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { slugify, titleFromPrompt } from "@/lib/utils";
import { generateDeterministicSite } from "@/ai/generator";
import type { BuilderProject, BuilderTemplate, BuilderVersion } from "@/types/project";

export async function getSessionUserId() {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  
  if (process.env.NODE_ENV === "development") {
    const demoUser = await prisma.user.findFirst({ where: { email: "demo@forge.dev" } });
    return demoUser?.id;
  }
  return null;
}

export async function listProjects() {
  const userId = await getSessionUserId();
  if (!userId) return [];
  
  return prisma.project.findMany({
    where: { ownerId: userId },
    include: { files: true },
    orderBy: { lastEditedAt: "desc" },
  });
}

export async function getProject(projectId: string) {
  const userId = await getSessionUserId();
  if (!userId) return null;

  return prisma.project.findFirst({
    where: { 
      OR: [{ id: projectId }, { slug: projectId }],
      ownerId: userId 
    },
    include: { 
      files: true, 
      versions: { orderBy: { createdAt: "desc" } } 
    },
  });
}

export async function createProject(prompt: string, templateSlug?: string) {
  const userId = await getSessionUserId();
  if (!userId) throw new Error("Unauthorized");

  const template = templateSlug ? await prisma.template.findUnique({ where: { slug: templateSlug } }) : null;
  
  const generated = generateDeterministicSite(prompt || template?.prompt || "Create a SaaS landing page.");
  const name = titleFromPrompt(prompt || template?.name || "Untitled project");
  const slug = slugify(name) || `project-${Date.now()}`;
  
  const project = await prisma.project.create({
    data: {
      ownerId: userId,
      name,
      slug,
      description: generated.summary,
      prompt,
      status: "READY",
      visibility: "PRIVATE",
      files: {
        createMany: {
          data: generated.files.map((f: any) => ({
            path: f.path,
            language: f.language,
            content: f.content
          }))
        }
      }
    },
    include: { files: true }
  });

  await prisma.projectVersion.create({
    data: {
      projectId: project.id,
      label: "Initial generation",
      summary: generated.summary,
      prompt,
      snapshot: JSON.stringify(generated.files),
      createdById: userId
    }
  });

  return project;
}

export async function updateProject(projectId: string, input: any) {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const project = await prisma.project.findFirst({
    where: { OR: [{ id: projectId }, { slug: projectId }], ownerId: userId }
  });

  if (!project) return null;

  return prisma.project.update({
    where: { id: project.id },
    data: {
      ...input,
      lastEditedAt: new Date()
    },
    include: { files: true }
  });
}

export async function snapshotProject(projectId: string, label: string, summary: string, prompt?: string) {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const project = await prisma.project.findFirst({
    where: { OR: [{ id: projectId }, { slug: projectId }], ownerId: userId },
    include: { files: true }
  });

  if (!project) return null;

  const version = await prisma.projectVersion.create({
    data: {
      projectId: project.id,
      label,
      summary,
      prompt,
      snapshot: JSON.stringify(project.files),
      createdById: userId
    }
  });

  return version;
}

export async function listVersions(projectId: string) {
  const userId = await getSessionUserId();
  if (!userId) return [];

  const project = await prisma.project.findFirst({
    where: { OR: [{ id: projectId }, { slug: projectId }], ownerId: userId }
  });

  if (!project) return [];

  return prisma.projectVersion.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: 'desc' }
  });
}

export async function listTemplates() {
  return prisma.template.findMany();
}
