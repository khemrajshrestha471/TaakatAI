/**
 * Runs once when the server starts. Reports missing/invalid env vars clearly;
 * in production a missing REQUIRED key stops the server (fail fast).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { EnvError, getFeatures, parseEnv } = await import("@/lib/env.schema");
  try {
    const disabled = Object.entries(getFeatures(parseEnv(process.env)))
      .filter(([, enabled]) => !enabled)
      .map(([name]) => name);
    if (disabled.length) {
      console.warn(`[env] Features disabled (keys not set): ${disabled.join(", ")}`);
    }
  } catch (error) {
    if (!(error instanceof EnvError)) throw error;
    if (process.env.NODE_ENV === "production") throw error;
    console.error(`[env] ${error.message}`);
  }
}
