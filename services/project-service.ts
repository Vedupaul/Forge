import { generateDeterministicSite } from "@/ai/generator";
import { files as previewFiles, templates as previewTemplates } from "@/lib/preview-data";
import { slugify, titleFromPrompt } from "@/lib/utils";
import type { BuilderProject, BuilderTemplate, BuilderVersion } from "@/types/project";

const now = new Date().toISOString();

const initialProjects: BuilderProject[] = [
  {
    id: "northstar",
    name: "Northstar SaaS",
    slug: "northstar",
    description: "Conversion-focused landing page with pricing, proof, and onboarding flow.",
    prompt: "Create a SaaS landing page for an AI support automation company.",
    status: "READY",
    visibility: "PRIVATE",
    starred: true,
    updatedAt: now,
    files: previewFiles,
    repository: {
      owner: "preview",
      repo: "northstar-saas",
      branch: "main",
    },
  },
];

const store = globalThis as unknown as {
  forgeProjects?: BuilderProject[];
  forgeVersions?: BuilderVersion[];
};

export const projects = store.forgeProjects ?? initialProjects;
export const versions =
  store.forgeVersions ??
  [
    {
      id: "v17",
      projectId: "northstar",
      label: "v17",
      summary: "Added responsive pricing and premium hero direction.",
      prompt: "Make the hero more premium and add a pricing section.",
      createdAt: now,
      files: previewFiles,
    },
  ];

store.forgeProjects = projects;
store.forgeVersions = versions;

export const templates: BuilderTemplate[] = previewTemplates.map((template, index) => ({
  id: slugify(template.name),
  name: template.name,
  slug: slugify(template.name),
  category: template.category,
  description: template.description,
  prompt: template.prompt,
  featured: index < 3,
  files: generateDeterministicSite(template.prompt).files,
}));

export function listProjects() {
  return projects;
}

export function getProject(projectId: string) {
  return projects.find((project) => project.id === projectId || project.slug === projectId);
}

export function createProject(prompt: string, templateSlug?: string) {
  const template = templateSlug ? templates.find((item) => item.slug === templateSlug) : undefined;
  const generated = generateDeterministicSite(prompt || template?.prompt || "Create a SaaS landing page.");
  const name = titleFromPrompt(prompt || template?.name || "Untitled project");
  const slug = slugify(name) || `project-${projects.length + 1}`;
  const project: BuilderProject = {
    id: `${slug}-${Date.now()}`,
    name,
    slug,
    description: generated.summary,
    prompt,
    status: "READY",
    visibility: "PRIVATE",
    starred: false,
    updatedAt: new Date().toISOString(),
    files: generated.files,
  };

  projects.unshift(project);
  versions.unshift({
    id: `v-${Date.now()}`,
    projectId: project.id,
    label: "Initial generation",
    summary: generated.summary,
    prompt,
    createdAt: project.updatedAt,
    files: generated.files,
  });

  return project;
}

export function updateProject(projectId: string, input: Partial<BuilderProject>) {
  const project = getProject(projectId);
  if (!project) return null;
  Object.assign(project, input, { updatedAt: new Date().toISOString() });
  return project;
}

export function snapshotProject(projectId: string, label: string, summary: string, prompt?: string) {
  const project = getProject(projectId);
  if (!project) return null;
  const version: BuilderVersion = {
    id: `v-${Date.now()}`,
    projectId: project.id,
    label,
    summary,
    prompt,
    createdAt: new Date().toISOString(),
    files: project.files,
  };
  versions.unshift(version);
  return version;
}

export function listVersions(projectId: string) {
  const project = getProject(projectId);
  if (!project) return [];
  return versions.filter((version) => version.projectId === project.id);
}
