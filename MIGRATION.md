# Migration Guide: From Mock to Production

This guide shows exactly how to switch Forge from mock data to real backends.

## 1. Database Integration (Project Service)

### Current (Mock)
```typescript
// services/project-service.ts
const store = globalThis as unknown as {
  forgeProjects?: BuilderProject[];
};
export const projects = store.forgeProjects ?? initialProjects;

export function listProjects() {
  return projects;
}
```

### Production (Prisma)
```typescript
// services/project-service.ts
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function listProjects() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  return prisma.project.findMany({
    where: { ownerId: session.user.id },
    include: { files: true },
    orderBy: { lastEditedAt: "desc" },
  });
}

export async function getProject(projectId: string, userId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
    include: { files: true, versions: { orderBy: { createdAt: "desc" } } },
  });
}

export async function createProject(userId: string, input: {
  name: string;
  description?: string;
  prompt?: string;
}) {
  return prisma.project.create({
    data: {
      ownerId: userId,
      name: input.name,
      slug: generateSlug(input.name),
      description: input.description,
      prompt: input.prompt,
      status: "DRAFT",
    },
    include: { files: true },
  });
}
```

## 2. Project Files Persistence

### Current (In Memory)
```typescript
// Files stored in BuilderProject.files array only
const project = {
  // ...
  files: [/* array of BuilderFile */]
};
```

### Production (Database)
```typescript
// services/project-service.ts
export async function saveProjectFiles(
  projectId: string,
  userId: string,
  files: BuilderFile[]
) {
  const project = await getProject(projectId, userId);
  if (!project) throw new Error("Project not found");

  // Delete existing
  await prisma.projectFile.deleteMany({ where: { projectId } });

  // Create new
  const created = await prisma.projectFile.createMany({
    data: files.map(f => ({
      projectId,
      path: f.path,
      language: f.language,
      content: f.content,
    })),
  });

  // Update modified time
  await prisma.project.update({
    where: { id: projectId },
    data: { lastEditedAt: new Date() },
  });

  return created;
}
```

## 3. AI Generation Integration

### Current (Deterministic Mock)
```typescript
// app/api/ai/stream/route.ts
async function fallbackStream(prompt: string) {
  const generated = generateDeterministicSite(prompt);
  // Returns fake chunks with pre-recorded responses
}
```

### Production (Real OpenAI)
```typescript
// app/api/ai/stream/route.ts
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const body = await request.json();
  const prompt = body.prompt?.trim();
  
  if (!env.OPENAI_API_KEY) {
    return new Response(await fallbackStream(prompt), {
      headers: { "Content-Type": "text/event-stream" },
    });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      messages: [
        { role: "system", content: AI_BUILDER_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error("OpenAI API failed");
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
    },
  });
}
```

## 4. GitHub Integration

### Current (Mock)
```typescript
// services/github-service.ts
export async function getGitHubUser(token: string) {
  // Returns mock user object
}
```

### Production (Real API)
```typescript
// services/github-service.ts
import { decryptSecret, encryptSecret } from "@/lib/crypto";

export async function saveGitHubToken(
  userId: string,
  accessToken: string,
  scopes: string[]
) {
  const encrypted = encryptSecret(accessToken);
  
  return prisma.gitHubToken.upsert({
    where: { userId },
    create: {
      userId,
      encryptedAccessToken: encrypted,
      scopes,
    },
    update: {
      encryptedAccessToken: encrypted,
      scopes,
      updatedAt: new Date(),
    },
  });
}

export async function getGitHubUser(token: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!response.ok) throw new Error("GitHub API failed");
  return response.json();
}

export async function pushFilesToGitHub(
  token: string,
  owner: string,
  repo: string,
  files: BuilderFile[],
  message: string
) {
  // Push each file using GitHub REST API
  const encryptedToken = encryptSecret(token);
  const decrypted = decryptSecret(encryptedToken);
  
  const results = [];
  for (const file of files) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${decrypted}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          content: Buffer.from(file.content).toString("base64"),
          branch: "main",
        }),
      }
    );
    results.push(response.ok);
  }
  
  return results;
}
```

## 5. Vercel Deployment

### Current (Mock)
```typescript
// services/deploy-service.ts
export async function createVercelDeployment(input) {
  return {
    provider: "vercel",
    status: "QUEUED",
    url: "https://example.vercel.app",
  };
}
```

