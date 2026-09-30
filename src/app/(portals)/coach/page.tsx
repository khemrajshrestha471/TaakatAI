import {
  AlertTriangle,
  CalendarClock,
  ClipboardCheck,
  Hourglass,
  MessageCircle,
  UserPlus,
  Users,
  Video,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

import { BarsChart } from "@/components/shared/charts";
import { MinorBadge } from "@/components/shared/minor-badge";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  coachClients,
  formChecks,
  isAtRisk,
  localized,
  pendingCheckIns,
  priorityQueue,
  revenueByMonth,
  upcomingCalls,
  type QueueItem,
} from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("coach.nav.dashboard") };
}

const queueMeta: Record<QueueItem["kind"], { icon: LucideIcon; href: string }> = {
  checkIn: { icon: ClipboardCheck, href: "/coach/check-ins" },
  formCheck: { icon: Video, href: "/coach/form-checks" },
  message: { icon: MessageCircle, href: "/coach/clients" },
  atRisk: { icon: AlertTriangle, href: "/coach/clients" },
  application: { icon: UserPlus, href: "/coach/clients" },
  expiring: { icon: Hourglass, href: "/coach/payments" },
};

const priorityTone = { high: "critical", medium: "warning", low: "neutral" } as const;

export default async function CoachDashboardPage() {
  const t = await getTranslations("coach.dashboard");
  const ts = await getTranslations("shared");
  const format = await getFormatter();
  const locale = await getLocale();
  const now = new Date();

  const active = coachClients.filter((c) => c.status === "active");
  const atRisk = coachClients.filter(isAtRisk);
  const revenue = revenueByMonth(now);
  const thisMonth = revenue.at(-1)?.value ?? 0;
  const npr = (v: number) =>
    format.number(v, { style: "currency", currency: "NPR", maximumFractionDigits: 0 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label={t("activeClients")} value={format.number(active.length)} icon={Users} />
        <StatCard
          label={t("checkInsPending")}
          value={format.number(pendingCheckIns(now).length)}
          icon={ClipboardCheck}
          tone="attention"
        />
        <StatCard
          label={t("formChecksPending")}
          value={format.number(formChecks(now).filter((f) => f.status !== "reviewed").length)}
          icon={Video}
          tone="attention"
        />
        <StatCard label={t("unread")} value={format.number(4)} icon={MessageCircle} />
        <StatCard label={t("atRisk")} value={format.number(atRisk.length)} icon={AlertTriangle} />
        <StatCard label={t("revenueMonth")} value={npr(thisMonth)} icon={Wallet} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <SectionCard title={t("queueTitle")} description={t("queueHint")}>
          <ol className="divide-y">
            {priorityQueue(now).map((item) => {
              const { icon: Icon, href } = queueMeta[item.kind];
              return (
                <li key={item.id}>
                  <Link
                    href={href}
                    className="flex min-h-14 items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                        {t(`queue.${item.kind}`, { name: item.client })}
                        {item.isMinor && <MinorBadge />}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format.relativeTime(new Date(item.at), now)}
                      </p>
                    </div>
                    <StatusBadge tone={priorityTone[item.priority]}>
                      {ts(`priority.${item.priority}`)}
                    </StatusBadge>
                  </Link>
                </li>
              );
            })}
          </ol>
        </SectionCard>

        <div className="flex flex-col gap-6">
          <SectionCard title={t("callsTitle")}>
            <ul className="divide-y">
              {upcomingCalls(now)
                .filter((c) => c.status === "confirmed")
                .map((c) => (
                  <li key={c.id} className="flex items-center gap-3 py-2">
                    <CalendarClock className="size-5 shrink-0 text-primary" aria-hidden />
                    <div className="flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                        {c.client} {c.isMinor && <MinorBadge />}
                      </p>
                      <p className="text-xs text-muted-foreground">{localized(c.topic, locale)}</p>
                    </div>
                    <p className="text-right text-xs text-muted-foreground">
                      {format.dateTime(new Date(c.at), {
                        weekday: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </li>
                ))}
            </ul>
          </SectionCard>

          <SectionCard title={t("atRiskTitle")} description={t("atRiskHint")}>
            <ul className="divide-y">
              {atRisk.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {t("atRiskReason", {
                      adherence: format.number(c.adherence),
                      days: c.lastCheckInDays ?? 0,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>

      <SectionCard title={t("revenueTitle")} description={t("revenueHint")}>
        <BarsChart
          data={revenue}
          xKey="month"
          xLabel={ts("month")}
          xFormat="month"
          unit="NPR"
          ariaLabel={t("revenueTitle")}
          tableLabel={ts("viewTable")}
          series={[{ key: "value", label: t("revenue"), color: 1 }]}
        />
      </SectionCard>
    </div>
  );
}
