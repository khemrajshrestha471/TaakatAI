# TaakatAI

AI-powered online coaching & physique tracking SaaS for coaches and gyms (English + Nepali).

## Stack

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 + shadcn/ui · MongoDB/Mongoose ·
next-intl (EN/NE) · Zod · TanStack Query · Vitest. Later phases add Auth.js, Cloudinary, Claude,
Pusher, Daily.co, Resend, Stripe/PayPal/Khalti/eSewa, Inngest, Upstash and Sentry.

## Local setup

Requirements: Node.js ≥ 20.9, pnpm 10.

```bash
pnpm install
cp .env.example .env.local   # then fill in values
pnpm env:check               # shows missing keys and which features are disabled
pnpm dev                     # http://localhost:3000
```

Only `NEXT_PUBLIC_APP_URL`, `ENCRYPTION_KEY`, `MONGODB_URI` and `AUTH_SECRET` are required.
Every other integration is disabled gracefully until its keys are set. See `.env.example` for where
to get each key.

## Scripts

| Command          | What it does                                |
| ---------------- | ------------------------------------------- |
| `pnpm dev`       | Dev server                                  |
| `pnpm build`     | Production build                            |
| `pnpm lint`      | ESLint + EN/NE translation key parity check |
| `pnpm typecheck` | Route type generation + `tsc --noEmit`      |
| `pnpm test`      | Unit tests (Vitest)                         |
| `pnpm env:check` | Validate environment variables              |
| `pnpm format`    | Prettier                                    |

## Routes

- Public (locale-prefixed): `/en`, `/ne`, `/en/login`, `/en/register`, …
- Portals (language from saved preference): `/app` (client), `/coach`, `/guardian`, `/super-admin`

> Deployment, OAuth, webhook and cron setup docs are added as those phases are built.
