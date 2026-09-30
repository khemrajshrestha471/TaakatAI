import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { TrendChart } from "@/components/shared/charts";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { exercises, guardianView, localized, youthStrength } from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("guardian.nav.progress") };
}

export default async function GuardianProgressPage() {
  const t = await getTranslations("guardian.progress");
  const ts = await getTranslations("shared");
  const format = await getFormatter();
  const locale = await getLocale();
  const data = youthStrength();
  const first = data[0];
  const last = data.at(-1);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle", { name: guardianView.minor.name })}
      />

      {first && last && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatCard
            label={t("squatGain")}
            value={`+${format.number(last.squat - first.squat, { maximumFractionDigits: 1 })} ${ts("kg")}`}
            hint={t("sinceStart")}
          />
          <StatCard
            label={t("pushups")}
            value={format.number(last.pushups)}
            hint={t("fromReps", { value: format.number(first.pushups) })}
          />
          <StatCard label={t("attendance")} value={`${format.number(88)}%`} hint={t("last8")} />
        </div>
      )}

      <SectionCard
        title={t("chartTitle", { exercise: localized(exercises.squat, locale) })}
        description={t("chartHint")}
      >
        <TrendChart
          data={data}
          xKey="week"
          xLabel={ts("week")}
          xFormat="week"
          xPrefix={ts("week")}
          unit={ts("kg")}
          height={240}
          ariaLabel={t("chartTitle", { exercise: localized(exercises.squat, locale) })}
          tableLabel={ts("viewTable")}
          series={[{ key: "squat", label: localized(exercises.squat, locale), color: 1 }]}
        />
      </SectionCard>

      <p className="text-sm text-muted-foreground">{t("photosNote")}</p>
    </div>
  );
}
