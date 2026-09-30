/**
 * Fails if any message key exists in one locale file but not the other (or is empty).
 * Runs as part of `pnpm lint` and CI.
 */
import en from "../src/i18n/messages/en.json";
import ne from "../src/i18n/messages/ne.json";
import { diffMessages } from "../src/i18n/lib/compare-messages";

const files = { en, ne } as const;
let failed = false;

for (const [a, b] of [
  ["en", "ne"],
  ["ne", "en"],
] as const) {
  const { missing, empty } = diffMessages(files[a], files[b]);
  for (const key of missing)
    console.error(`✖ ${b}.json is missing "${key}" (present in ${a}.json)`);
  for (const key of empty) console.error(`✖ ${b}.json has an empty value for "${key}"`);
  failed ||= missing.length > 0 || empty.length > 0;
}

if (failed) process.exit(1);
console.log("✔ i18n: en.json and ne.json have identical keys.");
