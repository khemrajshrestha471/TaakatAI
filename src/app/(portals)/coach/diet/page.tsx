import { Plus, Sparkles, Utensils } from "lucide-react";
import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { PendingAction } from "@/components/shared/pending-action";
import { SectionCard } from "@/components/shared/section-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dietTemplates, foods, localized } from "@/features/demo/data";
import { MacroCalculator } from "@/features/diet/components/macro-calculator";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("coach.nav.diet") };
}

export default async function CoachDietPage() {
  const t = await getTranslations("coach.diet");
  const ts = await getTranslations("shared");
  const format = await getFormatter();
  const locale = await getLocale();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <>
            <PendingAction variant="outline" className="h-11">
              <Sparkles aria-hidden /> {t("generateAi")}
            </PendingAction>
            <PendingAction className="h-11">
              <Plus aria-hidden /> {t("newPlan")}
            </PendingAction>
          </>
        }
      />

      <SectionCard title={t("calculatorTitle")} description={t("calculatorHint")}>
        <MacroCalculator />
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <SectionCard title={t("templatesTitle")}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("plan")}</TableHead>
                  <TableHead className="text-right">{ts("kcal")}</TableHead>
                  <TableHead className="text-right">{ts("protein")}</TableHead>
                  <TableHead className="text-right">{t("meals")}</TableHead>
                  <TableHead className="text-right">{t("clients")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dietTemplates.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{localized(d.name, locale)}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {format.number(d.kcal)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {format.number(d.protein)} {ts("g")}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {format.number(d.meals)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {format.number(d.clients)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard title={t("foodDbTitle")} description={t("foodDbHint")}>
          <ul className="flex flex-wrap gap-2">
            {Object.values(foods).map((f) => (
              <li
                key={f.en}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm"
              >
                <Utensils className="size-3.5 text-muted-foreground" aria-hidden />
                {localized(f, locale)}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
