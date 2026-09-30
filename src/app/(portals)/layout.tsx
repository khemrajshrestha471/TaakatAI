import "../globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocale } from "next-intl/server";

import { RootDocument } from "@/components/shared/root-document";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  // Portals are private — keep them out of search engines.
  robots: { index: false, follow: false },
};

/** Root layout for the signed-in portals. Locale comes from the saved preference, not the URL. */
export default async function PortalsRootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return <RootDocument locale={locale}>{children}</RootDocument>;
}
