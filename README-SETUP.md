# Forge - AI Website Builder SaaS

A production-ready AI website builder similar to Lovable, built with Next.js 15, TypeScript, OpenAI, and Vercel deployments.

## Features

### Core
- 🤖 AI-powered code generation using OpenAI GPT-4.1+
- 🎨 Live code editor with Monaco Editor
- 👁️ Real-time preview panel (mobile, tablet, desktop modes)
- 📝 Chat-based generation interface with streaming responses
- 🔄 Project versioning and history
- 🔀 GitHub integration (import, sync, push)
- 🚀 One-click Vercel deployment
- 🎯 Project templates (SaaS, Portfolio, Dashboard, etc.)

### UI/UX
- Dark/light theme support
- Command palette (Ctrl/Cmd+K)
- Responsive design
- Glass morphism styling
- Smooth animations (Framer Motion)
- Toast notifications (Sonner)

### Authentication
- Google OAuth
- GitHub OAuth
- Session persistence
- User profiles and teams

## Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS 4
- Framer Motion
- Monaco Editor
- Zustand (state management)

**Backend:**
- Next.js API Routes & Server Actions
- Node.js runtime

**Database:**
- PostgreSQL
- Prisma ORM

**AI & APIs:**
- OpenAI API (GPT-4 Turbo/GPT-5)
- GitHub API
- Vercel API
- UploadThing (file storage)

**Infrastructure:**
- Vercel (deployment)
- Upstash Redis (rate limiting)

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- Git (for GitHub integration)

### Installation

1. **Clone and install:**
```bash
git clone <your-repo>
cd project-2
npm install
```

2. **Setup environment variables:**
```bash
cp .env.example .env.local
# Fill in all required variables in .env.local
```

3. **Setup database:**
```bash
npm run db:push
npm run db:seed
```

4. **Generate Prisma client:**
```bash
npx prisma generate
```

5. **Start development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Configuration

### Required Variables

**Database:**
- `DATABASE_URL` - PostgreSQL connection string

