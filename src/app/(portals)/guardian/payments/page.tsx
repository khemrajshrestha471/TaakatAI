import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ComingSoon } from "@/components/shared/coming-soon";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("guardian.nav.payments") };
}

export default async function GuardianPaymentsPage() {
  const t = await getTranslations("portal");
  return <ComingSoon title={t("guardian.nav.payments")} />;
}
