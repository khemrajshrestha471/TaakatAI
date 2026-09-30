import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Progress } from "@/components/ui/progress";
import { currentProgram, exercises, localized, type ExerciseKey } from "@/features/demo/data";
import {
  ExerciseLibrary,
  type LibraryExercise,
} from "@/features/workouts/components/exercise-library";
import { WorkoutLogger, type LoggerDay } from "@/features/workouts/components/workout-logger";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("client.nav.train") };
}

const exerciseMeta: Record<ExerciseKey, Pick<LibraryExercise, "muscle" | "equipment">> = {
  bench: { muscle: "chest", equipment: "barbell" },
  row: { muscle: "back", equipment: "barbell" },
  ohp: { muscle: "shoulders", equipment: "barbell" },
  pulldown: { muscle: "back", equipment: "cable" },
  curl: { muscle: "arms", equipment: "dumbbell" },
  pushdown: { muscle: "arms", equipment: "cable" },
  squat: { muscle: "legs", equipment: "barbell" },
  rdl: { muscle: "legs", equipment: "barbell" },
  deadlift: { muscle: "back", equipment: "barbell" },
  legPress: { muscle: "legs", equipment: "machine" },
  lunge: { muscle: "legs", equipment: "dumbbell" },
  calf: { muscle: "legs", equipment: "machine" },
  plank: { muscle: "core", equipment: "bodyweight" },
};

export default async function TrainPage() {
  const t = await getTranslations("client.train");
  const locale = await getLocale();

  const days: LoggerDay[] = currentProgram.days.map((d) => ({
    id: d.id,
    name: localized(d.name, locale),
    focus: localized(d.focus, locale),
    exercises: d.exercises.map((e) => ({ ...e, name: localized(exercises[e.key], locale) })),
  }));

  const library: LibraryExercise[] = (Object.keys(exercises) as ExerciseKey[]).map((key) => ({
    key,
    name: localized(exercises[key], locale),
    ...exerciseMeta[key],
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={localized(currentProgram.name, locale)} />

      <div className="flex flex-col gap-2 rounded-xl border bg-card p-4">
        <div className="flex justify-between text-sm">
          <span className="font-medium">
            {t("weekOf", { week: currentProgram.week, total: currentProgram.totalWeeks })}
          </span>
          <span className="text-muted-foreground">{t("daysPerWeek", { count: days.length })}</span>
        </div>
        <Progress
          value={(currentProgram.week / currentProgram.totalWeeks) * 100}
          aria-label={t("programProgress")}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <section aria-label={t("logger")}>
          <WorkoutLogger days={days} />
        </section>
        <SectionCard title={t("library")} description={t("libraryHint")} className="h-fit">
          <ExerciseLibrary items={library} />
        </SectionCard>
      </div>
    </div>
  );
}
