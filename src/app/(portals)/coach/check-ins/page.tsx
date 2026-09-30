import { Camera, CheckCheck, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { MinorBadge } from "@/components/shared/minor-badge";
import { PageHeader } from "@/components/shared/page-header";
import { PendingAction } from "@/components/shared/pending-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReplyBox } from "@/features/checkins/components/reply-box";
import { localized, pendingCheckIns } from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("coach.nav.checkIns") };
}

export default async function CheckInsPage() {
  const t = await getTranslations("coach.checkIns");
  const ts = await getTranslations("shared");
  const format = await getFormatter();
  const locale = await getLocale();
  const now = new Date();
  const items = pendingCheckIns(now);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={t("subtitle", { count: items.length })} />

      {items.map((c) => {
        const stats = [
          {
            label: t("weight"),
            value: `${format.number(c.weight)} ${ts("kg")}`,
            hint: `${format.number(c.weightChange, { signDisplay: "exceptZero" })} ${ts("kg")}`,
          },
          { label: t("training"), value: `${format.number(c.training)}%` },
          { label: t("diet"), value: `${format.number(c.diet)}%` },
          { label: t("sleep"), value: t("hours", { value: c.sleep }) },
          { label: t("energy"), value: `${format.number(c.energy)}/5` },
        ];
        return (
          <Card key={c.id}>
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="font-sans text-lg font-semibold">{c.client}</CardTitle>
                {c.isMinor && <MinorBadge />}
              </div>
              <p className="text-sm text-muted-foreground">
                {t("submitted", { when: format.relativeTime(new Date(c.submittedAt), now) })}
              </p>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-2" aria-label={t("photos")}>
                  {[t("start"), t("lastWeek"), t("thisWeek")].map((label) => (
                    <div
                      key={label}
                      className="flex aspect-3/4 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground"
                    >
                      {c.isMinor ? (
                        <ShieldCheck className="size-5" aria-hidden />
                      ) : (
                        <Camera className="size-5" aria-hidden />
                      )}
                      {label}
                    </div>
                  ))}
                </div>
                {c.isMinor && <p className="text-xs text-muted-foreground">{t("minorPhotos")}</p>}
                <dl className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {stats.map((s) => (
                    <div key={s.label} className="rounded-lg bg-muted p-2">
                      <dt className="text-xs text-muted-foreground">{s.label}</dt>
                      <dd className="font-semibold tabular-nums">{s.value}</dd>
                      {s.hint && <dd className="text-xs text-muted-foreground">{s.hint}</dd>}
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex flex-col gap-4">
                <section className="rounded-lg border p-4">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="size-4 text-primary" aria-hidden /> {t("aiSummary")}
                  </h3>
                  <p className="text-sm text-muted-foreground">{localized(c.aiSummary, locale)}</p>
                </section>
                <section className="rounded-lg border-l-4 border-primary bg-primary/5 p-4">
                  <h3 className="mb-1 text-sm font-semibold">{t("suggestion")}</h3>
                  <p className="mb-3 text-sm">{localized(c.suggestion, locale)}</p>
                  <PendingAction variant="outline" className="h-10">
                    <CheckCheck aria-hidden /> {t("apply")}
                  </PendingAction>
                </section>
                <ReplyBox id={c.id} placeholder={t("replyPlaceholder", { name: c.client })} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
