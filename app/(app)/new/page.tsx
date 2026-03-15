import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { templates } from "@/lib/preview-data";

export default function NewProjectPage() {
  return (
    <div className="grid gap-6 p-4 md:p-8 xl:grid-cols-[1fr_360px]">
      <section className="glass-panel rounded-lg p-6 md:p-8">
        <Badge variant="secondary">Create</Badge>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold md:text-5xl">Describe the site and Forge will plan the build.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          The frontend preview simulates the full prompt flow. Backend wiring will replace this with streaming OpenAI responses and persisted project creation.
        </p>
        <div className="mt-8">
          <Textarea defaultValue="Create a SaaS landing page for an AI support automation platform with pricing, social proof, and a polished dashboard preview." className="min-h-44 text-base" />
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/projects/northstar" className={buttonVariants({ size: "lg" })}>Generate project</Link>
            <Link href="/templates" className={buttonVariants({ variant: "outline", size: "lg" })}>Pick template</Link>
          </div>
        </div>
      </section>

      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>Prompt recipes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {templates.slice(0, 6).map((template) => (
            <div key={template.name} className="rounded-md border bg-background/60 p-3">
              <div className="text-sm font-medium">{template.name}</div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">{template.prompt}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
