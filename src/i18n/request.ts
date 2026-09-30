import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { getPreferredLocale } from "./locale";
import { locales } from "./routing";

/** The `[locale]` root param on public routes; undefined on portals / server actions. */
async function getRootLocale(): Promise<string | undefined> {
  try {
    const { locale } = await import("next/root-params");
    return await locale();
  } catch {
    // Not available outside Server Components (e.g. server actions) or on routes without [locale].
    return undefined;
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Public routes: locale from the URL segment. Portals: saved cookie → browser language → en.
  const requested = (await getRootLocale()) ?? (await requestLocale);
  const locale = hasLocale(locales, requested) ? requested : await getPreferredLocale();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    // Default until per-user timezones arrive with auth (Phase 2).
    timeZone: "Asia/Kathmandu",
  };
});
