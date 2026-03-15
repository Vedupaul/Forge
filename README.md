# Forge AI Website Builder

Forge is a production-ready starter for an AI website builder SaaS inspired by Lovable, v0, Linear, and Vercel. It includes a premium dark UI, AI generation workflow, project dashboard, live editor, project history, templates, Auth.js OAuth, Prisma schema, OpenAI streaming, GitHub integration routes, ZIP export, share links, Vercel deployment hooks, and storage/sandbox extension points.

## Stack

- Next.js 15 App Router, TypeScript, Tailwind CSS v4
- Auth.js / NextAuth with Google and GitHub OAuth
- PostgreSQL with Prisma ORM
- OpenAI Responses API streaming, default model `gpt-5.5`
- Monaco editor integration
- GitHub repository create/list/push routes through the GitHub REST API
- Vercel deployment route through the Vercel REST API
- UploadThing-ready storage route and E2B/WebContainer-ready sandbox hook

## Fast Visual Preview

If npm install is slow on this Windows/OneDrive workspace, open the static preview directly:

```text
preview.html
```

That file mirrors the premium frontend direction without requiring dependencies.

## Setup

1. Install dependencies.

```bash
npm install
```

2. Create `.env.local`.

```bash
cp .env.example .env.local
```

3. Fill the required values.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/forge_ai_builder?schema=public"
AUTH_SECRET="replace-with-a-32-byte-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-5.5"
VERCEL_TOKEN=""
GITHUB_ACCESS_TOKEN=""
```

4. Prepare the database.

```bash
npm run db:push
npm run db:seed
```

5. Start development.

```bash
npm run dev
```

Open `http://localhost:3000`.

## OAuth Setup

Google OAuth callback:

```text
http://localhost:3000/api/auth/callback/google
```

GitHub OAuth callback:

```text
http://localhost:3000/api/auth/callback/github
```

For GitHub repository operations during local development, either finish OAuth token persistence or set `GITHUB_ACCESS_TOKEN` with `repo` scope.

## Main Routes

- `/` - premium landing page
- `/signin` - Google/GitHub auth
- `/dashboard` - projects, templates, usage, history
- `/new` - prompt-based project creation
- `/templates` - starter templates
- `/projects/northstar` - AI builder workspace
- `/settings` - integrations and environment configuration
- `/api/ai/stream` - SSE generation endpoint
- `/api/projects` - list/create projects
- `/api/projects/:projectId/export` - ZIP export
- `/api/github/*` - repository list/create/import/push
- `/api/deployments/vercel` - deployment hook
- `/api/sandbox/run` - E2B/WebContainer execution hook

## AI Streaming

`/api/ai/stream` uses OpenAI's Responses API when `OPENAI_API_KEY` is present. Without a key, it streams a deterministic local generation so the UI remains testable.

The route emits server-sent events and the builder parses both local events and OpenAI semantic streaming events such as `response.output_text.delta`.

## Database

The Prisma schema includes:

- Users, Accounts, Sessions, Authenticators
- Projects, ProjectFiles, ProjectVersions
- Chats, ChatMessages
- Deployments
- GitHubTokens, GitHubRepository
- Templates
- EnvironmentVariables
- UsageLimits
- Teams, TeamMembers
- ShareLinks

## Deployment

The project is Vercel-ready:

```bash
npm run build
```

Add the same environment variables to Vercel, provision PostgreSQL, run Prisma migrations, and connect OAuth callback URLs to the deployed domain.

## Notes

The app includes real provider-shaped routes, but credentials are required for OAuth, OpenAI, GitHub, Vercel, UploadThing, and E2B to perform live external operations. Until then, the UI and AI fallback mode remain usable for local product review.
