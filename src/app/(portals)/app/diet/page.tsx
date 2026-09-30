import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { dietPlan, foods, localized, mealTotals } from "@/features/demo/data";
import { DietTracker, type TrackerMeal } from "@/features/diet/components/diet-tracker";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("client.nav.diet") };
}

export default async function DietPage() {
  const t = await getTranslations("client.diet");
  const ts = await getTranslations("shared");
  const format = await getFormatter();
  const locale = await getLocale();
  const { targets } = dietPlan;

  const meals: TrackerMeal[] = dietPlan.meals.map((m) => ({
    id: m.id,
    name: localized(m.name, locale),
    time: m.time,
    totals: mealTotals(m),
    swap: m.swap ? localized(m.swap, locale) : undefined,
    items: m.items.map((i) => ({
      name: localized(foods[i.food], locale),
      qty: localized(i.qty, locale),
      kcal: i.kcal,
      protein: i.protein,
    })),
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("title")}
        description={t("targets", {
          kcal: format.number(targets.kcal),
          protein: format.number(targets.protein),
          carbs: format.number(targets.carbs),
          fat: format.number(targets.fat),
          unit: ts("g"),
        })}
      />
      <DietTracker
        meals={meals}
        targets={targets}
        supplements={dietPlan.supplements.map((s) => ({
          id: s.id,
          name: localized(s.name, locale),
        }))}
      />
      <p className="text-xs text-muted-foreground">{t("estimateNote")}</p>
    </div>
  );
}
