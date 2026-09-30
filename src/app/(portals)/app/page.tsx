import {
  ArrowRight,
  Camera,
  ClipboardCheck,
  Flame,
  MessageCircle,
  MessageCircleQuestion,
  Scale,
  Target,
} from "lucide-react";
import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  coachThread,
  currentProgram,
  demoClient,
  dietPlan,
  exercises,
  localized,
  weightSeries,
} from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("client.nav.home") };
}

export default async function ClientHomePage() {
  const t = await getTranslations("client.home");
  const ts = await getTranslations("shared");
  const format = await getFormatter();
  const locale = await getLocale();
  const now = new Date();

  const weights = weightSeries(now);
  const current = weights.at(-1)?.average ?? demoClient.startWeight;
  const toGo = Math.max(0, current - demoClient.targetWeight);
  const daysToCheckIn = (demoClient.checkInDay - now.getDay() + 7) % 7;
  const today = currentProgram.days[0];
  const lastCoachMessage = coachThread(now).findLast((m) => m.from === "coach");

  const eaten = { kcal: 1240, protein: 96, carbs: 120, fat: 31 };
  const { targets } = dietPlan;
  const macros = [
    { label: ts("protein"), value: eaten.protein, target: targets.protein },
    { label: ts("carbs"), value: eaten.carbs, target: targets.carbs },
    { label: ts("fat"), value: eaten.fat, target: targets.fat },
  ];

  const quickActions = [
    { href: "/app/progress", icon: Scale, label: t("actionWeight") },
    { href: "/app/train", icon: Camera, label: t("actionFormVideo") },
    { href: "/app/chat", icon: MessageCircleQuestion, label: t("actionAsk") },
    { href: "/app/progress#check-ins", icon: ClipboardCheck, label: t("actionCheckIn") },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("greeting", { name: demoClient.name.split(" ")[0] ?? "" })}
        description={format.dateTime(now, { weekday: "long", day: "numeric", month: "long" })}
      />

      <Link
        href="/app/progress#check-ins"
        className="flex items-center gap-4 rounded-xl border border-primary/40 bg-primary/10 p-4 transition-colors hover:bg-primary/15"
      >
        <ClipboardCheck className="size-6 shrink-0 text-primary" aria-hidden />
        <div className="flex-1">
          <p className="font-semibold">
            {daysToCheckIn === 0
              ? t("checkInDueToday")
              : t("checkInDueIn", { days: daysToCheckIn })}
          </p>
          <p className="text-sm text-muted-foreground">{t("checkInHint")}</p>
        </div>
        <ArrowRight className="size-5 shrink-0" aria-hidden />
      </Link>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label={t("streak")}
          value={t("days", { count: demoClient.streakDays })}
          icon={Flame}
        />
        <StatCard
          label={t("weight")}
          value={`${format.number(current, { maximumFractionDigits: 1 })} ${ts("kg")}`}
          hint={t("sevenDayAvg")}
          icon={Scale}
        />
        <StatCard
          label={t("toGoal")}
          value={`${format.number(toGo, { maximumFractionDigits: 1 })} ${ts("kg")}`}
          hint={t("target", { value: format.number(demoClient.targetWeight) })}
          icon={Target}
        />
        <StatCard
          label={t("unread")}
          value={format.number(demoClient.unreadMessages)}
          icon={MessageCircle}
          tone="attention"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title={t("todayWorkout")}
          description={`${localized(today.name, locale)} · ${localized(today.focus, locale)}`}
        >
          <ul className="divide-y">
            {today.exercises.slice(0, 4).map((ex) => (
              <li key={ex.key} className="flex items-center justify-between py-2 text-sm">
                <span>{localized(exercises[ex.key], locale)}</span>
                <span className="text-muted-foreground tabular-nums">
                  {t("setsReps", { sets: ex.sets, reps: ex.reps })}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            {t("moreExercises", { count: today.exercises.length - 4 })}
          </p>
          <Button asChild className="h-11">
            <Link href="/app/train">{t("startWorkout")}</Link>
          </Button>
        </SectionCard>

        <SectionCard
          title={t("todayNutrition")}
          description={t("kcalLeft", {
            eaten: format.number(eaten.kcal),
            target: format.number(targets.kcal),
          })}
        >
          <Progress value={(eaten.kcal / targets.kcal) * 100} aria-label={t("todayNutrition")} />
          <ul className="flex flex-col gap-3">
            {macros.map((m) => (
              <li key={m.label} className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <span>{m.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {format.number(m.value)} / {format.number(m.target)} {ts("g")}
                  </span>
                </div>
                <Progress
                  value={(m.value / m.target) * 100}
                  aria-label={m.label}
                  className="h-1.5"
                />
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="h-11">
            <Link href="/app/diet">{t("logMeal")}</Link>
          </Button>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {lastCoachMessage && (
          <SectionCard
            title={t("fromCoach", { name: demoClient.coachName })}
            description={format.relativeTime(new Date(lastCoachMessage.at), now)}
          >
            <p className="rounded-lg bg-muted p-3 text-sm">{lastCoachMessage.text}</p>
            <Button asChild variant="outline" className="h-11 w-fit">
              <Link href="/app/chat">{t("reply")}</Link>
            </Button>
          </SectionCard>
        )}
        <SectionCard title={t("quickActions")}>
          <ul className="grid grid-cols-2 gap-2">
            {quickActions.map(({ href, icon: Icon, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg border p-3 text-center text-xs font-medium hover:bg-muted"
                >
                  <Icon className="size-5 text-primary" aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
