import "server-only";

import { EnvError, env, getFeatures, type Features } from "@/lib/env";

/**
 * Which integrations are configured, for deciding what to show in the UI.
 * Never throws: if required env vars are missing, every integration reads as disabled.
 */
export function safeFeatures(): Features {
  try {
    env();
    return getFeatures();
  } catch (error) {
    if (!(error instanceof EnvError)) throw error;
    return {
      googleAuth: false,
      facebookAuth: false,
      ai: false,
      media: false,
      realtime: false,
      videoCalls: false,
      email: false,
      stripe: false,
      paypal: false,
      khalti: false,
      esewa: false,
      jobs: false,
      rateLimit: false,
      webPush: false,
      sentry: false,
      cron: false,
    };
  }
}
