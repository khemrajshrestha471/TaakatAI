import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { ChatThread } from "@/features/chat/components/chat-thread";
import { guardianThread, guardianView } from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("guardian.nav.chat") };
}

export default async function GuardianChatPage() {
  const t = await getTranslations("guardian.chat");
  const { minor } = guardianView;
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("title")}
        description={t("subtitle", { coach: minor.coach, name: minor.name })}
      />
      <ChatThread
        messages={guardianThread(new Date())}
        self="client"
        names={{ coach: minor.coach, client: minor.name }}
        mode="readOnly"
      />
    </div>
  );
}
