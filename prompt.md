# Build Prompt — "TaakatAI" (AI-Powered Online Coaching & Physique Tracking SaaS)

> Paste this whole file into Claude in VS Code (or save it as `CLAUDE.md` in the repo root so it is always in context). Work through it phase by phase. Do not skip phases. After each phase, run `npm run build`, `npm run lint` and `npm run typecheck`, fix all errors, and summarize what was done before starting the next phase.

---

## 0. Role & Working Rules for the AI Agent

You are a senior full-stack engineer and product designer. You are building a production-ready SaaS web app from scratch.

Rules:
1. **Ask before guessing** on anything that affects architecture, money, or data privacy. If an env variable / API key is missing, stop and ask me for it — never hardcode secrets or invent fake keys.
2. Use **TypeScript strict mode** everywhere. No `any` unless justified in a comment.
3. Every server input is validated with **Zod**. Every server action / route handler checks **auth + role + ownership**.
4. Build **mobile-first**. Most clients will use this on a phone at the gym. Every screen must work at 360px width.
5. Keep components small, typed, and reusable. Co-locate feature code by domain (see folder structure).
6. Write seed data so every screen can be demoed without manual data entry.
7. Commit-sized steps: after each phase give me a short summary + list of files changed + what I need to test manually.
8. If a requirement below conflicts with another, flag it and ask.

---

## 1. Product Overview

**What it is:** A SaaS platform that lets fitness coaches run their **online personal training** business — and lets their clients follow programs, log workouts and diet, upload progress photos and exercise-form videos, do weekly check-ins, and get **AI-assisted personal feedback** — all in one place.

**Replaces:** the current workflow of coaching via Instagram/Facebook DMs, WhatsApp/Viber, Google Sheets and PDFs.

**Business model:** This is a **multi-coach SaaS product**. I (the developer) own and operate the platform and sell subscriptions to **independent coaches** and **gym centers**. Each buyer gets their own isolated workspace, branding, clients and billing. I manage everything from the Super Admin portal.

**Primary market:** Nepal first (NPR currency, eSewa/Khalti payments), with **international payments (Stripe + PayPal)** from launch. **English and Nepali UI are both required at launch.**

### 1.1 Core coaching services the platform must support (from the coach's offer)
| # | Service | Platform feature |
|---|---------|------------------|
| 1 | Personalized training program (based on goals & fitness level) | Program builder + onboarding assessment + AI program draft |
| 2 | Daily support & availability ("ask me anything anytime") | Real-time 1:1 chat (text, images, voice notes, video) + AI assistant for instant answers |
| 3 | Exercise form monitoring (client sends set videos, coach corrects technique) | Form-check video upload → AI pre-analysis → coach review with timestamped comments |
| 4 | Weekly physique & weight updates (every Saturday) | Scheduled weekly check-in form (photos front/side/back, weight, measurements, adherence, mood) with reminders |
| 5 | Video call when needed (discuss/correct form via screen sharing) | Book & join in-app video calls with screen sharing |
| 6 | Personalized diet plan (lifestyle, goals, requirements) | Diet plan builder with macros, Nepali food database, AI diet draft |
| 7 | Regular diet & training adjustments based on progress | Plan versioning + AI adjustment suggestions coach can approve |
| 8 | Complete progress monitoring throughout coaching period | Dashboards: weight trend, measurements, photo timeline & comparison, strength PRs, adherence score |

### 1.2 Brand direction
- Name: **TaakatAI** (placeholder — "Taakat" = strength). Keep the name in one config constant so it can be changed.
- Tagline: "Your Goals. My Guidance. Real Results."
- Visual style: dark-first, bold athletic look — near-black background (`#0A0A0A`), primary red (`#E11D2A`), white text, subtle grit textures only in marketing pages. Light mode must also be supported. App screens should be clean and calm, not noisy.
- Fonts: a bold condensed display font for headings (e.g. "Bebas Neue" or "Anton"), "Inter" for UI text. Load via `next/font`.

---

## 2. Tech Stack (use exactly this unless I approve a change)

