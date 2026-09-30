import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AiKillSwitch } from "@/features/admin/components/ai-kill-switch";
import { aiUsageByWorkspace } from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("superAdmin.nav.aiUsage") };
}

export default async function AiUsagePage() {
  const t = await getTranslations("admin.aiUsage");
  const format = await getFormatter();
  const tokens = (n: number) => format.number(n, { notation: "compact", maximumFractionDigits: 1 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <AiKillSwitch />
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("workspace")}</TableHead>
              <TableHead className="text-right">{t("checkIns")}</TableHead>
              <TableHead className="text-right">{t("formChecks")}</TableHead>
              <TableHead className="text-right">{t("chat")}</TableHead>
              <TableHead className="text-right">{t("cost")}</TableHead>
              <TableHead className="w-48">{t("credits")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aiUsageByWorkspace.map((w) => (
              <TableRow key={w.workspace}>
                <TableCell className="font-medium">{w.workspace}</TableCell>
                <TableCell className="text-right tabular-nums">{tokens(w.checkIns)}</TableCell>
                <TableCell className="text-right tabular-nums">{tokens(w.formChecks)}</TableCell>
                <TableCell className="text-right tabular-nums">{tokens(w.chat)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {format.number(w.costUsd, { style: "currency", currency: "USD" })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={w.credits * 100} className="h-1.5" aria-label={t("credits")} />
                    <span className="w-10 text-right text-xs tabular-nums">
                      {format.number(w.credits, { style: "percent" })}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">{t("note")}</p>
    </div>
  );
}
