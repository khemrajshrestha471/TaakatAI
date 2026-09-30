import { CreditCard, Download } from "lucide-react";
import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { PendingAction } from "@/components/shared/pending-action";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { guardianInvoices, localized } from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("guardian.nav.payments") };
}

export default async function GuardianPaymentsPage() {
  const t = await getTranslations("guardian.payments");
  const ts = await getTranslations("shared");
  const format = await getFormatter();
  const locale = await getLocale();
  const now = new Date();
  const renewal = new Date(now.getTime() + 64 * 86_400_000);
  const money = (amount: number, currency: string) =>
    format.number(amount, { style: "currency", currency, maximumFractionDigits: 0 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <SectionCard title={t("current")}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-3xl tracking-wide">{t("package")}</p>
            <p className="text-sm text-muted-foreground">
              {t("renews", {
                date: format.dateTime(renewal, { day: "numeric", month: "long", year: "numeric" }),
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["khalti", "esewa"] as const).map((p) => (
              <PendingAction key={p} className="h-11">
                <CreditCard aria-hidden /> {t("payWith", { provider: ts(`providers.${p}`) })}
              </PendingAction>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title={t("invoices")}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("invoice")}</TableHead>
                <TableHead>{t("item")}</TableHead>
                <TableHead className="text-right">{t("amount")}</TableHead>
                <TableHead>{t("method")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>
                  <span className="sr-only">{t("download")}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guardianInvoices(now).map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell>{localized(i.period, locale)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {money(i.amount, i.currency)}
                  </TableCell>
                  <TableCell>{ts(`providers.${i.provider}`)}</TableCell>
                  <TableCell>
                    <StatusBadge tone="good">{ts(`paymentStatus.${i.status}`)}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <PendingAction
                      variant="ghost"
                      size="icon"
                      className="size-10"
                      aria-label={t("download")}
                    >
                      <Download aria-hidden />
                    </PendingAction>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