| Area | Choice |
|------|--------|
| Framework | **Next.js 15+ (App Router)**, React Server Components, Server Actions, Route Handlers |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS v4** + **shadcn/ui** (Radix) + `lucide-react` icons + `framer-motion` for small transitions |
| Database | **MongoDB Atlas** + **Mongoose** (typed schemas, indexes, lean queries) |
| Auth | **Auth.js (NextAuth v5)** — email+password (bcrypt), **Google OAuth**, **Facebook OAuth**, email verification link, password reset; JWT sessions carrying `role` and `workspaceId` |
| Validation | **Zod** (shared schemas client + server) |
| Forms | `react-hook-form` + `@hookform/resolvers/zod` |
| Client data | **TanStack Query** for client-side fetching/mutations where RSC isn't enough |
| Charts | **Recharts** |
| Media uploads | **Cloudinary** (signed direct uploads from the browser, image + video, auto transcoding, thumbnails, frame extraction). Private/authenticated delivery for body photos |
| AI | **Anthropic Claude API** (`@anthropic-ai/sdk`), vision for photo/video-frame analysis. Model name read from env `ANTHROPIC_MODEL` |
| Real-time chat & notifications | **Pusher Channels** (or Ably) — works on Vercel serverless |
| Video calls | **Daily.co** (prebuilt embed, supports screen share) — alternative: LiveKit or auto-generated Jitsi links |
| Email | **Resend** + **React Email** templates |
| Payments | International: **Stripe** + **PayPal** · National (Nepal): **Khalti** + **eSewa** · plus manual/cash — all behind one `PaymentProvider` interface |
| Background jobs / cron | **Vercel Cron** + **Inngest** (reminders, AI jobs, weekly summaries) |
| Web push | `web-push` with VAPID keys + PWA (installable, offline shell) |
| i18n | **next-intl** — English (`en`, default) + Nepali (`ne`), **both complete at launch** (see section 9.1) |
| Rate limiting | **Upstash Redis** + `@upstash/ratelimit` |
| Error monitoring | **Sentry** |
| Testing | **Vitest** + React Testing Library (unit), **Playwright** (e2e for critical flows) |
| Tooling | ESLint, Prettier, Husky + lint-staged, `pnpm` |
| Hosting | **Vercel** (app) + MongoDB Atlas + Cloudinary |

---

## 3. User Roles & Multi-Tenancy

The app is a **multi-tenant SaaS** sold by the platform owner (me) to coaches and gyms. Each buyer is a **tenant (Workspace)**. Clients belong to one workspace.

**Workspace types** (chosen at signup, stored as `Workspace.type`):
- `INDEPENDENT_COACH` — a single coach running online coaching; can add a few assistant coaches.
- `GYM_CENTER` — a gym/fitness center with many coaches/trainers, optional multiple branches (`Branch` sub-entity), front-desk staff, and members assigned to trainers. Gym owner sees all trainers' clients, performance and revenue.

| Role | Portal | Can do |
|------|--------|--------|
| `SUPER_ADMIN` (me, platform owner) | `/super-admin` | Manage all workspaces, SaaS plans & pricing, platform revenue, AI usage/cost, feature flags, support impersonation (logged) |
| `WORKSPACE_OWNER` (coach owner or gym owner) | `/coach` (admin portal) | Everything in their workspace: billing, branding, packages, payment gateways, staff, all clients |
| `COACH` (trainer) | `/coach` | Manage clients assigned to them |
| `STAFF` (gym front desk, gym only) | `/coach` (limited) | Add members, record manual payments, view schedules — no access to health data or photos |
| `CLIENT` | `/app` (user portal) | Their own plans, logs, uploads, check-ins, chat, calls |
| `GUARDIAN` (for clients under 18) | `/guardian` | View linked minor's plans, progress summaries and coach chat history; approve consents; manage payments |

Rules:
- Every tenant-scoped document has `workspaceId`. **All queries must filter by `workspaceId` from the session**, never from the request body. Build a helper `requireSession({ roles })` and a scoped repository layer that enforces this.
- Clients can only read/write their own data. Coaches only clients assigned to them (owner sees all in workspace).
- Workspace branding: logo, brand color, custom welcome message, optional custom subdomain (`coachname.taakat.app`) — subdomain support can be phase 2.

---

## 4. Features — Detailed Requirements

### 4.1 Public / Marketing site (`/`)
- Landing page: hero, "What you'll get" (the 8 services above with icons), how it works (3 steps), transformation gallery (coach-approved before/after with consent), pricing, testimonials, FAQ, CTA "Start your transformation".
- Coach public profile page: `/c/[slug]` — bio, certifications, packages & prices, testimonials, "Apply for coaching" button.
- SEO: metadata, Open Graph images, sitemap, robots.txt.

### 4.2 Auth & Onboarding
- **Sign-in methods:** (1) **Continue with Google**, (2) **Continue with Facebook**, (3) **Create account with email + password**.
- **Email verification (credentials signup):**
  - On registration, create the user with `emailVerified: null`, generate a secure random token (store only its SHA-256 hash, expires in 24h, single use), and send a **verification link** to the registered email via Resend (`/verify-email?token=...`), bilingual EN/NE email template.
  - Unverified users can log in but only see a "Verify your email" screen with **Resend link** button (rate-limited: max 3 per hour).
  - Clicking the link marks the email verified, invalidates the token, and redirects to onboarding.
  - Google/Facebook users are treated as verified if the provider returns a verified email. If Facebook returns **no email** (possible), ask the user to enter one and send the verification link.
