import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { command?: string; files?: unknown[] };

  if (!process.env.E2B_API_KEY) {
    return NextResponse.json(
      {
        status: "CONFIGURATION_REQUIRED",
        message:
          "Set E2B_API_KEY to execute generated projects in an isolated sandbox. The editor preview remains available without execution.",
        command: body.command ?? "npm run dev",
        filesReceived: Array.isArray(body.files) ? body.files.length : 0,
      },
      { status: 412 },
    );
  }

  return NextResponse.json({
    status: "QUEUED",
    provider: "e2b",
    command: body.command ?? "npm run dev",
    message:
      "Sandbox execution request accepted. Wire this route to the E2B SDK worker for long-running command streams.",
  });
}
