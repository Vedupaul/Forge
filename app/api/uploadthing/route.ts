import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export function GET() {
  return NextResponse.json({
    configured: Boolean(env.UPLOADTHING_TOKEN || env.UPLOADTHING_SECRET || env.UPLOADTHING_APP_ID),
    message:
      "Storage surface is ready. Add UploadThing credentials or replace this route with Supabase Storage signed uploads.",
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; type?: string; size?: number };
  return NextResponse.json({
    status: env.UPLOADTHING_TOKEN ? "READY_FOR_PROVIDER_UPLOAD" : "CONFIGURATION_REQUIRED",
    asset: body,
  });
}
