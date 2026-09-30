# Environment variables — where to get every key

All keys go in `.env.local` (local) and in **Vercel → Project → Settings → Environment Variables**
(production). Never commit `.env.local`. Check your setup any time with:

```bash
pnpm env:check        # lists missing keys and which features are enabled
```

The super-admin overview page (`/super-admin`) also shows a live "Integrations" panel.

> Variables starting with `NEXT_PUBLIC_` are visible in the browser. Only publishable values
> (Pusher key, Stripe publishable key, app URL) may use that prefix — never secrets.

## When each key is needed

| Needed for                          | Keys                                                                  | Phase                     |
| ----------------------------------- | --------------------------------------------------------------------- | ------------------------- |
| Running the app at all              | `NEXT_PUBLIC_APP_URL`, `ENCRYPTION_KEY`, `AUTH_SECRET`, `MONGODB_URI` | now (already set locally) |
| Sign-up, login, verification emails | `MONGODB_URI` (real), Google, Facebook, Resend, Upstash               | 2                         |
| Photo / video uploads               | Cloudinary                                                            | 4                         |
| Real-time chat, push notifications  | Pusher, VAPID                                                         | 9                         |
| AI features                         | Anthropic                                                             | 10                        |
| Video calls                         | Daily.co                                                              | 11                        |
| Payments                            | Stripe, PayPal, Khalti, eSewa                                         | 12                        |
| Background jobs, monitoring         | Inngest, Sentry                                                       | 7 / 15                    |

---

## App & security

| Key                    | How to get it                                                                                                                                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`  | `http://localhost:3000` locally; your real domain in production, e.g. `https://taakat.app`.                                                                                                                                                  |
| `NEXT_PUBLIC_APP_NAME` | Product name shown in the UI (default `TaakatAI`).                                                                                                                                                                                           |
| `AUTH_SECRET`          | Random secret for signing sessions. Generate: `npx auth secret` or `node -e "console.log(require('crypto').randomBytes(33).toString('base64url'))"`. Use a **different** value in production.                                                |
| `ENCRYPTION_KEY`       | 32-byte key (base64) that encrypts health data and coaches' payment keys. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. **Back it up — if you lose or change it, encrypted data cannot be read.** |
| `CRON_SECRET`          | Any long random string; Vercel Cron sends it so only Vercel can trigger scheduled jobs.                                                                                                                                                      |

## Database — MongoDB Atlas

1. Sign up at <https://cloud.mongodb.com> and create a **free M0 cluster** (choose region
   `Mumbai (ap-south-1)` — closest to Nepal).
2. **Database Access** → Add database user (username + strong password).
3. **Network Access** → Add IP address. For local dev add your IP; for Vercel add `0.0.0.0/0`
   (Vercel has no fixed IPs; the password still protects the database).
4. **Database → Connect → Drivers** → copy the connection string and add the database name:
   `MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/taakatai?retryWrites=true&w=majority`
   (URL-encode special characters in the password.)

## Google sign-in

1. <https://console.cloud.google.com> → create a project (e.g. "TaakatAI").
2. **APIs & Services → OAuth consent screen**: External, app name, support email, logo, privacy
   policy URL; scopes `openid`, `email`, `profile`. Publish the app when you go live.
3. **Credentials → Create credentials → OAuth client ID → Web application**
   - Authorized JavaScript origins: `http://localhost:3000`, `https://yourdomain`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`,
     `https://yourdomain/api/auth/callback/google`
4. Copy **Client ID** → `AUTH_GOOGLE_ID`, **Client secret** → `AUTH_GOOGLE_SECRET`.

## Facebook sign-in

1. <https://developers.facebook.com> → **My Apps → Create app** → use case
   "Authenticate and request data from users with Facebook Login".
2. **App settings → Basic**: copy **App ID** → `AUTH_FACEBOOK_ID`, **App secret** →
   `AUTH_FACEBOOK_SECRET`. Add privacy policy URL, terms URL, app icon and category.
3. **Facebook Login → Settings → Valid OAuth Redirect URIs**:
   `https://yourdomain/api/auth/callback/facebook` (localhost works while the app is in
   development mode).
4. Permissions: `public_profile` and `email`. Before switching the app to **Live**, Meta may require
   business verification / app review. Some users have no email on Facebook — the app asks them for
   one (spec §4.2).

