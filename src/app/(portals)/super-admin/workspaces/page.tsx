import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { WorkspacesTable } from "@/features/admin/components/workspaces-table";
import { workspaces } from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("superAdmin.nav.workspaces") };
}

export default async function WorkspacesPage() {
  const t = await getTranslations("admin.workspaces");
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <WorkspacesTable rows={workspaces} />
    </div>
  );
}
