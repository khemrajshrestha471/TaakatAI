import { ClipboardCheck, Dumbbell, ShieldCheck, ShieldOff, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { PendingAction } from "@/components/shared/pending-action";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import { guardianView } from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("guardian.nav.overview") };
}

export default async function GuardianOverviewPage() {
  const t = await getTranslations("guardian.overview");
  const ts = await getTranslations("shared");
  const format = await getFormatter();
  const { minor, consents, trainingThisWeek } = guardianView;

  const consentRows = [
    { key: "coaching", granted: consents.coaching },
    { key: "healthData", granted: consents.healthData },
    { key: "photos", granted: consents.photos },
    { key: "ai", granted: consents.ai },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("title", { name: guardianView.guardianName.split(" ")[0] ?? "" })}
        description={t("subtitle", { name: minor.name })}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label={t("athlete")}
          value={minor.name.split(" ")[0] ?? ""}
          hint={t("age", { age: minor.age })}
          icon={UserRound}
        />
        <StatCard
          label={t("coach")}
          value={minor.coach.split(" ")[0] ?? ""}
          hint={ts(`goals.${minor.goal}`)}
          icon={ShieldCheck}
        />
        <StatCard
          label={t("training")}
          value={`${format.number(trainingThisWeek.done)}/${format.number(trainingThisWeek.planned)}`}
          hint={t("sessionsThisWeek")}
          icon={Dumbbell}
        />
        <StatCard
          label={t("checkIn")}
          value={ts(`checkInStatus.${guardianView.checkInStatus}`)}
          hint={t("thisWeek")}
          icon={ClipboardCheck}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title={t("consentsTitle")} description={t("consentsHint")}>
          <ul className="divide-y">
            {consentRows.map((c) => (
              <li key={c.key} className="flex items-center justify-between gap-2 py-3 text-sm">
                <span>{t(`consents.${c.key}`)}</span>
                <StatusBadge tone={c.granted ? "good" : "neutral"}>
                  {c.granted ? t("granted") : t("notGranted")}
                </StatusBadge>
              </li>
            ))}
          </ul>
          <PendingAction variant="destructive" className="h-11 w-fit">
            <ShieldOff aria-hidden /> {t("revoke")}
          </PendingAction>
          <p className="text-xs text-muted-foreground">{t("revokeHint")}</p>
        </SectionCard>

        <SectionCard title={t("weekTitle")}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span>{t("sessions")}</span>
              <span className="tabular-nums">
                {format.number(trainingThisWeek.done)} / {format.number(trainingThisWeek.planned)}
              </span>
            </div>
            <Progress
              value={(trainingThisWeek.done / trainingThisWeek.planned) * 100}
              aria-label={t("sessions")}
            />
          </div>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>• {t("safeguard1")}</li>
            <li>• {t("safeguard2")}</li>
            <li>• {t("safeguard3")}</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
