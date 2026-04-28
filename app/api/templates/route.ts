import { NextResponse } from "next/server";
import { listTemplates } from "@/services/project-service";

export async function GET() {
  const templates = await listTemplates();
  return NextResponse.json({ templates });
}
