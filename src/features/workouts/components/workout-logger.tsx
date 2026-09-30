"use client";

import { Check, Plus, SkipForward, Timer, Trophy, Video } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type LoggerExercise = {
  key: string;
  name: string;
  sets: number;
  reps: string;
  rpe: number;
  restSec: number;
  tempo?: string;
  previous?: { weight: number; reps: number };
};

export type LoggerDay = { id: string; name: string; focus: string; exercises: LoggerExercise[] };

type SetEntry = { weight: string; reps: string; done: boolean };

/** Epley estimated one-rep max. */
function e1rm(weight: number, reps: number) {
  return weight * (1 + reps / 30);
}

function initialSets(day: LoggerDay): Record<string, SetEntry[]> {
  return Object.fromEntries(
    day.exercises.map((ex) => [
      ex.key,
      Array.from({ length: ex.sets }, () => ({
        weight: ex.previous ? String(ex.previous.weight) : "",
        reps: "",
        done: false,
      })),
    ]),
  );
}

function RestTimer({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const t = useTranslations("client.train");
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    const id = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (left <= 0) {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(300);
      onDone();
    }
  }, [left, onDone]);

  const mm = Math.floor(Math.max(left, 0) / 60);
  const ss = String(Math.max(left, 0) % 60).padStart(2, "0");

  return (
    <div
      role="timer"
      aria-live="polite"
      className="fixed inset-x-4 bottom-20 z-40 mx-auto flex max-w-md items-center gap-3 rounded-xl bg-primary p-3 text-primary-foreground shadow-lg lg:bottom-6"
    >
      <Timer className="size-5" aria-hidden />
      <span className="text-sm">{t("rest")}</span>
      <span className="font-display text-3xl tracking-wide tabular-nums">
        {mm}:{ss}
      </span>
      <Button
        size="sm"
        variant="secondary"
        className="ml-auto h-10"
        onClick={() => setLeft((s) => s + 30)}
      >
        <Plus aria-hidden /> 30s
      </Button>
      <Button size="sm" variant="secondary" className="h-10" onClick={onDone}>
        <SkipForward aria-hidden /> {t("skip")}
      </Button>
    </div>
  );
}

function DayLogger({ day }: { day: LoggerDay }) {
  const t = useTranslations("client.train");
  const ts = useTranslations("shared");
  const format = useFormatter();
  const [sets, setSets] = useState(() => initialSets(day));
  const [rest, setRest] = useState<{ id: number; seconds: number } | null>(null);

  const total = Object.values(sets).flat().length;
  const done = Object.values(sets)
    .flat()
    .filter((s) => s.done).length;

  function update(key: string, index: number, patch: Partial<SetEntry>) {
    setSets((prev) => ({
      ...prev,
      [key]: (prev[key] ?? []).map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
  }

  function toggleDone(ex: LoggerExercise, index: number) {
    const entry = sets[ex.key]?.[index];
    if (!entry) return;
    const nowDone = !entry.done;
    update(ex.key, index, { done: nowDone });
    if (!nowDone) return;

    const w = Number(entry.weight);
    const r = Number(entry.reps);
    if (ex.previous && w > 0 && r > 0 && e1rm(w, r) > e1rm(ex.previous.weight, ex.previous.reps)) {
      toast.success(t("prToast", { exercise: ex.name }), { icon: <Trophy className="size-4" /> });
    }
    setRest({ id: Date.now(), seconds: ex.restSec });
  }

  function finish() {
    toast.success(t("finishedToast", { done, total }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{day.focus}</p>
        <p className="text-sm font-medium tabular-nums">
          {t("progress", { done: format.number(done), total: format.number(total) })}
        </p>
      </div>

      {day.exercises.map((ex) => (
        <Card key={ex.key} size="sm">
          <CardHeader className="flex flex-row items-start justify-between gap-2">
            <div>
              <CardTitle className="font-sans text-base font-semibold">{ex.name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {t("prescription", { sets: ex.sets, reps: ex.reps, rpe: ex.rpe })}
                {ex.tempo ? ` · ${t("tempo", { tempo: ex.tempo })}` : ""}
                {` · ${t("restFor", { seconds: ex.restSec })}`}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-10 shrink-0"
              onClick={() => toast.info(t("formVideoSoon"))}
            >
              <Video aria-hidden /> <span className="hidden sm:inline">{t("recordForm")}</span>
              <span className="sr-only sm:hidden">{t("recordForm")}</span>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {ex.previous && (
              <p className="text-xs text-muted-foreground">
                {t("lastTime", {
                  weight: format.number(ex.previous.weight),
                  reps: format.number(ex.previous.reps),
                })}
              </p>
            )}
            <div className="grid grid-cols-[2rem_1fr_1fr_3rem] items-center gap-2 text-xs text-muted-foreground">
              <span>{t("set")}</span>
              <span>{ts("kg")}</span>
              <span>{t("reps")}</span>
              <span className="sr-only">{t("done")}</span>
            </div>
            {(sets[ex.key] ?? []).map((s, i) => (
              <div
                key={i}
                className={cn(
                  "grid grid-cols-[2rem_1fr_1fr_3rem] items-center gap-2 rounded-lg",
                  s.done && "bg-success/10",
                )}
              >
                <span className="text-center text-sm font-semibold tabular-nums">
                  {format.number(i + 1)}
                </span>
                <Input
                  inputMode="decimal"
                  value={s.weight}
                  onChange={(e) => update(ex.key, i, { weight: e.target.value })}
                  aria-label={t("weightFor", { set: i + 1, exercise: ex.name })}
                  className="h-11 text-center text-base tabular-nums"
                />
                <Input
                  inputMode="numeric"
                  value={s.reps}
                  placeholder={ex.reps}
                  onChange={(e) => update(ex.key, i, { reps: e.target.value })}
                  aria-label={t("repsFor", { set: i + 1, exercise: ex.name })}
                  className="h-11 text-center text-base tabular-nums"
                />
                <Button
                  size="icon"
                  variant={s.done ? "default" : "outline"}
                  className={cn("size-11", s.done && "bg-success text-white hover:bg-success/90")}
                  aria-pressed={s.done}
                  aria-label={t("markDone", { set: i + 1 })}
                  onClick={() => toggleDone(ex, i)}
                >
                  <Check aria-hidden />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Button className="h-12 text-base" onClick={finish}>
        {t("finish")}
      </Button>

      {rest && <RestTimer key={rest.id} seconds={rest.seconds} onDone={() => setRest(null)} />}
    </div>
  );
}

export function WorkoutLogger({ days }: { days: LoggerDay[] }) {
  return (
    <Tabs defaultValue={days[0]?.id}>
      <TabsList className="mb-4 w-full overflow-x-auto sm:w-fit">
        {days.map((d) => (
          <TabsTrigger key={d.id} value={d.id} className="min-h-10 px-4">
            {d.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {days.map((d) => (
        <TabsContent key={d.id} value={d.id}>
          <DayLogger day={d} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
