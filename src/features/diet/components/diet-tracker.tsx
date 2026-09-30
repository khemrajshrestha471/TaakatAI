"use client";

import { Check, Droplet, Lightbulb, Minus, Plus } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Macros = { kcal: number; protein: number; carbs: number; fat: number };

export type TrackerMeal = {
  id: string;
  name: string;
  time: string;
  items: { name: string; qty: string; kcal: number; protein: number }[];
  totals: Macros;
  swap?: string;
};

type Props = {
  meals: TrackerMeal[];
  targets: Macros & { waterMl: number };
  supplements: { id: string; name: string }[];
};

const GLASS_ML = 250;

export function DietTracker({ meals, targets, supplements }: Props) {
  const t = useTranslations("client.diet");
  const ts = useTranslations("shared");
  const format = useFormatter();
  const [eaten, setEaten] = useState<Set<string>>(() => new Set(["breakfast"]));
  const [waterMl, setWaterMl] = useState(1250);
  const [taken, setTaken] = useState<Set<string>>(() => new Set());

  const consumed = meals
    .filter((m) => eaten.has(m.id))
    .reduce<Macros>(
      (a, m) => ({
        kcal: a.kcal + m.totals.kcal,
        protein: a.protein + m.totals.protein,
        carbs: a.carbs + m.totals.carbs,
        fat: a.fat + m.totals.fat,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0 },
    );

  function toggle(set: Set<string>, id: string) {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  }

  const macroRows = [
    { key: "protein", label: ts("protein"), value: consumed.protein, target: targets.protein },
    { key: "carbs", label: ts("carbs"), value: consumed.carbs, target: targets.carbs },
    { key: "fat", label: ts("fat"), value: consumed.fat, target: targets.fat },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      <div className="flex flex-col gap-4">
        {meals.map((meal) => {
          const done = eaten.has(meal.id);
          return (
            <Card key={meal.id} size="sm" className={cn(done && "ring-success/50")}>
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle className="font-sans text-base font-semibold">{meal.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {meal.time} · {format.number(meal.totals.kcal)} {ts("kcal")} ·{" "}
                    {t("proteinShort", { value: format.number(meal.totals.protein) })}
                  </p>
                </div>
                <Button
                  variant={done ? "default" : "outline"}
                  className={cn(
                    "h-10 shrink-0",
                    done && "bg-success text-white hover:bg-success/90",
                  )}
                  aria-pressed={done}
                  onClick={() => setEaten((s) => toggle(s, meal.id))}
                >
                  <Check aria-hidden /> {done ? t("eaten") : t("markEaten")}
                </Button>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <ul className="divide-y text-sm">
                  {meal.items.map((i) => (
                    <li key={i.name} className="flex items-center justify-between gap-2 py-2">
                      <span>
                        {i.name} <span className="text-muted-foreground">· {i.qty}</span>
                      </span>
                      <span className="text-muted-foreground tabular-nums">
                        {format.number(i.kcal)} {ts("kcal")}
                      </span>
                    </li>
                  ))}
                </ul>
                {meal.swap && (
                  <p className="flex gap-2 rounded-lg bg-muted p-3 text-xs">
                    <Lightbulb className="size-4 shrink-0 text-chart-3" aria-hidden />
                    <span>
                      <span className="font-semibold">{t("swap")}: </span>
                      {meal.swap}
                    </span>
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="font-sans text-base font-semibold">{t("today")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="font-display text-4xl tracking-wide tabular-nums">
              {format.number(consumed.kcal)}
              <span className="font-sans text-sm text-muted-foreground">
                {" "}
                / {format.number(targets.kcal)} {ts("kcal")}
              </span>
            </p>
            <Progress
              value={Math.min(100, (consumed.kcal / targets.kcal) * 100)}
              aria-label={ts("kcal")}
            />
            {macroRows.map((m) => (
              <div key={m.key} className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <span>{m.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {format.number(m.value)} / {format.number(m.target)} {ts("g")}
                  </span>
                </div>
                <Progress
                  value={Math.min(100, (m.value / m.target) * 100)}
                  className="h-1.5"
                  aria-label={m.label}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-base font-semibold">
              <Droplet className="size-4 text-chart-2" aria-hidden /> {t("water")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm tabular-nums">
              {t("waterProgress", {
                value: format.number(waterMl / 1000, { maximumFractionDigits: 2 }),
                target: format.number(targets.waterMl / 1000),
              })}
            </p>
            <Progress
              value={Math.min(100, (waterMl / targets.waterMl) * 100)}
              aria-label={t("water")}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="size-11"
                aria-label={t("removeGlass")}
                onClick={() => setWaterMl((w) => Math.max(0, w - GLASS_ML))}
              >
                <Minus aria-hidden />
              </Button>
              <Button className="h-11 flex-1" onClick={() => setWaterMl((w) => w + GLASS_ML)}>
                <Plus aria-hidden /> {t("addGlass")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle className="font-sans text-base font-semibold">{t("supplements")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1">
              {supplements.map((s) => (
                <li key={s.id}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm hover:bg-muted">
                    <Checkbox
                      checked={taken.has(s.id)}
                      onCheckedChange={() => setTaken((x) => toggle(x, s.id))}
                    />
                    {s.name}
                  </label>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
