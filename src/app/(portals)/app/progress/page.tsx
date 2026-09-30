import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ComingSoon } from "@/components/shared/coming-soon";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("client.nav.progress") };
}

export default async function AppProgressPage() {
  const t = await getTranslations("portal");
  return <ComingSoon title={t("client.nav.progress")} />;
}
