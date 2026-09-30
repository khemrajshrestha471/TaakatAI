import { CalendarRange, Plus, Sparkles, Users } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { PendingAction } from "@/components/shared/pending-action";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currentProgram, exercises, localized, programTemplates } from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("coach.nav.programs") };
}

export default async function ProgramsPage() {
  const t = await getTranslations("coach.programs");
  const locale = await getLocale();
  const preview = currentProgram.days[0];

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
              <Plus aria-hidden /> {t("newProgram")}
            </PendingAction>
          </>
        }
      />

      <p className="flex items-start gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        {t("aiRule")}
      </p>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {programTemplates.map((p) => (
          <li key={p.id}>
            <Card size="sm" className="h-full">
              <CardHeader>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{t(`levels.${p.level}`)}</Badge>
                  {p.createdBy === "ai" && <StatusBadge tone="info">{t("aiDraft")}</StatusBadge>}
                </div>
                <CardTitle className="font-sans text-base font-semibold">
                  {localized(p.name, locale)}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarRange className="size-4" aria-hidden />
                  {t("structure", { weeks: p.weeks, days: p.daysPerWeek })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-4" aria-hidden />
                  {t("clientsUsing", { count: p.clients })}
                </span>
                <span className="w-full text-xs">{t("updated", { count: p.updatedDays })}</span>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <SectionCard
        title={t("previewTitle", { name: localized(preview.name, locale) })}
        description={`${localized(currentProgram.name, locale)} · ${t("version", { version: 5 })}`}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("exercise")}</TableHead>
                <TableHead className="text-right">{t("sets")}</TableHead>
                <TableHead className="text-right">{t("reps")}</TableHead>
                <TableHead className="text-right">RPE</TableHead>
                <TableHead className="text-right">{t("rest")}</TableHead>
                <TableHead>{t("tempo")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.exercises.map((e) => (
                <TableRow key={e.key}>
                  <TableCell className="font-medium">
                    {localized(exercises[e.key], locale)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{e.sets}</TableCell>
                  <TableCell className="text-right tabular-nums">{e.reps}</TableCell>
                  <TableCell className="text-right tabular-nums">{e.rpe}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {t("seconds", { value: e.restSec })}
                  </TableCell>
                  <TableCell>{e.tempo ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
