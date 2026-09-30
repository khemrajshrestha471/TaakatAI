import { Check, Minus, Pencil } from "lucide-react";
import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { PendingAction } from "@/components/shared/pending-action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { saasPlans, TRIAL_DAYS } from "@/config/plans";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("superAdmin.nav.plans") };
}

function Flag({ on, label }: { on: boolean; label: string }) {
  return on ? (
    <Check className="size-4 text-success" aria-label={label} />
  ) : (
    <Minus className="size-4 text-muted-foreground" aria-label={label} />
  );
}

export default async function PlansPage() {
  const t = await getTranslations("admin.plans");
  const tp = await getTranslations("plans");
  const format = await getFormatter();
  const limit = (n: number | null) => (n === null ? t("unlimited") : format.number(n));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={t("subtitle", { days: TRIAL_DAYS })} />
      <p className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
        {t("placeholderPrices")}
      </p>
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("plan")}</TableHead>
              <TableHead className="text-right">NPR</TableHead>
              <TableHead className="text-right">USD</TableHead>
              <TableHead className="text-right">{t("coaches")}</TableHead>
              <TableHead className="text-right">{t("clients")}</TableHead>
              <TableHead className="text-right">{t("branches")}</TableHead>
              <TableHead className="text-right">{t("storage")}</TableHead>
              <TableHead className="text-right">{t("aiCredits")}</TableHead>
              <TableHead>{t("branding")}</TableHead>
              <TableHead>{t("subdomain")}</TableHead>
              <TableHead>{t("support")}</TableHead>
              <TableHead>
                <span className="sr-only">{t("edit")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {saasPlans.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{tp(`${p.id}.name`)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {format.number(p.monthly.npr)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {format.number(p.monthly.usd)}
                </TableCell>
                <TableCell className="text-right tabular-nums">{limit(p.limits.coaches)}</TableCell>
                <TableCell className="text-right tabular-nums">{limit(p.limits.clients)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {limit(p.limits.branches)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {format.number(p.limits.storageGb)} GB
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {format.number(p.limits.aiCredits)}
                </TableCell>
                <TableCell>
                  <Flag on={p.features.customBranding} label={t("branding")} />
                </TableCell>
                <TableCell>
                  <Flag on={p.features.customSubdomain} label={t("subdomain")} />
                </TableCell>
                <TableCell>
                  <Flag on={p.features.prioritySupport} label={t("support")} />
                </TableCell>
                <TableCell>
                  <PendingAction
                    variant="ghost"
                    size="icon"
                    className="size-10"
                    aria-label={t("edit")}
                  >
                    <Pencil aria-hidden />
                  </PendingAction>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
