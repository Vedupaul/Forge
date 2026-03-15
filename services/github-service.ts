import { env } from "@/lib/env";
import type { BuilderFile } from "@/types/project";

const githubApi = "https://api.github.com";

function githubHeaders(token?: string) {
  const accessToken = token ?? process.env.GITHUB_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("GitHub access token is required. Connect GitHub OAuth or set GITHUB_ACCESS_TOKEN.");
  }

  return {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function listRepositories(token?: string) {
  const response = await fetch(`${githubApi}/user/repos?sort=updated&per_page=50`, {
    headers: githubHeaders(token),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub repository lookup failed: ${response.status}`);
  }

  return response.json();
}

export async function createRepository(input: {
  name: string;
  private?: boolean;
  description?: string;
  token?: string;
}) {
  const response = await fetch(`${githubApi}/user/repos`, {
    method: "POST",
    headers: {
      ...githubHeaders(input.token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input.name,
      private: input.private ?? true,
      description: input.description,
      auto_init: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub repository creation failed: ${response.status}`);
  }

  return response.json();
}

export async function pushFilesToRepository(input: {
  owner: string;
  repo: string;
  branch?: string;
  message: string;
  files: BuilderFile[];
  token?: string;
}) {
  const branch = input.branch ?? "main";
  const pushed: Array<{ path: string; sha?: string }> = [];

  for (const file of input.files) {
    const path = encodeURIComponent(file.path).replace(/%2F/g, "/");
    const existing = await fetch(`${githubApi}/repos/${input.owner}/${input.repo}/contents/${path}?ref=${branch}`, {
      headers: githubHeaders(input.token),
      cache: "no-store",
    });
    const existingPayload = existing.ok ? ((await existing.json()) as { sha?: string }) : null;

    const response = await fetch(`${githubApi}/repos/${input.owner}/${input.repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        ...githubHeaders(input.token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input.message,
        content: Buffer.from(file.content).toString("base64"),
        branch,
        sha: existingPayload?.sha,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to push ${file.path}: ${response.status}`);
    }

    const payload = (await response.json()) as { content?: { sha?: string } };
    pushed.push({ path: file.path, sha: payload.content?.sha });
  }

  return {
    provider: "github",
    owner: input.owner,
    repo: input.repo,
    branch,
    pushed,
  };
}

export function githubConfigured() {
  return Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);
}
