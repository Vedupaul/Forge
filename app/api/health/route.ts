import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export function GET() {
  return NextResponse.json({
    ok: true,
    app: env.NEXT_PUBLIC_APP_NAME,
    services: {
      database: Boolean(env.DATABASE_URL),
      auth: Boolean(env.AUTH_SECRET && env.GOOGLE_CLIENT_ID && env.GITHUB_CLIENT_ID),
      openai: Boolean(env.OPENAI_API_KEY),
      github: Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET),
      vercel: Boolean(env.VERCEL_TOKEN),
      storage: Boolean(env.UPLOADTHING_TOKEN || env.UPLOADTHING_SECRET),
    },
  });
}
