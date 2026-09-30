import { Bot, Building2, Hourglass, Wallet } from "lucide-react";
import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";

import { BarsChart } from "@/components/shared/charts";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { aiUsageByWorkspace, mrrByMonth, workspaces } from "@/features/demo/data";
import { safeFeatures } from "@/lib/features";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("superAdmin.nav.overview") };
}

export default async function SuperAdminOverviewPage() {
  const t = await getTranslations("admin.overview");
  const ts = await getTranslations("shared");
  const format = await getFormatter();
  const now = new Date();
  const mrr = mrrByMonth(now);
  const features = safeFeatures();
  const aiCost = aiUsageByWorkspace.reduce((a, w) => a + w.costUsd, 0);
  const npr = (v: number) =>
    format.number(v, { style: "currency", currency: "NPR", maximumFractionDigits: 0 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label={t("workspaces")}
          value={format.number(workspaces.length)}
          icon={Building2}
        />
        <StatCard label={t("mrr")} value={npr(mrr.at(-1)?.value ?? 0)} icon={Wallet} />
        <StatCard
          label={t("trials")}
          value={format.number(workspaces.filter((w) => w.status === "trial").length)}
          icon={Hourglass}
        />
        <StatCard
          label={t("aiCost")}
          value={format.number(aiCost, { style: "currency", currency: "USD" })}
          icon={Bot}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <SectionCard title={t("mrrTitle")}>
          <BarsChart
            data={mrr}
            xKey="month"
            xLabel={ts("month")}
            xFormat="month"
            unit="NPR"
            ariaLabel={t("mrrTitle")}
            tableLabel={ts("viewTable")}
            series={[{ key: "value", label: t("mrr"), color: 1 }]}
          />
        </SectionCard>

        <SectionCard title={t("integrationsTitle")} description={t("integrationsHint")}>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Object.entries(features).map(([name, enabled]) => (
              <li
                key={name}
                className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <span>{t(`integrations.${name as keyof typeof features}`)}</span>
                <StatusBadge tone={enabled ? "good" : "neutral"}>
                  {enabled ? t("enabled") : t("disabled")}
                </StatusBadge>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
