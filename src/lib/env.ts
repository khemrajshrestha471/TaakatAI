import "server-only";

import { getFeatures as featuresOf, parseEnv, type ServerEnv } from "./env.schema";

export { EnvError, type Features, type ServerEnv } from "./env.schema";

let cached: ServerEnv | undefined;

/** Validated server env. Throws `EnvError` listing every missing/invalid key. */
export function env(): ServerEnv {
  cached ??= parseEnv(process.env);
  return cached;
}

/** Which optional integrations are configured. Features with missing keys are disabled. */
export function getFeatures() {
  return featuresOf(env());
}
