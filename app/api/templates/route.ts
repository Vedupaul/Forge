import { NextResponse } from "next/server";
import { templates } from "@/services/project-service";

export function GET() {
  return NextResponse.json({ templates });
}
