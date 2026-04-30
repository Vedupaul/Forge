"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/providers/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PreviewIcon } from "@/components/ui/preview-icon";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "D" },
  { href: "/new", label: "Create", icon: "A" },
  { href: "/templates", label: "Templates", icon: "T" },
  { href: "/settings", label: "Settings", icon: "S" },
];

export function AppShell({ children, projects }: { children: ReactNode; projects: any[] }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 grid-background opacity-70" />
      <div className="relative flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r bg-background/72 backdrop-blur-xl lg:block">
          <div className="sticky top-0 flex h-screen flex-col gap-5 p-4">
            <Link href="/" className="flex items-center gap-3 px-2 py-1">
              <div className="flex size-9 items-center justify-center rounded-md bg-foreground text-sm font-bold text-background">
                F
              </div>
              <div>
                <div className="text-sm font-semibold">Forge</div>
                <div className="text-xs text-muted-foreground">AI site studio</div>
              </div>
            </Link>

            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground",
                      active && "bg-secondary text-foreground",
                    )}
                  >
                    <PreviewIcon name={item.icon} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <Separator />

            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-medium uppercase text-muted-foreground">Recent projects</span>
              <Badge variant="secondary">{projects.length}</Badge>
            </div>

            <div className="flex flex-col gap-2">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="rounded-md border bg-card/70 p-3 transition hover:-translate-y-0.5 hover:bg-card"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium">{project.name}</span>
                    <span className="text-xs text-muted-foreground">{project.starred ? "*" : ""}</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {project.lastEditedAt ? new Date(project.lastEditedAt).toLocaleDateString() : (project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "Just now")}
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-auto rounded-lg border bg-card/70 p-4">
              <div className="text-sm font-semibold">Usage this month</div>
              <div className="mt-3 h-2 overflow-hidden rounded-md bg-secondary">
                <div className="h-full w-[62%] rounded-md bg-primary" />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>62 generations</span>
                <span>Pro</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/78 px-4 backdrop-blur-xl lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
                <div className="flex size-8 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background">
                  F
                </div>
                <span className="font-semibold">Forge</span>
              </Link>
              <div className="hidden rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground md:block">
                Press Ctrl K for commands
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Import repo</Button>
              <Button size="sm">New project</Button>
              <ThemeToggle />
              <Avatar>
                <AvatarFallback>PV</AvatarFallback>
              </Avatar>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