**Authentication:**
- `AUTH_SECRET` - 32+ byte secret for session signing
- `NEXTAUTH_URL` - Your app URL (e.g., http://localhost:3000)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - GitHub OAuth credentials

**AI:**
- `OPENAI_API_KEY` - OpenAI API key
- `OPENAI_MODEL` - Model to use (e.g., gpt-4-turbo)

**Deployment:**
- `VERCEL_TOKEN` - Vercel API token
- `UPLOADTHING_TOKEN`, `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID` - File uploads

**Security:**
- `TOKEN_ENCRYPTION_KEY` - 32-byte key for encrypting sensitive tokens

**Optional:**
- `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` - Redis for rate limiting
- `E2B_API_KEY` - For serverless code execution (future)

## Project Structure

```
forge/
├── app/                      # Next.js App Router
│   ├── (app)/               # Authenticated routes
│   │   ├── dashboard/       # Project dashboard
│   │   ├── new/            # Create new project
│   │   ├── projects/       # Project editor
│   │   ├── templates/      # Template gallery
│   │   └── settings/       # User settings
│   ├── (auth)/             # Auth routes
│   │   └── signin/         # Sign in page
│   ├── api/                # API routes
│   │   ├── ai/            # AI generation endpoints
│   │   ├── projects/      # Project CRUD
│   │   ├── github/        # GitHub integration
│   │   ├── deployments/   # Vercel deployment
│   │   └── auth/          # NextAuth
│   └── share/             # Public share links
├── components/            # React components
│   ├── dashboard/        # Dashboard components
│   ├── builder/          # Editor components
│   ├── templates/        # Template components
│   ├── layout/           # Layout components
│   ├── ui/              # Base UI components
│   ├── auth/            # Auth components
│   └── providers/       # App providers
├── lib/                 # Utilities
│   ├── env.ts          # Environment variables
│   ├── prisma.ts       # Prisma singleton
│   ├── crypto.ts       # Token encryption
│   ├── rate-limit.ts   # Rate limiting
│   ├── utils.ts        # Helper functions
│   └── preview-data.ts # Mock data
├── services/           # Business logic
│   ├── project-service.ts  # Project operations
│   ├── github-service.ts   # GitHub API
│   ├── deploy-service.ts   # Vercel deployment
│   └── zip.ts             # File zip generation
├── ai/                 # AI logic
│   ├── generator.ts    # Code generation
│   └── prompts.ts      # System prompts
├── types/             # TypeScript types
├── hooks/            # Custom React hooks
├── store/           # Zustand state management
├── prisma/          # Database schema & migrations
│   ├── schema.prisma
│   └── seed.ts
├── public/          # Static assets
└── prisma/         # Prisma configuration
```

## Available Commands

```bash
# Development
npm run dev                 # Start dev server
npm run typecheck          # Check TypeScript errors
npm run lint               # Lint code

# Database
npm run db:push            # Sync schema to database
npm run db:migrate         # Create migration
npm run db:seed            # Populate seed data
npm run studio             # Open Prisma Studio

# Build & Deploy
npm run build              # Build for production
npm start                  # Start production server
```

## API Routes

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[projectId]` - Get project
- `PATCH /api/projects/[projectId]` - Update project
- `DELETE /api/projects/[projectId]` - Delete project
- `POST /api/projects/[projectId]/export` - Export as ZIP
- `POST /api/projects/[projectId]/share` - Create share link
- `GET /api/projects/[projectId]/versions` - Get version history

### AI Generation
- `POST /api/ai/generate` - One-shot generation
- `POST /api/ai/stream` - Streaming generation (SSE)

### GitHub
- `GET /api/github/repositories` - List user repositories
- `POST /api/github/import` - Import repository
- `POST /api/github/push` - Push to repository

### Deployments
- `POST /api/deployments/vercel` - Deploy to Vercel
- `GET /api/deployments/vercel/[deploymentId]` - Check deployment status

### Authentication
- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/callback/[provider]` - OAuth callback
- `GET /api/auth/signout` - Sign out

## Key Features Implementation

### AI Generation Workflow
1. User enters prompt
2. Request sent to `/api/ai/stream` with SSE
3. OpenAI generates code with streaming tokens
4. Agent steps shown in real-time
5. Files appear as they're generated
6. Project saved to database

### Live Editor
- Monaco Editor for code editing
- File tree sidebar
- Real-time preview updates
- Syntax highlighting
- Format on save

### Project Persistence
- Auto-save to database
- Version snapshots
- File history
- Draft recovery

### GitHub Integration
- OAuth authorization
- Repository creation
- Code push with commit messages
- Branch management

### Vercel Deployment
- One-click deployment
- Automatic preview URLs
- Environment variable management
- Deployment logs

## Performance Optimizations

- Route-based code splitting
- Image optimization with Next.js Image
- Lazy loading components
- Streaming responses for AI
- Database query optimization
- Rate limiting for API protection
- Redis caching for frequently accessed data

## Security

- OAuth 2.0 for authentication
- CSRF protection via NextAuth
- Encrypted token storage
- Server-side validation
- Rate limiting on API routes
- Environment variable isolation
- Secure session cookies

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Create Vercel project connected to repository
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
vercel deploy
```

### Manual Deployment

1. Build application:
   ```bash
   npm run build
   ```

2. Set environment variables on your host

3. Start server:
   ```bash
   npm start
   ```

## Database Migrations

```bash
# Create migration
npm run db:migrate -- --name add_feature_name

# Sync schema
npm run db:push

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

## Troubleshooting

### "rate limit exceeded"
- Add `UPSTASH_REDIS_REST_URL` for distributed rate limiting
- Or adjust rate limit values in API routes

### "OpenAI API Error"
- Verify `OPENAI_API_KEY` is valid
- Check API key has sufficient quota
- Verify `OPENAI_MODEL` exists

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL server is running
- Check network connectivity

### GitHub Integration Not Working
- Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
- Check GitHub App is authorized
- Ensure user has proper repository permissions

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open GitHub Issue
- Check documentation
- Review example projects

## Roadmap

- [ ] Real OpenAI integration with streaming
- [ ] Team collaboration features
- [ ] Multi-user editing (WebSocket)
- [ ] Custom domain support
- [ ] Analytics dashboard
- [ ] Build logs and debugging
- [ ] Component library marketplace
- [ ] Custom CSS/Tailwind config
- [ ] API for external integrations
- [ ] CLI for local development

---

Built with ❤️ as a production-grade AI website builder.
