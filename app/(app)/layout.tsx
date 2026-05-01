import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { listProjects } from "@/services/project-service";

export default async function ProductLayout({ children }: { children: ReactNode }) {
  const projects = await listProjects();
  return <AppShell projects={projects}>{children}</AppShell>;
}
