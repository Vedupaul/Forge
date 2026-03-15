import { NextResponse } from "next/server";
import { createRepository, listRepositories } from "@/services/github-service";

export async function GET() {
  try {
    const repositories = await listRepositories();
    return NextResponse.json({ repositories });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "GitHub is not configured." },
      { status: 412 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name: string; description?: string; private?: boolean };
    const repository = await createRepository(body);
    return NextResponse.json({ repository }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Repository creation failed." },
      { status: 412 },
    );
  }
}
