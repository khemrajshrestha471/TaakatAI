import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";

import { BarsChart } from "@/components/shared/charts";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { mrrByMonth, revenueByProvider } from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("superAdmin.nav.revenue") };
}

export default async function RevenuePage() {
  const t = await getTranslations("admin.revenue");
  const ts = await getTranslations("shared");
  const format = await getFormatter();
  const mrr = mrrByMonth(new Date());
  const current = mrr.at(-1)?.value ?? 0;
  const previous = mrr.at(-2)?.value ?? current;
  const growth = previous ? (current - previous) / previous : 0;
  const npr = (v: number) =>
    format.number(v, { style: "currency", currency: "NPR", maximumFractionDigits: 0 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label={t("mrr")} value={npr(current)} icon={Wallet} />
        <StatCard label={t("arr")} value={npr(current * 12)} />
        <StatCard
          label={t("growth")}
          value={format.number(growth, {
            style: "percent",
            maximumFractionDigits: 1,
            signDisplay: "exceptZero",
          })}
          icon={TrendingUp}
        />
        <StatCard
          label={t("churn")}
          value={format.number(0.021, { style: "percent", maximumFractionDigits: 1 })}
          icon={TrendingDown}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
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
        <SectionCard title={t("byProviderTitle")} description={t("byProviderHint")}>
          <BarsChart
            layout="horizontal"
            data={revenueByProvider.map((r) => ({
              provider: ts(`providers.${r.provider}`),
              value: r.value,
            }))}
            xKey="provider"
            xLabel={t("provider")}
            xFormat="category"
            unit="NPR"
            ariaLabel={t("byProviderTitle")}
            tableLabel={ts("viewTable")}
            series={[{ key: "value", label: t("mrr"), color: 2 }]}
          />
        </SectionCard>
      </div>
    </div>
  );
}
