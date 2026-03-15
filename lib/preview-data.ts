export const projects = [
  {
    id: "northstar",
    name: "Northstar SaaS",
    description: "Conversion-focused landing page with pricing, proof, and onboarding flow.",
    updatedAt: "Edited 8 minutes ago",
    status: "Ready",
    accent: "from-teal-500 to-cyan-300",
    starred: true,
    preview: ["Hero", "Pricing", "FAQ"],
  },
  {
    id: "atlas",
    name: "Atlas Analytics",
    description: "Dashboard with chart cards, activity stream, and workspace switcher.",
    updatedAt: "Edited 1 hour ago",
    status: "Building",
    accent: "from-orange-500 to-rose-300",
    starred: false,
    preview: ["Charts", "Tables", "Teams"],
  },
  {
    id: "folio",
    name: "Studio Folio",
    description: "Editorial portfolio with case studies and animated project index.",
    updatedAt: "Edited yesterday",
    status: "Synced",
    accent: "from-lime-500 to-emerald-300",
    starred: true,
    preview: ["Work", "About", "Contact"],
  },
];

export const templates = [
  {
    name: "SaaS Landing Page",
    category: "Marketing",
    description: "Premium landing page with hero, social proof, pricing, and FAQ.",
    prompt: "Create a SaaS landing page for an AI operations platform.",
  },
  {
    name: "Portfolio",
    category: "Creator",
    description: "Case-study-led personal site with project pages and contact flow.",
    prompt: "Build a modern portfolio for a product designer.",
  },
  {
    name: "AI Startup",
    category: "Startup",
    description: "Investor-ready product site with product demo, waitlist, and docs CTA.",
    prompt: "Make a launch site for an AI startup.",
  },
  {
    name: "Dashboard",
    category: "Product",
    description: "Admin dashboard shell with metrics, charts, search, and settings.",
    prompt: "Make a dashboard with charts and team activity.",
  },
  {
    name: "Blog",
    category: "Content",
    description: "Fast editorial blog with categories, author pages, and newsletter CTA.",
    prompt: "Build a publication-style technical blog.",
  },
  {
    name: "Ecommerce",
    category: "Commerce",
    description: "Shopfront with product grid, PDP, cart drawer, and checkout-ready layout.",
    prompt: "Create a minimal ecommerce storefront.",
  },
  {
    name: "Agency Website",
    category: "Services",
    description: "High-trust agency site with services, proof, process, and lead capture.",
    prompt: "Build an agency website for a digital studio.",
  },
];

export const chatMessages = [
  {
    role: "assistant",
    content:
      "Planner agent scoped the site into hero, social proof, feature narrative, pricing, and FAQ sections.",
  },
  {
    role: "user",
    content: "Create a SaaS landing page for an AI support automation company.",
  },
  {
    role: "assistant",
    content:
      "UI generator produced a responsive app shell, Tailwind tokens, reusable cards, and a live preview.",
  },
];

export const files = [
  {
    path: "app/page.tsx",
    language: "tsx",
    content: `export default function Page() {
  return (
    <main className="min-h-screen bg-[#f8faf7] text-[#101512]">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-24">
        <nav className="flex items-center justify-between">
          <strong>Northstar</strong>
          <button>Start free</button>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_0.82fr]">
          <div>
            <h1>Resolve customer work before it becomes a queue.</h1>
            <p>AI agents, human review, and operational visibility in one clean support cockpit.</p>
          </div>
          <DashboardPreview />
        </div>
      </section>
    </main>
  );
}`,
  },
  {
    path: "components/hero.tsx",
    language: "tsx",
    content: `export function Hero() {
  return (
    <section className="grid min-h-[720px] place-items-center">
      <div className="max-w-4xl text-center">
        <h1 className="text-6xl font-semibold">Launch the site in minutes.</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Prompt, preview, edit, sync, and deploy from one focused workspace.
        </p>
      </div>
    </section>
  );
}`,
  },
  {
    path: "tailwind.config.ts",
    language: "ts",
    content: `export default {
  theme: {
    extend: {
      colors: {
        brand: "#0f5f59",
        ember: "#e9603a"
      }
    }
  }
}`,
  },
];

export const agentSteps = [
  { name: "Planner", status: "Complete", detail: "Mapped sections, data model, and dependencies." },
  { name: "UI generator", status: "Complete", detail: "Created responsive React structure." },
  { name: "Component generator", status: "Running", detail: "Extracting buttons, cards, and preview panes." },
  { name: "Styling agent", status: "Queued", detail: "Applying tokens, motion, and accessibility passes." },
  { name: "Debug agent", status: "Queued", detail: "Ready to inspect console and runtime errors." },
];
