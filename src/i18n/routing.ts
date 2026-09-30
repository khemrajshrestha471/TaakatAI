import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ne"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Cookie shared by public (prefixed) routes and portals (unprefixed) to remember the language. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Public pages are always locale-prefixed (/en/..., /ne/...) for SEO + hreflang.
  localePrefix: "always",
  // First visit: browser language (Accept-Language), falling back to English.
  localeDetection: true,
  localeCookie: { name: LOCALE_COOKIE, maxAge: 60 * 60 * 24 * 365 },
});
