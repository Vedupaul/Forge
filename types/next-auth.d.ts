import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tier: "FREE" | "PRO" | "TEAM" | "ENTERPRISE";
      username?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    tier: "FREE" | "PRO" | "TEAM" | "ENTERPRISE";
    username?: string | null;
  }
}
