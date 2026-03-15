import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const templates = [
  {
    name: "SaaS Landing Page",
    slug: "saas-landing-page",
    category: "Marketing",
    description: "Premium landing page with hero, social proof, pricing, and FAQ.",
    prompt: "Create a SaaS landing page for an AI operations platform.",
  },
  {
    name: "Portfolio",
    slug: "portfolio",
    category: "Creator",
    description: "Case-study-led personal site with project pages and contact flow.",
    prompt: "Build a modern portfolio for a product designer.",
  },
  {
    name: "Dashboard",
    slug: "dashboard",
    category: "Product",
    description: "Admin dashboard shell with metrics, charts, search, and settings.",
    prompt: "Make a dashboard with charts and team activity.",
  },
];

async function main() {
  for (const template of templates) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      create: {
        name: template.name,
        slug: template.slug,
        category: template.category,
        description: template.description,
        prompt: template.prompt,
        files: [],
        featured: true,
      },
      update: {
        category: template.category,
        description: template.description,
        prompt: template.prompt,
        files: [],
        featured: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
