import { Bot, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aiThread, coachThread, demoClient } from "@/features/demo/data";
import { ChatThread } from "@/features/chat/components/chat-thread";
import { safeFeatures } from "@/lib/features";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("client.nav.chat") };
}

export default async function ChatPage() {
  const t = await getTranslations("chat");
  const now = new Date();
  const names = { coach: demoClient.coachName, client: demoClient.name };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <Tabs defaultValue="coach">
        <TabsList className="mb-3">
          <TabsTrigger value="coach" className="min-h-10 px-4">
            <MessageCircle aria-hidden /> {t("coachTab")}
          </TabsTrigger>
          <TabsTrigger value="ai" className="min-h-10 px-4">
            <Bot aria-hidden /> {t("aiTab")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="coach">
          <ChatThread messages={coachThread(now)} self="client" names={names} mode="coach" />
        </TabsContent>
        <TabsContent value="ai" className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">{t("aiDisclaimer")}</p>
          <ChatThread
            messages={aiThread(now)}
            self="client"
            names={names}
            mode="ai"
            aiEnabled={safeFeatures().ai}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
