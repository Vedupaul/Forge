import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { getProject } from "@/services/project-service";

export default async function SharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || project.visibility === "PRIVATE") {
    notFound();
  }

  const firstFile = project.files[0];

  return (
    <main className="min-h-screen bg-background p-5 md:p-10">
      <div className="pointer-events-none fixed inset-0 grid-background opacity-60" />
      <section className="relative mx-auto max-w-6xl">
        <div className="glass-panel rounded-lg p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Shared Forge project</p>
              <h1 className="mt-2 text-4xl font-semibold">{project.name}</h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">{project.description}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/api/projects/${project.id}/export`} className={buttonVariants({ variant: "outline" })}>
                Download ZIP
              </Link>
              <Link href="/dashboard" className={buttonVariants()}>
                Open Forge
              </Link>
            </div>
          </div>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-lg border bg-[#0d100d] p-5 text-[#d6e4d3]">
          <div className="mb-4 text-sm text-muted-foreground">{firstFile?.path}</div>
          <pre className="overflow-auto text-sm leading-7">
            <code>{firstFile?.content}</code>
          </pre>
        </div>
      </section>
    </main>
  );
}
