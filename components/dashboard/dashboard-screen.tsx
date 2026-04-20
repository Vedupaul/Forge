import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PreviewIcon } from "@/components/ui/preview-icon";
export function DashboardScreen({
  projects,
  templates,
}: {
  projects: any[];
  templates: any[];
}) {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="glass-panel rounded-lg p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge variant="secondary">Workspace</Badge>
              <h1 className="mt-4 text-3xl font-semibold md:text-5xl">What are we building today?</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                Start from a prompt, remix a template, import a repository, or continue a project with full version history.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/templates" className={buttonVariants({ variant: "outline" })}>Templates</Link>
              <Link href="/new" className={buttonVariants()}>New project</Link>
            </div>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-[1fr_auto]">
            <Input placeholder="Search projects, templates, commits, and prompts..." />
            <Button variant="secondary">Search</Button>
          </div>
        </div>

        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle>Generation budget</CardTitle>
            <CardDescription>Subscription-ready usage limits and upgrade path.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Progress value={62} />
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["62", "runs"],
                ["14", "deploys"],
                ["3", "seats"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-md border bg-background/60 p-3">
                  <div className="text-xl font-semibold">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent projects</h2>
            <p className="text-sm text-muted-foreground">Autosaved projects with previews and quick actions.</p>
          </div>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="group rounded-lg border bg-card/70 p-4 transition hover:-translate-y-1 hover:bg-card hover:shadow-lg">
              <div className={`relative h-40 overflow-hidden rounded-md bg-gradient-to-br ${project.accent || 'from-zinc-800 to-zinc-900'}`}>
                <div className="absolute inset-4 rounded-md border border-white/35 bg-white/28 p-3 backdrop-blur">
                  <div className="h-3 w-24 rounded-md bg-white/80" />
                  <div className="mt-6 h-8 w-40 rounded-md bg-white/70" />
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="h-14 rounded-md bg-white/55" />
                    <div className="h-14 rounded-md bg-white/45" />
                    <div className="h-14 rounded-md bg-white/35" />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{project.description}</p>
                </div>
                <Badge variant={project.status === "READY" || project.status === "Ready" ? "success" : "secondary"}>{project.status}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(project.preview || ["React", "TypeScript"]).map((item: string) => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                {project.lastEditedAt ? new Date(project.lastEditedAt).toLocaleDateString() : (project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "Just now")}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle>Project history</CardTitle>
            <CardDescription>Snapshots, forks, duplicates, restores, and commits in one timeline.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {["Restored pricing section from v12", "Pushed landing-page branch to GitHub", "Generated mobile nav and command menu", "Forked Agency Website template"].map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-md border bg-background/60 p-3">
                <PreviewIcon name={`${index + 1}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{item}</div>
                  <div className="text-xs text-muted-foreground">{index + 1}h ago</div>
                </div>
                <Button variant="ghost" size="sm">Open</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle>Starter templates</CardTitle>
            <CardDescription>Launch common sites with production-ready structure.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {templates.slice(0, 5).map((template) => (
              <Link key={template.name} href="/new" className="flex items-center gap-3 rounded-md p-2 transition hover:bg-secondary">
                <PreviewIcon name={template.name} />
                <div>
                  <div className="text-sm font-medium">{template.name}</div>
                  <div className="text-xs text-muted-foreground">{template.category}</div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
