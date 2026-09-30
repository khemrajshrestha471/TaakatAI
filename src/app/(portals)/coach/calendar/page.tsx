import { CalendarClock, Check, ShieldCheck, Video, X } from "lucide-react";
import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { MinorBadge } from "@/components/shared/minor-badge";
import { PageHeader } from "@/components/shared/page-header";
import { PendingAction } from "@/components/shared/pending-action";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { localized, upcomingCalls } from "@/features/demo/data";
import { safeFeatures } from "@/lib/features";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("coach.nav.calendar") };
}

/** Weekly availability (Sunday = 0). Nepal's weekend is Saturday. */
const availability = [
  { day: 0, slots: ["07:00–09:00", "18:00–20:00"] },
  { day: 1, slots: ["07:00–09:00", "18:00–20:00"] },
  { day: 2, slots: ["18:00–20:00"] },
  { day: 3, slots: ["07:00–09:00", "18:00–20:00"] },
  { day: 4, slots: ["18:00–20:00"] },
  { day: 5, slots: ["07:00–10:00"] },
  { day: 6, slots: [] },
];

export default async function CalendarPage() {
  const t = await getTranslations("coach.calendar");
  const format = await getFormatter();
  const locale = await getLocale();
  const now = new Date();
  const calls = upcomingCalls(now);
  const videoReady = safeFeatures().videoCalls;
  // 2023-01-01 was a Sunday — used only to get localized weekday names.
  const weekday = (d: number) =>
    format.dateTime(new Date(Date.UTC(2023, 0, 1 + d, 12)), { weekday: "long" });
  const when = (iso: string) =>
    format.dateTime(new Date(iso), {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <p className="flex items-center gap-2 rounded-lg border p-3 text-sm">
        <Video className="size-4 text-primary" aria-hidden />
        {videoReady ? t("providerReady") : t("providerMissing")}
      </p>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title={t("upcoming")}>
          <ul className="divide-y">
            {calls
              .filter((c) => c.status === "confirmed")
              .map((c) => (
                <li key={c.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
                  <CalendarClock
                    className="hidden size-5 shrink-0 text-primary sm:block"
                    aria-hidden
                  />
                  <div className="flex-1">
                    <p className="flex flex-wrap items-center gap-2 font-medium">
                      {c.client} {c.isMinor && <MinorBadge />}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {when(c.at)} · {t("minutes", { count: c.durationMin })} ·{" "}
                      {localized(c.topic, locale)}
                    </p>
                    {c.isMinor && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <ShieldCheck className="size-3.5" aria-hidden /> {t("guardianNotified")}
                      </p>
                    )}
                  </div>
                  <PendingAction className="h-10 w-fit">
                    <Video aria-hidden /> {t("join")}
                  </PendingAction>
                </li>
              ))}
          </ul>
        </SectionCard>

        <SectionCard title={t("requests")}>
          <ul className="divide-y">
            {calls
              .filter((c) => c.status === "requested")
              .map((c) => (
                <li key={c.id} className="flex flex-col gap-2 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{c.client}</p>
                    <StatusBadge tone="warning">{t("pending")}</StatusBadge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("proposed", { when: when(c.at) })} · {localized(c.topic, locale)}
                  </p>
                  <div className="flex gap-2">
                    <PendingAction className="h-10">
                      <Check aria-hidden /> {t("approve")}
                    </PendingAction>
                    <PendingAction variant="outline" className="h-10">
                      <X aria-hidden /> {t("decline")}
                    </PendingAction>
                  </div>
                </li>
              ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title={t("availability")} description={t("availabilityHint")}>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {availability.map((a) => (
            <li key={a.day} className="flex flex-col gap-2 rounded-lg border p-3">
              <p className="text-sm font-semibold">{weekday(a.day)}</p>
              {a.slots.length ? (
                a.slots.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-primary/10 px-2 py-1 text-xs text-foreground tabular-nums"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">{t("unavailable")}</span>
              )}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
