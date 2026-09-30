import { Banknote, Plus, PlugZap } from "lucide-react";
import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { PendingAction } from "@/components/shared/pending-action";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  coachingPackages,
  localized,
  recentPayments,
  type PaymentProviderId,
} from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("coach.nav.payments") };
}

const paymentTone: Record<"paid" | "pending" | "failed" | "refunded", StatusTone> = {
  paid: "good",
  pending: "warning",
  failed: "critical",
  refunded: "neutral",
};

/**
 * Coach/gym gateways use the WORKSPACE's own credentials (entered here, stored encrypted in
 * PaymentGatewayConfig — Phase 12), not the platform env keys. Demo state: Khalti connected.
 */
const gateways: {
  id: Exclude<PaymentProviderId, "manual">;
  region: "np" | "intl";
  connected: boolean;
}[] = [
  { id: "khalti", region: "np", connected: true },
  { id: "esewa", region: "np", connected: false },
  { id: "stripe", region: "intl", connected: false },
  { id: "paypal", region: "intl", connected: false },
];

export default async function PaymentsPage() {
  const t = await getTranslations("coach.payments");
  const ts = await getTranslations("shared");
  const format = await getFormatter();
  const locale = await getLocale();
  const now = new Date();
  const money = (amount: number, currency: string) =>
    format.number(amount, { style: "currency", currency, maximumFractionDigits: 0 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <>
            <PendingAction variant="outline" className="h-11">
              <Banknote aria-hidden /> {t("recordManual")}
            </PendingAction>
            <PendingAction className="h-11">
              <Plus aria-hidden /> {t("newPackage")}
            </PendingAction>
          </>
        }
      />

      <ul className="grid gap-4 md:grid-cols-3">
        {coachingPackages.map((p) => (
          <li key={p.id}>
            <Card size="sm" className="h-full">
              <CardHeader>
                <CardTitle className="font-sans text-base font-semibold">
                  {localized(p.name, locale)}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                <p className="font-display text-3xl tracking-wide">{money(p.npr, "NPR")}</p>
                <p className="text-sm text-muted-foreground">
                  {money(p.usd, "USD")} · {t("days", { count: p.durationDays })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("activeClients", { count: p.clients })}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <SectionCard title={t("gatewaysTitle")} description={t("gatewaysHint")}>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {gateways.map((g) => (
            <li key={g.id} className="flex flex-col gap-3 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">{ts(`providers.${g.id}`)}</p>
                <StatusBadge tone={g.connected ? "good" : "neutral"}>
                  {g.connected ? t("connected") : t("notConnected")}
                </StatusBadge>
              </div>
              <p className="text-xs text-muted-foreground">{t(`regions.${g.region}`)}</p>
              <PendingAction variant={g.connected ? "outline" : "default"} className="h-10">
                <PlugZap aria-hidden /> {g.connected ? t("testConnection") : t("connect")}
              </PendingAction>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title={t("historyTitle")}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("invoice")}</TableHead>
                <TableHead>{t("client")}</TableHead>
                <TableHead className="text-right">{t("amount")}</TableHead>
                <TableHead>{t("method")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPayments(now).map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell>{p.client}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {money(p.amount, p.currency)}
                  </TableCell>
                  <TableCell>{ts(`providers.${p.provider}`)}</TableCell>
                  <TableCell>
                    <StatusBadge tone={paymentTone[p.status]}>
                      {ts(`paymentStatus.${p.status}`)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    {format.dateTime(new Date(p.at), { day: "numeric", month: "short" })}
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
