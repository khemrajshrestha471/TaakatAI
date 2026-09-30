import "server-only";

import { hasLocale } from "next-intl";
import { cookies, headers } from "next/headers";

import { defaultLocale, LOCALE_COOKIE, locales, type Locale } from "./routing";

/** Picks the best supported locale from an Accept-Language header. */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0] ?? "", q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return (
    (ranked.find((r) => hasLocale(locales, r.lang))?.lang as Locale | undefined) ?? defaultLocale
  );
}

/**
 * Locale for UNPREFIXED routes (portals): saved cookie → browser language → English.
 * Phase 2 adds the signed-in user's saved `locale` as the first choice.
 */
export async function getPreferredLocale(): Promise<Locale> {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (hasLocale(locales, saved)) return saved;
  return negotiateLocale((await headers()).get("accept-language"));
}