### Production (Real Vercel API)
```typescript
// services/deploy-service.ts
export async function createVercelDeployment(input: {
  name: string;
  files: BuilderFile[];
}) {
  if (!env.VERCEL_TOKEN) {
    throw new Error("VERCEL_TOKEN not configured");
  }

  const files = input.files.map(f => ({
    file: f.path,
    data: f.content,
  }));

  const response = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input.name,
      files,
      target: "production",
    }),
  });

  if (!response.ok) {
    throw new Error(`Vercel deployment failed: ${response.statusText}`);
  }

  const deployment = await response.json();

  // Save to database
  await prisma.deployment.create({
    data: {
      projectId: input.projectId,
      provider: "vercel",
      status: "BUILDING",
      url: deployment.url,
      inspectUrl: `https://vercel.com/dashboard/project/${input.name}`,
    },
  });

  return deployment;
}

export async function getDeploymentStatus(deploymentId: string) {
  const response = await fetch(
    `https://api.vercel.com/v13/deployments/${deploymentId}`,
    {
      headers: { Authorization: `Bearer ${env.VERCEL_TOKEN}` },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch deployment");
  
  return response.json();
}
```

## 6. Update API Routes

### Before (Uses Mock Service)
```typescript
// app/api/projects/route.ts
import { listProjects, createProject } from "@/services/project-service";

export function GET() {
  return NextResponse.json({ projects: listProjects() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const project = createProject(body.prompt);
  return NextResponse.json({ project }, { status: 201 });
}
```

### After (Uses Prisma)
```typescript
// app/api/projects/route.ts
import { auth } from "@/auth";
import { listProjects, createProject } from "@/services/project-service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await listProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = await rateLimit(`create:${session.user.id}`, 20);
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  const body = await request.json();
  const project = await createProject(session.user.id, body);
  return NextResponse.json({ project }, { status: 201 });
}
```

## 7. Add Real Seed Data

```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const user = await prisma.user.create({
    data: {
      email: "demo@forge.dev",
      name: "Demo User",
      username: "demo",
      emailVerified: new Date(),
    },
  });

  // Create demo projects
  const project = await prisma.project.create({
    data: {
      ownerId: user.id,
      name: "SaaS Landing Page",
      slug: "saas-landing",
      description: "AI-generated SaaS landing page",
      status: "READY",
      files: {
        createMany: {
          data: [
            {
              path: "app/page.tsx",
              language: "tsx",
              content: `export default function Page() {
  return <main>Hello World</main>
}`,
            },
          ],
        },
      },
    },
  });

  // Create templates
  const templates = [
    {
      name: "SaaS Landing Page",
      slug: "saas-landing",
      category: "Marketing",
      description: "Premium SaaS landing page",
      prompt: "Create a SaaS landing page",
      files: {},
      featured: true,
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      create: template,
      update: template,
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 8. Environment Variables

Add to `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/forge"

# AI
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4-turbo"

# GitHub
GITHUB_TOKEN_ENCRYPTION_KEY="your-32-byte-key"

# Vercel
VERCEL_TOKEN="your-vercel-token"
```

## 9. Run the Migrations

```bash
# Sync Prisma schema
npm run db:push

# Create your first migration
npm run db:migrate -- --name initial

# Seed with demo data
npm run db:seed

# Start dev server
npm run dev
```

## Verification Checklist

After migration, verify:

- [ ] `npm run typecheck` - No TypeScript errors
- [ ] `npm run build` - Builds successfully
- [ ] Projects list loads from database
- [ ] Can create new project
- [ ] Files save to database
- [ ] AI generation works (with OpenAI key)
- [ ] GitHub integration connects
- [ ] Vercel deployment works
- [ ] Rate limiting functions
- [ ] Sessions persist

## Performance Optimization

Once in production, add:

```typescript
// Add caching for frequently accessed projects
export async function listProjectsCached(userId: string) {
  const cacheKey = `projects:${userId}`;
  
  // Check Redis
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Fetch from DB
  const projects = await listProjects(userId);
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(projects));
  
  return projects;
}
```

## Troubleshooting

**"Database connection error"**
- Check `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Run `npx prisma db push` to create tables

**"Rate limit exceeded"**
- Add `UPSTASH_REDIS_REST_URL` for distributed rate limiting
- Or increase limits in `lib/rate-limit.ts`

**"OpenAI API error"**
- Verify `OPENAI_API_KEY` is valid
- Check API quotas
- Verify model name in `OPENAI_MODEL`

**"Files not saving"**
- Check `saveProjectFiles` is being called after edits
- Verify database connection
- Check Prisma migrations ran

---

This migration preserves all UI/UX while switching to real data persistence and APIs. Start with #1-3 for core functionality, then add GitHub and Vercel integrations as needed.