## Email — Resend

1. Sign up at <https://resend.com> → **API Keys → Create API key** → `RESEND_API_KEY`.
2. **Domains → Add domain** (e.g. `taakat.app`), add the DNS records (SPF, DKIM) it shows at your
   domain registrar, and wait for "Verified".
3. `EMAIL_FROM="TaakatAI <no-reply@taakat.app>"`. Until a domain is verified, Resend only sends to
   your own account email (from `onboarding@resend.dev`).

## Rate limiting — Upstash Redis

<https://console.upstash.com> → **Create database** (Redis, region close to your Vercel region) →
**REST API** section: copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

## Media — Cloudinary

<https://cloudinary.com> → sign up → **Settings → API Keys** (or the dashboard):
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. The secret stays on the server;
the browser only receives short-lived signatures.

## Real-time — Pusher Channels

<https://dashboard.pusher.com> → **Channels → Create app** (cluster **ap2 — Mumbai**) →
**App Keys**: `app_id` → `PUSHER_APP_ID`, `secret` → `PUSHER_SECRET`, `key` → `NEXT_PUBLIC_PUSHER_KEY`,
`cluster` → `NEXT_PUBLIC_PUSHER_CLUSTER` (e.g. `ap2`).

## Web push — VAPID keys

Generate locally (no account needed): `npx web-push generate-vapid-keys` → `VAPID_PUBLIC_KEY`,
`VAPID_PRIVATE_KEY`.

## AI — Anthropic (Claude)

1. <https://console.anthropic.com> → **Settings → API Keys → Create key** → `ANTHROPIC_API_KEY`.
2. Add credits under **Billing** and set a monthly spend limit.
3. `ANTHROPIC_MODEL` — recommended `claude-sonnet-5-5` (good quality/cost balance). Alternatives:
   `claude-opus-5-5` (highest quality, higher cost) or `claude-haiku-4-5-20251001` (cheapest, fastest).

## Video calls — Daily.co

<https://dashboard.daily.co> → **Developers → API keys** → `DAILY_API_KEY`.

## Payments (platform billing — coaches/gyms paying you)

> Coaches' own gateway keys are **not** env vars — they enter them in `/coach/payments`
> and they are stored encrypted.

**Stripe** — <https://dashboard.stripe.com> → **Developers → API keys** (start in _Test mode_):
secret `sk_test_…` → `STRIPE_SECRET_KEY`, publishable `pk_test_…` →
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. **Developers → Webhooks → Add endpoint**
`https://yourdomain/api/webhooks/stripe` → signing secret `whsec_…` → `STRIPE_WEBHOOK_SECRET`
(locally: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`).
⚠️ Stripe does not currently onboard businesses registered in Nepal; you may need a company in a
supported country to receive Stripe payouts.

**PayPal** — <https://developer.paypal.com> → **Apps & Credentials → Sandbox → Create app** →
`PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`. Add a webhook
`https://yourdomain/api/webhooks/paypal` → `PAYPAL_WEBHOOK_ID`. `PAYPAL_MODE=sandbox` (then `live`).
⚠️ Check PayPal's current availability for receiving payments with a Nepal-based account.

**Khalti** — create a merchant account on the sandbox dashboard (<https://test-admin.khalti.com>) →
**Keys** → secret key → `KHALTI_SECRET_KEY`. `KHALTI_BASE_URL=https://dev.khalti.com/api/v2`
(sandbox) / `https://khalti.com/api/v2` (live). Live keys need a verified merchant account
(business registration / PAN). Docs: <https://docs.khalti.com>.

**eSewa** — for testing, eSewa publishes UAT credentials in its developer docs
(<https://developer.esewa.com.np>): merchant code `EPAYTEST` and the matching test secret key.
`ESEWA_BASE_URL=https://rc-epay.esewa.com.np` (test) / `https://epay.esewa.com.np` (live).
Live credentials come from a merchant agreement with eSewa.

## Background jobs — Inngest

<https://app.inngest.com> → **Manage → Event keys** → `INNGEST_EVENT_KEY`;
**Manage → Signing key** → `INNGEST_SIGNING_KEY`. Not needed locally (run `npx inngest-cli dev`).

## Error monitoring — Sentry

<https://sentry.io> → create a **Next.js** project → **Settings → Client Keys (DSN)** → `SENTRY_DSN`.