- **Account linking:** if a user signs in with Google/Facebook using an email that already exists, link accounts only after the email is verified (prevent account takeover). Users can connect/disconnect providers in settings (must keep at least one login method).
- Password rules: min 8 chars, strength meter, breached-password check optional; forgot/reset password via emailed link (1h expiry).
- Show social buttons and the email form on the same page; remember the selected language on the auth pages.
- **Coach / gym signup** → verify email → choose workspace type (Independent Coach / Gym Center) → workspace details (name, slug, country, currency, timezone) → choose SaaS plan (14-day free trial, no card required) → setup wizard (branding, first package, payment gateways, invite staff).
- Client joins via: coach invite link / public "Apply" form / coach manually adds them.
- **Client onboarding wizard** (multi-step, progress bar, saves each step):
  1. Personal: name, DOB (age), gender, height, current weight, target weight, phone, country, preferred language, units (kg/lb, cm/in).
  2. Goal: fat loss / muscle gain / recomposition / strength / contest prep / general fitness; target date.
  3. Experience: training level, years training, current split, gym vs home, available equipment (checklist), days per week, session length.
  4. Health (PAR-Q style): injuries, medical conditions, medications, surgeries, pain areas. **If any red-flag answer → show "please consult a doctor" notice and flag to coach.**
  5. Lifestyle: occupation/activity level, sleep hours, stress level, work schedule, meal timing, cooking ability, budget.
  6. Diet: veg / non-veg / eggetarian / vegan, religious restrictions (e.g. no beef/pork), allergies, foods disliked, supplements used, alcohol, water intake.
  7. Baseline photos (front/side/back) + measurements (chest, waist, hips, arms, thighs, calves, neck) — optional but encouraged.
  8. Consent: terms, privacy, **explicit consent for storing body photos**, consent for AI analysis, optional consent for using photos in marketing.
- **Clients under 18 are allowed**, with the guardian flow in section 4.5.

### 4.3 Client Portal (`/app`) — mobile-first
Bottom nav on mobile (Home, Train, Diet, Progress, Chat), sidebar on desktop.

- **Home / Today:** today's workout, today's meals & macro targets, check-in due banner (Saturdays), unread coach messages, streak, quick actions (log weight, upload form video, ask a question).
- **Training:**
  - Current program: weeks → days → exercises (sets, reps, RPE/RIR, rest, tempo, notes, demo video/GIF link).
  - **Workout logger:** log weight × reps per set, mark completed, rest timer, previous-session numbers shown inline, auto PR detection, notes per exercise, "record form video" button per exercise.
  - Works well one-handed; large tap targets; offline-tolerant (queue logs and sync when online).
  - Exercise library with search & filter by muscle group/equipment.
- **Form Check:**
  - Upload or record a set video (max length configurable, default 60s, max 200MB) linked to an exercise + set.
  - Show upload progress, allow retry, compress/transcode via Cloudinary.
  - Status: Uploaded → AI pre-check ready → Coach reviewed.
  - View coach feedback: text + **timestamped comments** on the video timeline + optional annotated screenshot.
- **Diet:**
  - Current diet plan: daily calories & macros, meals with foods & quantities, alternatives/swaps, eat-out tips.
  - Meal logging: tick planned meals or log custom food (search food DB), meal photo upload (optional AI macro estimate, clearly labeled as estimate).
  - Water tracker, supplement checklist.
  - Food database seeded with common **Nepali foods** (dal bhat, roti, momo, chiura, sel roti, dhido, aloo tama, chicken curry, paneer, eggs, curd, etc.) with macros per serving + international foods. Coach can add custom foods.
- **Weekly Check-in (default Saturday, configurable per client):**
  - Form: weight (or 7-day average from daily weigh-ins), measurements, photos front/side/back (guided with pose overlay & consistent lighting tips), training adherence %, diet adherence %, sleep, energy, stress, hunger, digestion, cycle tracking (optional, female clients), wins, struggles, questions.
  - After submit: AI summary generated for coach, client sees "Coach will review within X hours".
  - Reminders: Friday evening + Saturday morning + overdue reminder (push + email).
- **Progress:**
  - Weight chart (daily + 7-day moving average), measurements charts, body-fat % (if tracked).
  - **Photo timeline & side-by-side compare** (pick any two dates, slider overlay).
  - Strength progress per exercise (estimated 1RM trend), PR list, volume per muscle group.
  - Adherence score history, check-in history.
