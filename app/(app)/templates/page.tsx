import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { templates } from "@/lib/preview-data";

export default function TemplatesPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="glass-panel rounded-lg p-6 md:p-8">
        <Badge variant="secondary">Templates</Badge>
        <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Start with a shape, then let AI adapt it.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          Each starter includes prompt strategy, file structure, responsive sections, and deployment-ready defaults.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template, index) => (
          <Card key={template.name} className="group overflow-hidden bg-card/70">
            <div className="h-36 bg-[linear-gradient(135deg,var(--primary),var(--accent))] opacity-90" style={{ filter: `hue-rotate(${index * 18}deg)` }} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{template.name}</CardTitle>
                <Badge variant="outline">{template.category}</Badge>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="rounded-md border bg-background/60 p-3 text-sm text-muted-foreground">{template.prompt}</p>
              <Link href="/new" className={buttonVariants({ className: "mt-4 w-full" })}>Use template</Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
