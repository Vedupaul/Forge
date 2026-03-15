import { env } from "@/lib/env";
import type { BuilderFile } from "@/types/project";

export async function createVercelDeployment(input: {
  name: string;
  files: BuilderFile[];
  projectSettings?: Record<string, unknown>;
}) {
  if (!env.VERCEL_TOKEN) {
    return {
      provider: "vercel",
      status: "CONFIGURATION_REQUIRED",
      message: "Set VERCEL_TOKEN to create real deployments.",
      url: null,
    };
  }

  const files = input.files.map((file) => ({
    file: file.path,
    data: file.content,
  }));

  const response = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input.name,
      files,
      projectSettings: input.projectSettings,
      target: "preview",
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Vercel deployment failed: ${response.status} ${detail}`);
  }

  return response.json();
}
