import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OnboardingPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
      <section className="glass-panel rounded-lg p-6 md:p-10">
        <Badge variant="secondary">Onboarding</Badge>
        <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Set up your AI build workspace.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          Invite teammates, connect providers, choose usage limits, and create your first project.
        </p>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        {["Connect GitHub", "Choose template", "Deploy preview"].map((step, index) => (
          <Card key={step} className="bg-card/70">
            <CardContent className="p-5">
              <div className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </div>
              <h2 className="mt-5 font-semibold">{step}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {index === 0 && "Authorize repositories and branch sync for generated code."}
                {index === 1 && "Start with SaaS, portfolio, dashboard, commerce, blog, or agency structure."}
                {index === 2 && "Ship to Vercel and track status from the project workspace."}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Link href="/dashboard" className={buttonVariants({ size: "lg", className: "self-start" })}>Enter dashboard</Link>
    </div>
  );
}
