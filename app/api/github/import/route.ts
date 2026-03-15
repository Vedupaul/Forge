import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { owner?: string; repo?: string; branch?: string };
  if (!body.owner || !body.repo) {
    return NextResponse.json({ error: "owner and repo are required." }, { status: 400 });
  }

  return NextResponse.json({
    status: "QUEUED",
    message:
      "Repository import is queued. Backend workers can clone, index, and convert files into Forge project records.",
    repository: {
      owner: body.owner,
      repo: body.repo,
      branch: body.branch ?? "main",
    },
  });
}
