export type BuilderFile = {
  path: string;
  language: string;
  content: string;
};

export type BuilderProject = {
  id: string;
  name: string;
  slug: string;
  description: string;
  prompt: string;
  status: "DRAFT" | "BUILDING" | "READY" | "ARCHIVED";
  visibility: "PRIVATE" | "TEAM" | "PUBLIC";
  starred: boolean;
  archived?: boolean;
  updatedAt: string;
  previewUrl?: string;
  deploymentUrl?: string;
  repository?: {
    owner: string;
    repo: string;
    branch: string;
    lastCommitSha?: string;
  };
  files: BuilderFile[];
};

export type BuilderTemplate = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  prompt: string;
  files: BuilderFile[];
  featured?: boolean;
};

export type BuilderVersion = {
  id: string;
  projectId: string;
  label: string;
  summary: string;
  prompt?: string;
  createdAt: string;
  files: BuilderFile[];
};

export type AgentStep = {
  name: string;
  status: "Queued" | "Running" | "Complete" | "Failed";
  detail: string;
};

export type AiGenerationResult = {
  summary: string;
  files: BuilderFile[];
  steps: AgentStep[];
};
