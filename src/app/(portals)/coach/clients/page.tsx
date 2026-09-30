import { UserPlus } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { PendingAction } from "@/components/shared/pending-action";
import { ClientsTable } from "@/features/clients/components/clients-table";
import { coachClients } from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("coach.nav.clients") };
}

export default async function CoachClientsPage() {
  const t = await getTranslations("coach.clients");
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <PendingAction className="h-11">
            <UserPlus aria-hidden /> {t("invite")}
          </PendingAction>
        }
      />
      <ClientsTable clients={coachClients} />
    </div>
  );
}
