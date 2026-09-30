import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { dietTemplates, exercises, guardianView, localized } from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("guardian.nav.plans") };
}

/** The minor's youth program: technique, habits and performance — no weight-cut work. */
const youthDays = [
  {
    name: { en: "Day 1 — Lower body", ne: "दिन १ — तल्लो शरीर" },
    items: ["squat", "lunge", "calf"],
  },
  {
    name: { en: "Day 2 — Upper body", ne: "दिन २ — माथिल्लो शरीर" },
    items: ["bench", "row", "ohp"],
  },
  {
    name: { en: "Day 3 — Full body & core", ne: "दिन ३ — पूरा शरीर र कोर" },
    items: ["rdl", "pulldown", "plank"],
  },
] as const;

export default async function GuardianPlansPage() {
  const t = await getTranslations("guardian.plans");
  const ts = await getTranslations("shared");
  const format = await getFormatter();
  const locale = await getLocale();
  const diet = dietTemplates.find((d) => d.id === "d4");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle", { name: guardianView.minor.name })}
      />

      <p className="flex items-start gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-chart-3" aria-hidden />
        {t("youthSafe")}
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title={t("program")} description={localized(guardianView.program, locale)}>
          <ol className="flex flex-col gap-3">
            {youthDays.map((d) => (
              <li key={d.name.en} className="rounded-lg border p-3">
                <p className="mb-1 font-medium">{localized(d.name, locale)}</p>
                <p className="text-sm text-muted-foreground">
                  {d.items.map((k) => localized(exercises[k], locale)).join(" · ")}
                </p>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard title={t("diet")} description={localized(guardianView.diet, locale)}>
          {diet && (
            <dl className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-muted p-3">
                <dt className="text-xs text-muted-foreground">{ts("kcal")}</dt>
                <dd className="font-semibold tabular-nums">{format.number(diet.kcal)}</dd>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <dt className="text-xs text-muted-foreground">{ts("protein")}</dt>
                <dd className="font-semibold tabular-nums">
                  {format.number(diet.protein)} {ts("g")}
                </dd>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <dt className="text-xs text-muted-foreground">{t("meals")}</dt>
                <dd className="font-semibold tabular-nums">{format.number(diet.meals)}</dd>
              </div>
            </dl>
          )}
          <p className="text-sm text-muted-foreground">{t("dietNote")}</p>
        </SectionCard>
      </div>
    </div>
  );
}
