import { Camera, Trophy } from "lucide-react";
import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { TrendChart } from "@/components/shared/charts";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  checkInHistory,
  demoClient,
  exercises,
  localized,
  measurements,
  personalRecords,
  strengthSeries,
  weightSeries,
} from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("client.nav.progress") };
}

export default async function ProgressPage() {
  const t = await getTranslations("client.progress");
  const ts = await getTranslations("shared");
  const format = await getFormatter();
  const locale = await getLocale();
  const now = new Date();

  const weights = weightSeries(now);
  const latest = weights.at(-1)?.average ?? demoClient.startWeight;
  const lost = demoClient.startWeight - latest;
  const history = checkInHistory(now);
  const avgAdherence = Math.round(
    history.reduce((a, c) => a + (c.training + c.diet) / 2, 0) / history.length,
  );
  const kg = (n: number) => `${format.number(n, { maximumFractionDigits: 1 })} ${ts("kg")}`;
  const cm = (n: number) => `${format.number(n, { maximumFractionDigits: 1 })} ${ts("cm")}`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label={t("start")} value={kg(demoClient.startWeight)} />
        <StatCard label={t("current")} value={kg(latest)} hint={t("sevenDayAvg")} />
        <StatCard label={t("change")} value={`−${kg(lost)}`} tone="attention" />
        <StatCard
          label={t("adherence")}
          value={`${format.number(avgAdherence)}%`}
          hint={t("last8")}
        />
      </div>

      <SectionCard title={t("weightTitle")} description={t("weightHint")}>
        <TrendChart
          data={weights}
          xKey="date"
          xLabel={ts("date")}
          xFormat="day"
          unit={ts("kg")}
          ariaLabel={t("weightTitle")}
          tableLabel={ts("viewTable")}
          series={[
            { key: "weight", label: t("daily"), color: "muted", dotsOnly: true },
            { key: "average", label: t("average"), color: 1 },
          ]}
        />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title={t("strengthTitle")} description={t("strengthHint")}>
          <TrendChart
            data={strengthSeries()}
            xKey="week"
            xLabel={ts("week")}
            xFormat="week"
            xPrefix={ts("week")}
            unit={ts("kg")}
            height={240}
            ariaLabel={t("strengthTitle")}
            tableLabel={ts("viewTable")}
            series={[
              { key: "squat", label: localized(exercises.squat, locale), color: 1 },
              { key: "bench", label: localized(exercises.bench, locale), color: 2 },
              { key: "deadlift", label: localized(exercises.deadlift, locale), color: 3 },
            ]}
          />
        </SectionCard>

        <SectionCard title={t("measurementsTitle")}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("area")}</TableHead>
                <TableHead className="text-right">{t("start")}</TableHead>
                <TableHead className="text-right">{t("current")}</TableHead>
                <TableHead className="text-right">{t("change")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {measurements.map((m) => (
                <TableRow key={m.key}>
                  <TableCell>{t(`areas.${m.key}`)}</TableCell>
                  <TableCell className="text-right tabular-nums">{cm(m.start)}</TableCell>
                  <TableCell className="text-right tabular-nums">{cm(m.current)}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {format.number(m.current - m.start, {
                      signDisplay: "exceptZero",
                      maximumFractionDigits: 1,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title={t("prsTitle")}>
          <ul className="divide-y">
            {personalRecords(now).map((pr) => (
              <li key={pr.exercise} className="flex items-center gap-3 py-3">
                <Trophy className="size-5 shrink-0 text-chart-3" aria-hidden />
                <div className="flex-1">
                  <p className="font-medium">{localized(exercises[pr.exercise], locale)}</p>
                  <p className="text-xs text-muted-foreground">
                    {format.dateTime(new Date(pr.date), { day: "numeric", month: "short" })}
                  </p>
                </div>
                <p className="font-semibold tabular-nums">
                  {kg(pr.weight)} × {format.number(pr.reps)}
                </p>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title={t("photosTitle")} description={t("photosHint")}>
          <div className="grid grid-cols-3 gap-2" aria-hidden>
            {[t("front"), t("side"), t("back")].map((pose) => (
              <div
                key={pose}
                className="flex aspect-3/4 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-xs text-muted-foreground"
              >
                <Camera className="size-5" />
                {pose}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{t("photosPrivacy")}</p>
        </SectionCard>
      </div>

      <section id="check-ins" className="scroll-mt-20">
        <SectionCard title={t("checkInsTitle")} description={t("checkInsHint")}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("weekOf")}</TableHead>
                <TableHead className="text-right">{t("weight")}</TableHead>
                <TableHead className="text-right">{t("training")}</TableHead>
                <TableHead className="text-right">{t("diet")}</TableHead>
                <TableHead>{t("status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((c) => (
                <TableRow key={c.weekOf}>
                  <TableCell>
                    {format.dateTime(new Date(c.weekOf), { day: "numeric", month: "short" })}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{kg(c.weight)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {format.number(c.training)}%
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {format.number(c.diet)}%
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={c.status === "reviewed" ? "good" : "warning"}>
                      {ts(`checkInStatus.${c.status}`)}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </section>
    </div>
  );
}
