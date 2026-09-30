"use client";

import { ShieldAlert } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  activityFactors,
  calculateTargets,
  type ActivityLevel,
  type DietGoal,
  type MacroInput,
  type Sex,
} from "@/features/diet/calculations";

export function MacroCalculator() {
  const t = useTranslations("coach.diet");
  const ts = useTranslations("shared");
  const format = useFormatter();
  const [input, setInput] = useState<MacroInput>({
    sex: "female",
    age: 28,
    weightKg: 70,
    heightCm: 162,
    activity: "moderate",
    goal: "lose",
    adjustment: 0.2,
  });
  const r = calculateTargets(input);

  function num(key: "age" | "weightKg" | "heightCm") {
    return {
      id: key,
      inputMode: "decimal" as const,
      value: String(input[key]),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setInput((s) => ({ ...s, [key]: Number(e.target.value) || 0 })),
      className: "h-11",
    };
  }

  const results = [
    { label: t("bmr"), value: `${format.number(r.bmr)} ${ts("kcal")}` },
    { label: t("tdee"), value: `${format.number(r.tdee)} ${ts("kcal")}` },
    { label: t("target"), value: `${format.number(r.calories)} ${ts("kcal")}`, strong: true },
    { label: ts("protein"), value: `${format.number(r.protein)} ${ts("g")}` },
    { label: ts("carbs"), value: `${format.number(r.carbs)} ${ts("g")}` },
    { label: ts("fat"), value: `${format.number(r.fat)} ${ts("g")}` },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="sex">{t("sex")}</Label>
          <Select
            value={input.sex}
            onValueChange={(v) => setInput((s) => ({ ...s, sex: v as Sex }))}
          >
            <SelectTrigger id="sex" className="h-11 min-h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">{t("female")}</SelectItem>
              <SelectItem value="male">{t("male")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="age">{t("age")}</Label>
          <Input {...num("age")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="weightKg">{t("weight")}</Label>
          <Input {...num("weightKg")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="heightCm">{t("height")}</Label>
          <Input {...num("heightCm")} />
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          <Label htmlFor="activity">{t("activity")}</Label>
          <Select
            value={input.activity}
            onValueChange={(v) => setInput((s) => ({ ...s, activity: v as ActivityLevel }))}
          >
            <SelectTrigger id="activity" className="h-11 min-h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(activityFactors) as ActivityLevel[]).map((a) => (
                <SelectItem key={a} value={a}>
                  {t(`activityLevels.${a}`)} (×{activityFactors[a]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="goal">{t("goal")}</Label>
          <Select
            value={input.goal}
            onValueChange={(v) => setInput((s) => ({ ...s, goal: v as DietGoal }))}
          >
            <SelectTrigger id="goal" className="h-11 min-h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lose">{t("goals.lose")}</SelectItem>
              <SelectItem value="maintain">{t("goals.maintain")}</SelectItem>
              <SelectItem value="gain">{t("goals.gain")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="adjustment">{t("adjustment")}</Label>
          <Select
            value={String(input.adjustment)}
            onValueChange={(v) => setInput((s) => ({ ...s, adjustment: Number(v) }))}
          >
            <SelectTrigger id="adjustment" className="h-11 min-h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0.1, 0.15, 0.2, 0.25, 0.3].map((a) => (
                <SelectItem key={a} value={String(a)}>
                  {format.number(a, { style: "percent" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {results.map((x) => (
            <div key={x.label} className="rounded-lg border p-3">
              <dt className="text-xs text-muted-foreground">{x.label}</dt>
              <dd
                className={
                  x.strong
                    ? "font-display text-3xl tracking-wide text-primary tabular-nums"
                    : "text-lg font-semibold tabular-nums"
                }
              >
                {x.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-muted-foreground">
          {t("weeklyChange", {
            value: format.number(r.weeklyChangeKg, {
              signDisplay: "exceptZero",
              maximumFractionDigits: 2,
            }),
          })}
        </p>
        {r.limits.map((l) => (
          <p
            key={l}
            role="status"
            className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm"
          >
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
            {t(`limits.${l}`)}
          </p>
        ))}
      </div>
    </div>
  );
}
