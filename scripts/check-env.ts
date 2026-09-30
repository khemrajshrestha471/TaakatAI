/**
 * Prints which env vars are missing and which features are disabled.
 * Usage: pnpm env:check   (reads .env.local then .env)
 */
import { config } from "dotenv";

import { EnvError, getFeatures, parseEnv } from "../src/lib/env.schema";

config({ path: [".env.local", ".env"], quiet: true });

try {
  const parsed = parseEnv(process.env);
  console.log("✔ Required environment variables are set.\n");
  const features = getFeatures(parsed);
  for (const [name, enabled] of Object.entries(features)) {
    console.log(`  ${enabled ? "✔ enabled " : "✖ disabled"}  ${name}`);
  }
  console.log("\nDisabled features only need their keys added to .env.local (see .env.example).");
} catch (error) {
  if (error instanceof EnvError) {
    console.error(`✖ ${error.message}`);
    process.exit(1);
  }
  throw error;
}
