import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { templates } from "@/lib/preview-data";

const logos = ["Oracle", "Cansaas", "OpenAI", "GitHub", "Slack", "Clerk", "Vercel", "Mintlify"];
const steps = [
  ["Share your vision", "Describe the product, audience, pages, conversion goals, and constraints."],
  ["AI creates the framework", "Planner and UI agents draft routes, sections, components, and styling."],
  ["Evaluate UX wireframes", "Review responsive previews, regenerate sections, version, sync, and deploy."],
];
const features = [
  ["Sitemap created by AI", "Generate pages, data needs, and route structure before writing code."],
  ["Wireframes with AI UX focus", "Preview composition, hierarchy, conversion flow, and breakpoints."],
  ["Design-ready deliverables", "Export clean React components, Tailwind tokens, and ZIP packages."],
  ["Collaborate in real time", "Prepare branches, snapshots, share links, comments, and permissions."],
];
const plans = [
  ["Starter", "$0", "Daily AI credits, automatic sitemap generation, and template access."],
  ["Pro", "$19", "GitHub sync, Vercel deployments, export workflows, and priority agents."],
  ["Team", "$49", "Shared workspaces, role-based permissions, and collaboration groundwork."],
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#1e2d20] px-0 py-0 text-foreground md:px-6 md:py-8">
      <div className="mx-auto max-w-[1440px] overflow-hidden border border-white/10 bg-background shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
        <section className="relative isolate min-h-screen overflow-hidden px-5 py-6 md:px-16 lg:px-20">
          <div className="pointer-events-none absolute inset-0 -z-20 grid-background opacity-90" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,#101210_0%,transparent_24%,transparent_76%,#101210_100%),linear-gradient(180deg,transparent_0%,#101210_78%)]" />

          <nav className="relative z-10 flex items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3 font-bold">
              <span className="grid size-7 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground shadow-[0_0_30px_rgba(154,245,167,0.35)]">
                F
              </span>
              <span>Forge</span>
            </Link>
            <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
              <a href="#workflow" className="transition hover:text-foreground">Product</a>
              <a href="#features" className="transition hover:text-foreground">Templates</a>
              <a href="#pricing" className="transition hover:text-foreground">Pricing</a>
              <Link href="/dashboard" className="transition hover:text-foreground">Dashboard</Link>
              <Link href="/settings" className="transition hover:text-foreground">Resources</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/signin" className="hidden text-sm text-muted-foreground transition hover:text-foreground sm:block">
                Login
              </Link>
              <Link href="/projects/northstar" className={buttonVariants({ size: "sm" })}>
                Get Started Free
              </Link>
            </div>
          </nav>

          <div className="mx-auto mt-28 grid max-w-5xl justify-items-center text-center">
            <Badge variant="secondary" className="rounded-full border-primary/25 bg-primary/10 text-[#d9ffe0]">
              First month free - Annual plans
            </Badge>
            <h1 className="mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[0.98] md:text-7xl lg:text-8xl">
              Your AI partner for faster <span className="text-primary">website creation.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground">
              Outline your vision and Forge generates a structured website with pages, components,
              responsive styling, version history, GitHub sync, and deploy-ready previews.
            </p>

            <div className="relative mt-16 w-full max-w-2xl">
              <div className="pointer-events-none absolute -inset-x-24 -inset-y-20 -z-10 bg-[repeating-linear-gradient(180deg,rgba(154,245,167,0.055)_0_1px,transparent_1px_24px)] opacity-80 [mask-image:linear-gradient(to_bottom,transparent,black_38%,transparent)]" />
              <div className="overflow-hidden rounded-lg border border-primary/25 bg-[#111311]/85 shadow-[0_28px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <textarea
                  aria-label="Website prompt"
                  className="min-h-28 w-full resize-none border-0 border-b border-white/10 bg-transparent px-5 py-5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Which website do you want to create, and what is the goal behind it?"
                  defaultValue="Create a premium SaaS landing page for an AI support automation company."
                />
                <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-2 overflow-x-auto text-xs font-semibold text-muted-foreground">
                    {["Build", "Plan", "Design", "Refine", "Launch"].map((item, index) => (
                      <span key={item} className={index === 0 ? "rounded-md bg-primary/10 px-3 py-2 text-foreground" : "px-3 py-2"}>
                        {item}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/projects/northstar"
                    aria-label="Generate website"
                    className="grid size-9 place-items-center rounded-md bg-primary font-black text-primary-foreground"
                  >
                    -&gt;
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-28 grid justify-items-center gap-7">
              <p className="text-sm font-semibold">Crafted with confidence by creators and teams.</p>
              <div className="flex max-w-3xl flex-wrap justify-center gap-x-10 gap-y-5 text-xl font-semibold text-foreground/85">
                {logos.map((logo) => (
                  <span key={logo}>{logo}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="relative isolate px-5 py-24 md:px-20">
          <div className="pointer-events-none absolute inset-0 -z-10 grid-background opacity-40" />
          <SectionHeading
            kicker="How it works"
            title="Build your website in three sharp moves."
            description="Forge turns rough direction into an organized site plan, component system, and editable preview without making the workflow feel heavy."
          />
          <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3">
            {steps.map(([title, description], index) => (
              <Card key={title} className="group min-h-60 bg-card/70 transition hover:-translate-y-1 hover:border-primary/35">
                <CardContent className="p-7">
                  <span className="grid size-9 place-items-center rounded-md border border-primary/25 bg-primary/10 text-sm font-black text-primary">
                    {index + 1}
                  </span>
                  <p className="mt-10 text-xs text-muted-foreground">Step {index + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="features" className="px-5 py-24 md:px-20">
          <SectionHeading
            kicker="Features"
            title="Everything needed to move from prompt to production."
            description="A polished generation loop with code visibility, project memory, source control, deployment status, and team-ready foundations."
          />
          <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-2">
            {features.map(([title, description], index) => (
              <Card key={title} className="overflow-hidden bg-card/70 transition hover:-translate-y-1 hover:border-primary/35">
                <CardContent className="p-7">
                  <span className="grid size-9 place-items-center rounded-md border border-primary/25 bg-primary/10 text-sm font-black text-primary">
                    {title.charAt(0)}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                  <div className="editor-grid relative mt-7 h-40 overflow-hidden rounded-md border bg-background/60">
                    <div className="absolute inset-5 rounded-md border border-dashed border-primary/25" />
                    <div className="absolute left-12 right-12 top-16 h-10 rounded-md bg-primary/10" />
                    <div className="absolute bottom-7 left-16 h-3 w-32 rounded-md bg-white/10" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mx-auto mt-16 max-w-6xl">
            <StudioPreview />
          </div>
        </section>

        <section id="pricing" className="px-5 py-24 md:px-20">
          <SectionHeading
            kicker="Pricing"
            title="Affordable plans for every build phase."
            description="Begin with daily credits, upgrade when your team needs collaboration, exports, deployments, and version control."
          />
          <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3">
            {plans.map(([name, price, description], index) => (
              <Card
                key={name}
                className={`bg-card/70 transition hover:-translate-y-1 hover:border-primary/35 ${index === 1 ? "border-primary/40 bg-primary/10" : ""}`}
              >
                <CardContent className="p-7">
                  <h3 className="text-xl font-semibold">{name} Plan</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                  <div className="mt-6 text-4xl font-semibold">{price}<span className="text-sm text-muted-foreground"> /month</span></div>
                  <Link href="/projects/northstar" className={buttonVariants({ variant: index === 1 ? "default" : "outline", className: "mt-6 w-full" })}>
                    {index === 1 ? "Upgrade to Pro" : "Start now"}
                  </Link>
                  <ul className="mt-7 grid gap-3 text-sm text-muted-foreground">
                    <li>Daily AI generation credits</li>
                    <li>Responsive preview modes</li>
                    <li>Project history and export</li>
                    <li>Deployment-ready code</li>
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="px-5 py-24 md:px-20">
          <SectionHeading
            kicker="Templates"
            title="Start with a proven website shape."
            description="SaaS, portfolio, startup, dashboard, blog, ecommerce, and agency starters are ready to remix."
          />
          <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-3">
            {templates.map((template) => (
              <Badge key={template.name} variant="secondary" className="rounded-md px-3 py-2">
                {template.name}
              </Badge>
            ))}
          </div>
          <Separator className="mx-auto mt-20 max-w-5xl" />
        </section>
      </div>
    </main>
  );
}

function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto grid max-w-3xl justify-items-center text-center">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-primary">{kicker}</div>
      <h2 className="mt-4 text-balance text-4xl font-semibold leading-tight md:text-5xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">{description}</p>
    </div>
  );
}

function StudioPreview() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card/70">
      <div className="flex flex-col gap-3 border-b px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-semibold">Northstar SaaS</div>
          <div className="text-xs text-muted-foreground">Autosaved - Version 18 - GitHub branch ready</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/projects/northstar" className={buttonVariants({ variant: "outline", size: "sm" })}>Open builder</Link>
          <Link href="/api/projects/northstar/export" className={buttonVariants({ size: "sm" })}>Export ZIP</Link>
        </div>
      </div>
      <div className="grid min-h-[560px] lg:grid-cols-[300px_minmax(320px,0.9fr)_minmax(420px,1.1fr)]">
        <div className="border-b p-4 lg:border-b-0 lg:border-r">
          <div className="grid grid-cols-3 gap-1 rounded-md bg-secondary p-1 text-xs font-semibold text-muted-foreground">
            <span className="rounded-sm bg-background px-3 py-2 text-center text-foreground">Chat</span>
            <span className="px-3 py-2 text-center">Agents</span>
            <span className="px-3 py-2 text-center">History</span>
          </div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-lg border bg-background/50 p-3 text-sm leading-6 text-muted-foreground">
              Planner scoped hero, proof, feature narrative, pricing, and FAQ.
            </div>
            <div className="ml-8 rounded-lg bg-primary p-3 text-sm leading-6 text-primary-foreground">
              Create a SaaS landing page for AI support automation.
            </div>
            <div className="rounded-lg border bg-background/50 p-3 text-sm leading-6 text-muted-foreground">
              UI generator produced responsive files and a polished preview.
            </div>
          </div>
        </div>
        <div className="border-b bg-[#0d100d] p-4 text-[#d6e4d3] lg:border-b-0 lg:border-r">
          <div className="mb-4 flex gap-2 text-xs">
            <span className="rounded-md border border-primary/25 px-3 py-2 text-foreground">app/page.tsx</span>
            <span className="rounded-md border border-white/10 px-3 py-2 text-muted-foreground">hero.tsx</span>
          </div>
          <pre className="overflow-auto text-xs leading-6">
{`export default function Page() {
  return (
    <main className="bg-[#101210]">
      <Hero />
      <FeatureGrid />
      <Pricing />
    </main>
  );
}`}
          </pre>
        </div>
        <div className="editor-grid p-5">
          <div className="overflow-hidden rounded-lg border bg-[#f8faf6] text-[#101510] shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <strong>Northstar</strong>
              <button className="rounded-md bg-[#9af5a7] px-3 py-2 text-xs font-bold text-[#102112]">Start free</button>
            </div>
            <div className="grid gap-6 p-6 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <h3 className="text-3xl font-semibold leading-tight text-[#101510]">
                  Resolve customer work before it becomes a queue.
                </h3>
                <p className="mt-4 text-sm leading-6 text-[#687467]">
                  AI agents, approvals, and operational visibility for support teams.
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4 shadow-xl">
                <div className="h-28 rounded-md bg-gradient-to-br from-[#0f5f59] to-[#9af5a7]" />
                {["AI triage", "Human approval", "Deploy notes"].map((item) => (
                  <div key={item} className="mt-3 flex justify-between rounded-md border p-3 text-sm">
                    <strong>{item}</strong>
                    <span>Ready</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
