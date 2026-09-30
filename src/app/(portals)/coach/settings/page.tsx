import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { WorkspaceSettingsForm } from "@/features/settings/components/workspace-settings-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("coach.nav.settings") };
}

export default async function CoachSettingsPage() {
  const t = await getTranslations("coach.settings");
  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <WorkspaceSettingsForm />
    </div>
  );
}
