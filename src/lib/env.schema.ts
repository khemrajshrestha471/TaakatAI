import { z } from "zod";

/**
 * Server environment schema (pure — safe to import from scripts/tests).
 * App code should import from `@/lib/env` instead.
 *
 * - REQUIRED keys make the app fail fast (on first access) with a clear list of what is missing.
 * - OPTIONAL feature keys never crash the app. Use `features` to check whether an integration
 *   is configured and hide/disable the related UI when it is not.
 *
 * Validation is lazy so `next build` works on machines/CI without real secrets.
 */

const optional = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // App
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_APP_NAME: z.string().default("TaakatAI"),
  ENCRYPTION_KEY: z
    .string()
    .refine((v) => Buffer.from(v, "base64").length === 32, "must be 32 bytes, base64-encoded"),

  // Database
  MONGODB_URI: z.string().startsWith("mongodb", "must be a mongodb:// or mongodb+srv:// URI"),

  // Auth
  AUTH_SECRET: z.string().min(32, "must be at least 32 characters"),
  AUTH_GOOGLE_ID: optional,
  AUTH_GOOGLE_SECRET: optional,
  AUTH_FACEBOOK_ID: optional,
  AUTH_FACEBOOK_SECRET: optional,

  // AI
  ANTHROPIC_API_KEY: optional,
  ANTHROPIC_MODEL: optional,

  // Media
  CLOUDINARY_CLOUD_NAME: optional,
  CLOUDINARY_API_KEY: optional,
  CLOUDINARY_API_SECRET: optional,

  // Realtime
  PUSHER_APP_ID: optional,
  PUSHER_SECRET: optional,
  NEXT_PUBLIC_PUSHER_KEY: optional,
  NEXT_PUBLIC_PUSHER_CLUSTER: optional,

  // Video calls
  DAILY_API_KEY: optional,

  // Email
  RESEND_API_KEY: optional,
  EMAIL_FROM: optional,

  // Payments (platform credentials)
  STRIPE_SECRET_KEY: optional,
  STRIPE_WEBHOOK_SECRET: optional,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: optional,
  PAYPAL_CLIENT_ID: optional,
  PAYPAL_CLIENT_SECRET: optional,
  PAYPAL_WEBHOOK_ID: optional,
  PAYPAL_MODE: z.enum(["sandbox", "live"]).default("sandbox"),
  KHALTI_SECRET_KEY: optional,
  KHALTI_BASE_URL: optional,
  ESEWA_MERCHANT_CODE: optional,
  ESEWA_SECRET_KEY: optional,
  ESEWA_BASE_URL: optional,

  // Jobs / cache / push / monitoring
  INNGEST_EVENT_KEY: optional,
  INNGEST_SIGNING_KEY: optional,
  UPSTASH_REDIS_REST_URL: optional,
  UPSTASH_REDIS_REST_TOKEN: optional,
  VAPID_PUBLIC_KEY: optional,
  VAPID_PRIVATE_KEY: optional,
  SENTRY_DSN: optional,
  CRON_SECRET: optional,
});

export type ServerEnv = z.infer<typeof serverSchema>;

export class EnvError extends Error {
  constructor(public readonly issues: string[]) {
    super(
      `Invalid or missing environment variables:\n${issues.map((i) => `  - ${i}`).join("\n")}\n` +
        `Copy .env.example to .env.local and fill them in (run \`pnpm env:check\`).`,
    );
    this.name = "EnvError";
  }
}

export function parseEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = serverSchema.safeParse(source);
  if (!result.success) {
    throw new EnvError(
      result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
    );
  }
  return result.data;
}

/** Which optional integrations are configured. Features with missing keys are disabled. */
export function getFeatures(e: ServerEnv) {
  return {
    googleAuth: Boolean(e.AUTH_GOOGLE_ID && e.AUTH_GOOGLE_SECRET),
    facebookAuth: Boolean(e.AUTH_FACEBOOK_ID && e.AUTH_FACEBOOK_SECRET),
    ai: Boolean(e.ANTHROPIC_API_KEY && e.ANTHROPIC_MODEL),
    media: Boolean(e.CLOUDINARY_CLOUD_NAME && e.CLOUDINARY_API_KEY && e.CLOUDINARY_API_SECRET),
    realtime: Boolean(
      e.PUSHER_APP_ID &&
      e.PUSHER_SECRET &&
      e.NEXT_PUBLIC_PUSHER_KEY &&
      e.NEXT_PUBLIC_PUSHER_CLUSTER,
    ),
    videoCalls: Boolean(e.DAILY_API_KEY),
    email: Boolean(e.RESEND_API_KEY && e.EMAIL_FROM),
    stripe: Boolean(e.STRIPE_SECRET_KEY && e.STRIPE_WEBHOOK_SECRET),
    paypal: Boolean(e.PAYPAL_CLIENT_ID && e.PAYPAL_CLIENT_SECRET),
    khalti: Boolean(e.KHALTI_SECRET_KEY && e.KHALTI_BASE_URL),
    esewa: Boolean(e.ESEWA_MERCHANT_CODE && e.ESEWA_SECRET_KEY && e.ESEWA_BASE_URL),
    jobs: Boolean(e.INNGEST_EVENT_KEY && e.INNGEST_SIGNING_KEY),
    rateLimit: Boolean(e.UPSTASH_REDIS_REST_URL && e.UPSTASH_REDIS_REST_TOKEN),
    webPush: Boolean(e.VAPID_PUBLIC_KEY && e.VAPID_PRIVATE_KEY),
    sentry: Boolean(e.SENTRY_DSN),
    cron: Boolean(e.CRON_SECRET),
  } as const;
}

export type Features = ReturnType<typeof getFeatures>;
