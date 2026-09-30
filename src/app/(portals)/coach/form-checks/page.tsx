import { CheckCheck, PlayCircle, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { MinorBadge } from "@/components/shared/minor-badge";
import { PageHeader } from "@/components/shared/page-header";
import { PendingAction } from "@/components/shared/pending-action";
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReplyBox } from "@/features/checkins/components/reply-box";
import { exercises, formChecks, localized } from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("coach.nav.formChecks") };
}

const statusTone: Record<"uploaded" | "aiReady" | "reviewed", StatusTone> = {
  uploaded: "neutral",
  aiReady: "warning",
  reviewed: "good",
};

function timestamp(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

export default async function FormChecksPage() {
  const t = await getTranslations("coach.formChecks");
  const format = await getFormatter();
  const locale = await getLocale();
  const now = new Date();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={t("subtitle")} />

      {formChecks(now).map((f) => (
        <Card key={f.id}>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="font-sans text-lg font-semibold">
                {f.client} · {localized(exercises[f.exercise], locale)}
              </CardTitle>
              {f.isMinor && <MinorBadge />}
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge tone={statusTone[f.status]}>{t(`status.${f.status}`)}</StatusBadge>
              <span className="text-sm text-muted-foreground">
                {format.relativeTime(new Date(f.submittedAt), now)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                <PlayCircle className="size-12 text-muted-foreground" aria-hidden />
                <span className="sr-only">{t("videoPlaceholder")}</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="relative h-2 rounded-full bg-muted" aria-hidden>
                  {f.comments.map((c) => (
                    <span
                      key={c.sec}
                      className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-primary"
                      style={{ left: `${(c.sec / f.durationSec) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
                  <span>0:00</span>
                  <span>{timestamp(f.durationSec)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{t("playerNote")}</p>
            </div>

            <div className="flex flex-col gap-4">
              <section className="rounded-lg border p-4">
                <h3 className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold">
                  <Sparkles className="size-4 text-primary" aria-hidden /> {t("aiPrecheck")}
                  {f.confidence && (
                    <span className="text-xs font-normal text-muted-foreground">
                      {t("confidence", { level: t(`levels.${f.confidence}`) })}
                    </span>
                  )}
                </h3>
                {f.aiIssues.length ? (
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {f.aiIssues.map((i) => (
                      <li key={i.en}>{localized(i, locale)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("aiPending")}</p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">{t("needsReview")}</p>
              </section>

              <section className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">{t("comments")}</h3>
                {f.comments.length ? (
                  <ol className="flex flex-col gap-2">
                    {f.comments.map((c) => (
                      <li key={c.sec} className="flex gap-3 text-sm">
                        <span className="h-fit rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">
                          {timestamp(c.sec)}
                        </span>
                        {c.text}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("noComments")}</p>
                )}
              </section>

              {f.status !== "reviewed" && (
                <>
                  <ReplyBox id={f.id} placeholder={t("commentPlaceholder")} />
                  <PendingAction variant="outline" className="h-10 w-fit">
                    <CheckCheck aria-hidden /> {t("markReviewed")}
                  </PendingAction>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