- **Chat:** 1:1 with coach — text, images, videos, voice notes, read receipts, typing indicator, reply-to message. **AI Assistant tab** for instant answers (uses client's plan context; escalates to coach when unsure or when the question is medical/injury related).
- **Video Calls:** see upcoming calls, request a call (coach approves & picks slot), join in browser with screen share.
- **Subscription:** current package, renewal date, pay/renew (Khalti/eSewa for NPR, Stripe/PayPal for international), invoices.
- **Profile & Settings:** units, language (EN/NE), notifications, theme, data export (download my data as JSON/ZIP), delete account.

### 4.4 Coach Portal (`/coach`) — desktop-first but responsive
- **Dashboard:** active clients, check-ins pending review, form videos pending review, unread messages, clients at risk (missed check-ins, low adherence, no logins in X days), revenue this month, upcoming calls. Everything sorted by **priority queue** so the coach knows what to do next.
- **Client list:** search, filter by status (active, paused, expired, lead), goal, assigned coach, tags; bulk actions (message, assign program).
- **Client profile (360° view):** onboarding answers, health flags, current program & diet, all logs, progress charts, photo compare, check-in history, form checks, notes (private coach notes), files, payment status, timeline of all events.
- **Program Builder:**
  - Create templates (reusable) and client-specific programs; drag-and-drop exercises; supersets/circuits; progression rules; deload weeks; copy week; version history.
  - **"Generate with AI"** → produces a draft from client profile; coach edits & publishes. AI never publishes directly to client.
- **Diet Plan Builder:** calorie/macro calculator (Mifflin-St Jeor + activity factor, editable), meal templates, food DB search, auto-totals, swaps, **"Generate with AI"** draft (respects diet type, allergies, budget, Nepali food preference). Coach approves before publish.
- **Check-in Review:** side-by-side photos vs last week & vs start, weight trend, adherence, client answers, **AI summary + suggested adjustments** (e.g. "weight flat 2 weeks + adherence 90% → suggest −150 kcal"), coach writes/edits reply (can dictate voice note or record short video), one-click apply suggested adjustment → creates new plan version.
- **Form Check Review:** video player with frame stepping (0.25× – 2× speed), add timestamped comments, draw on a paused frame (canvas annotation), see AI pre-analysis, mark reviewed.
- **Calendar & Calls:** availability settings, approve call requests, create Daily.co room automatically, reminders.
- **Packages & Payments:** create coaching packages (e.g. 1 month / 3 months / 6 months, price in NPR/USD, features included), coupons, manual payment marking (cash/bank transfer), payment history, auto-expire access when package ends (with grace period).
- **Broadcasts:** message all/segment of clients (e.g. "New year challenge").
- **Workspace settings:** branding, team members & roles, check-in day & questions (customizable form builder), AI settings (tone, on/off per feature, custom instructions like "always recommend Nepali foods"), notification preferences.
- **Analytics:** client retention, average adherence, average weight change by goal, revenue, AI usage.

### 4.5 Minor Clients (under 18) & Guardian Flow
Clients under 18 may sign up. Age is calculated from date of birth at onboarding and re-checked on every birthday (auto-upgrade to adult account at 18, guardian access ends after notifying both).
- **Guardian consent required before coaching starts:** the minor enters a parent/guardian's name, email and phone → guardian receives an email link → guardian creates/verifies a `GUARDIAN` account and approves consents (coaching, health data storage, photo uploads, AI analysis). Until approved, the minor's account stays in "pending guardian consent" and the coach cannot assign plans.
- **Guardian portal (`/guardian`):** view the minor's program, diet plan, progress summaries, check-in status, and the **full coach ↔ minor chat history** (read-only); manage payments and renewals; revoke consent (pauses the account).
- **Safeguards for minors (enforce in code, not just UI):**
  - No private coach–minor video calls without the guardian being notified and given the join link.
  - Progress photos for minors are **optional**, never used in marketing/transformation galleries, and never sent to AI for body analysis. Form-check videos are allowed.
  - AI diet/program generation uses youth-safe rules: no calorie-deficit targets below a conservative floor, no weight-cut or contest-prep plans, focus on performance, technique, habits and balanced nutrition; any weight-loss goal for a minor is flagged to the coach.
  - Mark minors clearly (badge) everywhere in the coach portal.
  - Workspace owners can choose a minimum age (e.g. 13+) in settings; the platform hard minimum is configurable by super admin.

### 4.6 Super Admin Portal (`/super-admin`)
- Workspaces list (filter by type: Independent Coach / Gym Center), plan, status, usage (clients, coaches, branches, storage GB, AI tokens), suspend/reactivate.
- SaaS plan management, editable from UI (name, price in NPR and USD, monthly/yearly, limits on clients, coaches, branches, storage, AI credits, feature flags). Suggested defaults:
  - **Solo Coach** — 1 coach, up to 30 clients
  - **Pro Coach** — up to 5 coaches, 150 clients, custom branding
  - **Gym Starter** — up to 10 trainers, 500 members, 1 branch
  - **Gym Business** — unlimited trainers, multiple branches, custom subdomain, priority support
- Coupons & discounts for SaaS plans, manual plan override, extend trials.
- Platform revenue, MRR, churn.
- AI cost monitoring per workspace, global AI kill-switch.
- Audit logs, support impersonation (with banner + audit log entry).
- Content moderation queue for reported media.

---

## 5. AI Features (Anthropic Claude)

Create `src/lib/ai/` with one typed function per feature, a shared client, prompt templates in separate files, Zod-validated **structured JSON outputs**, token usage logging (`AiUsage` collection), per-workspace credit limits, and graceful fallback when AI fails.

| Feature | Input | Output |
|---------|-------|--------|
| **Check-in analyzer** | This week + previous check-ins, weight trend, adherence, answers, photos (vision) | Summary for coach, wins, concerns, suggested training/diet adjustments with reasoning, draft reply to client |
| **Form-check pre-analysis** | 6–10 frames extracted from the video via Cloudinary frame URLs (`so_` offsets) + exercise name | Observed issues (e.g. knee cave, lumbar rounding, ROM), cues, confidence level, "needs coach review" always true |
| **Program generator** | Client profile, equipment, days/week, experience, injuries | Structured program JSON matching the Program schema |
| **Diet plan generator** | Profile, calories/macros, diet type, allergies, budget, cuisine preference | Structured diet plan JSON with Nepali-friendly meals & swaps |
| **Meal photo estimator** | Meal photo | Estimated foods + macros, clearly labeled "estimate" |
| **Client AI assistant (chat)** | Client question + plan context + recent logs | Answer in coach's configured tone; escalate flag when medical/injury/unsure |
| **Weekly progress report** | Week's data | Friendly motivational summary for the client |
| **Coach reply helper** | Coach bullet notes | Polished reply in coach's voice |

**AI safety rules (implement in system prompts + code):**
- AI output is **draft-only** for programs, diets and adjustments — a coach must approve before a client sees it.
- Never diagnose injuries or medical conditions; recommend a doctor/physiotherapist for pain, injury, or red-flag symptoms and escalate to the coach.
- Enforce safe limits in code (not just in prompts): minimum calories floor (configurable, e.g. never below BMR-based floor), max weekly weight-loss rate (~1% bodyweight), block extreme deficits, flag signs of disordered eating (from check-in answers) to the coach instead of making the diet stricter.
- No body-shaming language; supportive tone.
- Respect the client's AI consent flag — if off, skip AI on their data.
- Photos sent to AI only via short-lived signed URLs.
- Reply in the user's selected language (`en` or `ne`); Nepali output must be in Devanagari script.
- For clients under 18, apply the youth-safe rules in section 4.5 and never analyze their body photos.

---

## 6. Media Upload Requirements (images & videos)

- Direct browser → Cloudinary **signed uploads** (server route generates signature; never expose API secret).
- Accept: images `jpg, jpeg, png, webp, heic` (convert HEIC); videos `mp4, mov, webm`.
- Limits (configurable per SaaS plan): image ≤ 15MB, video ≤ 200MB / ≤ 60–90s.
- Client-side: preview, compression for images (`browser-image-compression`), progress bar, cancel, retry, resumable/chunked upload for large videos.
- Server-side: store metadata in `MediaAsset` collection (owner, workspace, type, purpose: `progress_photo | form_check | meal | chat | avatar | document`, cloudinary publicId, dimensions, duration, thumbnail URL, visibility).
- **Privacy:** progress photos and form videos use Cloudinary `authenticated`/private delivery; the app serves them via short-lived signed URLs after checking permission. Strip EXIF/GPS metadata.
- Auto-generate thumbnails & poster frames; adaptive streaming for video playback.
- Storage quota tracking per workspace; warn at 80%.
- Deletion: when a client deletes their account or media, remove from Cloudinary too (background job).

---

## 7. Data Model (Mongoose) — minimum collections

Design these with proper indexes (`workspaceId` + frequent query fields), timestamps, and soft delete where noted.

- `User` — name, email, passwordHash (nullable for social-only), image, role, workspaceId, locale (`en`/`ne`), units, emailVerified, dateOfBirth, isMinor, status, lastLoginAt
- `Account` — Auth.js provider accounts (google, facebook) linked to User
- `VerificationToken` — userId/email, tokenHash, type (`email_verify` | `password_reset` | `guardian_invite`), expiresAt, usedAt
- `Workspace` — type (`INDEPENDENT_COACH` | `GYM_CENTER`), name, slug, ownerId, branding, settings (checkInDay, timezone, AI settings, default currency, minClientAge), saasPlan, saasStatus, trialEndsAt, usage counters
- `Branch` — workspaceId, name, address, phone (gym centers only)
- `GuardianLink` — minorUserId, guardianUserId, relationship, consents{coaching, healthData, photos, ai}, consentedAt, status (pending/approved/revoked)
- `ClientProfile` — userId, workspaceId, assignedCoachId, onboarding answers, goals, health flags, consent flags, status (lead/active/paused/expired), tags, startDate
- `CoachingPackage` — workspaceId, name, durationDays, price, currency, features, active
- `Subscription` (client ↔ package) — clientId, packageId, startDate, endDate, status, autoRenew
- `Payment` — payer, workspaceId, amount, currency, provider (stripe/paypal/khalti/esewa/manual), providerRef, status, invoiceNumber
- `PaymentGatewayConfig` — workspaceId, provider, encrypted credentials, mode (sandbox/live), enabled
- `SaasSubscription` — workspaceId, plan, provider, status, periodEnd
- `Exercise` — global + workspace custom, name (en/ne), muscleGroups, equipment, demoMediaUrl, instructions
- `Program` — workspaceId, clientId (nullable for templates), isTemplate, name, weeks[days[exercises[sets, reps, rpe, rest, tempo, notes]]], version, status (draft/published/archived), createdBy (coach/AI)
- `WorkoutLog` — clientId, programId, date, exercises[sets[weight, reps, rpe, completed]], duration, notes, PRs
- `Food` — global + custom, name (en/ne), servingSize, calories, protein, carbs, fat, fiber, tags
- `DietPlan` — clientId, calories, macros, meals[foods, qty], swaps, version, status
- `MealLog` / `DailyLog` — clientId, date, meals, water, steps, sleep, weight, supplements
- `BodyMetric` — clientId, date, weight, bodyFat, measurements
- `CheckIn` — clientId, weekOf, answers, weight, measurements, photoIds, adherence, aiSummary, coachReply, status (due/submitted/reviewed/missed)
- `FormCheck` — clientId, exerciseId, videoAssetId, notes, aiAnalysis, coachComments[{timestampSec, text, annotationImageId}], status
- `MediaAsset` — see section 6
- `Conversation`, `Message` — participants, text, attachments, readBy, replyTo, isAiGenerated
- `CallBooking` — clientId, coachId, scheduledAt, duration, roomUrl, status, notes
- `Notification` — userId, type, payload, readAt, channels sent
- `CoachNote` — private notes on client
- `AiUsage` — workspaceId, feature, inputTokens, outputTokens, costEstimate, createdAt
- `AuditLog` — actorId, action, target, metadata, ip
- `PushSubscription`

---

## 8. Folder Structure

```
src/
  app/
    (marketing)/            # landing, pricing, coach public pages
    (auth)/                 # login, register, verify, reset
    app/                    # CLIENT portal
    coach/                  # COACH portal
    super-admin/            # SUPER ADMIN portal
    guardian/               # GUARDIAN portal (parents of minor clients)
    api/                    # route handlers: webhooks, uploads/sign, cron, ai streaming, pusher auth
  components/
    ui/                     # shadcn components
    shared/                 # layout, nav, charts, media uploader, video player
  features/                 # domain modules: auth, onboarding, programs, workouts, diet, checkins,
                            #   formchecks, progress, chat, calls, payments, ai, admin
    <feature>/
      components/  actions.ts  queries.ts  schemas.ts  types.ts
  lib/
    db/ (connection, models/)  auth/  ai/  media/  payments/  pusher/  email/  ratelimit/  utils/
  i18n/ (messages/en.json, messages/ne.json)
  emails/                   # React Email templates
  middleware.ts             # auth + role routing + locale
scripts/seed.ts
tests/ (unit, e2e)
```

---

## 9. UX & Design Requirements

- Mobile-first, responsive at 360 / 768 / 1024 / 1440px. Bottom navigation for clients on mobile, collapsible sidebar on desktop.
- Dark mode default, light mode toggle, respects system setting.
- Big touch targets (≥ 44px), clear primary action per screen, max 2 taps to log a set or upload a form video.
- Skeleton loaders, optimistic updates, toast feedback (`sonner`), empty states with a helpful next step, friendly error states with retry.
- Accessibility: WCAG 2.1 AA contrast, keyboard navigation, focus rings, alt text, aria labels, reduced-motion support.
- Performance: Lighthouse ≥ 90 on mobile for main pages; `next/image`; lazy-load charts & video; paginate/infinite-scroll lists.
- PWA: installable, app icon, splash, offline fallback page, push notifications.
- Numbers & dates formatted per locale and user timezone; units kg/lb and cm/in switchable.

### 9.1 Bilingual (English + Nepali) — required at launch
- Every UI string lives in `messages/en.json` and `messages/ne.json`; **no hardcoded text** in components. Add a CI/lint check that fails if a key exists in one file but not the other.
- Language switcher in the header (marketing, auth, and all portals) and in settings; choice saved on the user profile and in a cookie for logged-out visitors. Default: browser language, falling back to English.
- Locale-prefixed routes for public pages (`/en/...`, `/ne/...`) for SEO with `hreflang` tags; portals can use the saved preference.
- Nepali font: load **"Noto Sans Devanagari"** (or "Mukta") via `next/font` and apply automatically when `ne` is active; check line-height and that bold display headings still render well in Devanagari.
- Dates: show Gregorian (AD) by default with an optional **Bikram Sambat (BS)** display toggle for Nepali users; numbers can optionally use Devanagari numerals.
- Emails, push notifications and PDF invoices are sent in the recipient's language.
- Bilingual content fields for coach-created data where useful (exercise names, food names, package descriptions): `{ en, ne }` with fallback to whichever exists.
- Food & exercise seed data includes Nepali names.

---

## 10. Notifications

Channels: in-app (bell + Pusher real time), web push, email. User can toggle per type.
Events: new message, check-in due / overdue, check-in reviewed, form check reviewed, new/updated plan published, call booked/reminder (24h + 15min), payment success/failure, package expiring (7d, 3d, 1d), coach alerts (new client application, at-risk client, check-in submitted, form video submitted).

---

## 11. Payments

- `PaymentProvider` interface (`createCheckout`, `verifyPayment`, `handleWebhook`, `refund`, `createSubscription?`) with implementations:
  - **International:** `StripeProvider` (Checkout + Billing subscriptions, cards, Apple/Google Pay), `PayPalProvider` (PayPal Orders v2 + Subscriptions API)
  - **National (Nepal):** `KhaltiProvider` (ePayment v2), `EsewaProvider` (ePay v2 with HMAC-SHA256 signature)
  - `ManualProvider` (cash / bank transfer / QR, recorded by owner or staff)
- Checkout shows methods based on currency & country: NPR → Khalti, eSewa (+ manual); USD/other → Stripe, PayPal. Workspace can enable/disable each method.
- Two money flows:
  1. **SaaS billing** — coach/gym pays me (the platform owner). Uses **my** platform credentials from env. Stripe & PayPal support auto-renewing subscriptions; Khalti/eSewa don't support recurring billing, so for those, create a renewal invoice and send payment-link reminders before expiry (7d, 3d, 1d), then suspend after a grace period.
  2. **Coaching packages** — client pays the coach/gym. Each workspace connects **its own** gateway credentials (Stripe keys or Stripe Connect Standard, PayPal client ID/secret, Khalti and eSewa merchant keys), stored encrypted in `PaymentGatewayConfig`, with a "Test connection" button and sandbox/live toggle. Money goes directly to the coach/gym; the platform takes no cut in v1 (ask me before adding a platform commission).
- Currency: workspace default currency (NPR or USD), packages can have prices in both.
- Webhooks/callbacks verified (signatures), idempotent, and they update `Payment` + `Subscription`.
- Access control: expired client subscription → read-only access to history, cannot log new data or chat (configurable grace period).
- Generate PDF invoices.

---

## 12. Security & Privacy

- Auth.js with secure cookies, CSRF protection, bcrypt (cost 12), email verification required before sensitive actions.
- RBAC + tenant isolation enforced in a single data-access layer; write tests proving a client cannot access another client's data and a coach cannot access another workspace.
- Rate limiting on auth, AI, upload-signature and chat endpoints (Upstash).
- Security headers (CSP, HSTS, X-Frame-Options), sanitize rich text, validate file types by MIME + magic bytes.
- Encrypt sensitive fields at rest (health info, payment gateway credentials) using a key from env.
- Audit log for admin/coach sensitive actions.
- Privacy: consent records, data export, account deletion (hard delete media within 30 days), privacy policy & terms pages. Treat body photos and health data as **sensitive personal data** (consider GDPR if serving EU users and Nepal's Individual Privacy Act).
- Never log secrets, tokens, or photo URLs with signatures.

---

## 13. Environment Variables (create `.env.example` and ASK ME for real values)

```
# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=TaakatAI
ENCRYPTION_KEY=

# Database
MONGODB_URI=

# Auth
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_FACEBOOK_ID=
AUTH_FACEBOOK_SECRET=

# AI
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=

# Media
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Realtime
PUSHER_APP_ID=
PUSHER_SECRET=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=

# Video calls
DAILY_API_KEY=

# Email
RESEND_API_KEY=
EMAIL_FROM=

# Payments — PLATFORM credentials (SaaS billing to me).
# Coach/gym gateway keys are NOT env vars; they are entered in the workspace settings UI and stored encrypted.
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_WEBHOOK_ID=
PAYPAL_MODE=sandbox
KHALTI_SECRET_KEY=
KHALTI_BASE_URL=
ESEWA_MERCHANT_CODE=
ESEWA_SECRET_KEY=
ESEWA_BASE_URL=

# Jobs / cache / push / monitoring
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
SENTRY_DSN=
CRON_SECRET=
```
Validate env at startup with Zod (`src/lib/env.ts`); fail fast with a clear message listing missing keys. Features whose keys are missing should be disabled gracefully (e.g. hide "Pay with Khalti"), not crash the app.

---

## 14. Build Phases (follow in order)

1. **Foundation** — Next.js + TS + Tailwind v4 + shadcn/ui + ESLint/Prettier/Husky, env validation, MongoDB connection, base layouts (marketing, auth, client, coach, guardian, super-admin), theme (dark/light), **full EN/NE i18n setup with Devanagari font and missing-key check**, design tokens.
2. **Auth & Roles** — Auth.js (credentials + Google + Facebook), email verification link flow, password reset, account linking, middleware role routing, workspace creation (Independent Coach / Gym Center), staff invites, tenant-scoped data layer + isolation tests.
3. **Onboarding** — client multi-step wizard, health red flags, consents, **minor detection + guardian consent flow + guardian portal**, coach/gym setup wizard.
4. **Media system** — Cloudinary signed uploads, `MediaUploader` component (image/video, progress, retry, compression), private signed delivery, `MediaAsset` model, EXIF stripping.
5. **Training** — exercise library (seed ~150 exercises), program builder, client workout logger, PR detection, offline queue.
6. **Diet** — food DB (seed Nepali + common foods), macro calculator, diet plan builder, meal/water logging.
7. **Check-ins & Progress** — configurable weekly check-in, reminders (cron), photo compare slider, charts, coach review screen.
8. **Form checks** — upload flow, video player with frame stepping, timestamped comments, canvas annotations.
9. **Chat & Notifications** — Pusher real-time chat with media & voice notes, notification center, web push, emails.
10. **AI** — all features in section 5 with structured outputs, safety limits, credits, usage logging, coach approval flow.
11. **Video calls** — availability, booking, Daily.co rooms, reminders.
12. **Payments** — packages, Stripe/PayPal/Khalti/eSewa/manual, per-workspace gateway settings, webhooks, access expiry, invoices; SaaS plans, limits & renewals.
13. **Coach dashboard & analytics** — priority queue, at-risk detection, revenue; **Super admin portal**.
14. **Marketing site** — landing, pricing, coach public profile, SEO.
15. **Hardening** — tests (unit + Playwright e2e for: email signup→verification link→onboarding→log workout→check-in→coach review; Google/Facebook login; minor signup→guardian approval; upload form video→coach comments; payment flows in sandbox for all 4 gateways; switching EN↔NE on every portal), accessibility pass, performance pass, Sentry, PWA, README with setup + deployment guide.

---

## 15. Seed Data (`pnpm seed`)
- 1 super admin; 1 Independent Coach workspace (owner + 1 assistant coach) and 1 Gym Center workspace (owner, 2 branches, 3 trainers, 1 front-desk staff); 12 clients with varied goals, including 2 minors with linked guardians; a mix of `en` and `ne` language preferences.
- 12 weeks of realistic workout logs, daily weights, 8 weekly check-ins with placeholder photos, 3 form checks with comments, chat history, payments.
- Print demo login credentials at the end of the seed.

---

## 16. Definition of Done
- All flows in section 14 work end-to-end on mobile and desktop, in both English and Nepali.
- `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test` pass with zero errors.
- No client can access another client's data; no coach can access another workspace (tests prove it).
- Every AI output affecting a client's plan requires coach approval.
- README explains: local setup, env vars and where to get each key, seeding, deployment to Vercel, and configuring OAuth apps (Google Cloud Console, Meta for Developers — including redirect URIs and Facebook app review for the email permission), webhooks/callbacks (Stripe, PayPal, Khalti, eSewa) and cron.

---

## 17. Decisions Already Made
- Multi-coach SaaS sold to independent coaches **and** gym centers.
- Languages at launch: English + Nepali.
- Payments: Stripe + PayPal (international), Khalti + eSewa (Nepal), manual.
- Clients under 18 allowed, with guardian consent and safeguards (section 4.5).
- Login: Google, Facebook, or email + password with email verification link.

## 18. Questions to Ask Me Before/While Building
Ask these if they are still unanswered when you reach the relevant phase:
1. Default check-in day (Saturday?) and default timezone (Asia/Kathmandu?).
2. Video call provider: Daily.co (recommended), LiveKit, or simple Google Meet/Zoom links?
3. Max video length/size for form checks?
4. Final product name & domain (needed for OAuth redirect URLs and the email sending domain).
5. Should clients use the AI assistant 24/7, or should only coaches see AI outputs?
6. Final SaaS plan prices in NPR and USD.
7. Should the platform take a commission on client payments later (would require Stripe Connect / marketplace setup)?
8. Do you have a logo/brand assets, or should I generate placeholder branding?
