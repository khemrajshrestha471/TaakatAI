@AGENTS.md

# TaakatAI — project notes

- Full product spec + build phases: `prompt.md` (read the relevant section before each phase).
- Next.js 16: `src/proxy.ts` (not middleware.ts), async request APIs, ESLint CLI.
- Public pages live under `src/app/[locale]/` (`/en`, `/ne`); portals under `src/app/(portals)/`
  (`/app`, `/coach`, `/guardian`, `/super-admin`) are unprefixed and use the saved locale.
- No hardcoded UI text: add every string to BOTH `src/i18n/messages/en.json` and `ne.json`
  (`pnpm i18n:check` enforces parity; Nepali in Devanagari).
- Env: import from `@/lib/env` (server only). Optional integrations must check `getFeatures()`
  and degrade gracefully. Never hardcode secrets.
- After each phase: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`.
