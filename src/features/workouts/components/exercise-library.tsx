"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const muscleGroups = ["chest", "back", "shoulders", "arms", "legs", "core"] as const;
export type MuscleGroup = (typeof muscleGroups)[number];

export type LibraryExercise = {
  key: string;
  name: string;
  muscle: MuscleGroup;
  equipment: "barbell" | "dumbbell" | "machine" | "cable" | "bodyweight";
};

export function ExerciseLibrary({ items }: { items: LibraryExercise[] }) {
  const t = useTranslations("client.train");
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState<MuscleGroup | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (i) => (muscle === "all" || i.muscle === muscle) && (!q || i.name.toLowerCase().includes(q)),
    );
  }, [items, query, muscle]);

  const chips: (MuscleGroup | "all")[] = ["all", ...muscleGroups];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchExercises")}
          aria-label={t("searchExercises")}
          className="h-11 pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("filterMuscle")}>
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setMuscle(c)}
            aria-pressed={muscle === c}
            className={cn(
              "h-9 rounded-full border px-3 text-sm",
              muscle === c ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            {t(`muscles.${c}`)}
          </button>
        ))}
      </div>
      <ul className="divide-y rounded-lg border">
        {filtered.map((i) => (
          <li key={i.key} className="flex items-center justify-between gap-2 px-3 py-3 text-sm">
            <span className="font-medium">{i.name}</span>
            <span className="text-xs text-muted-foreground">
              {t(`muscles.${i.muscle}`)} · {t(`equipment.${i.equipment}`)}
            </span>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-muted-foreground">{t("noResults")}</li>
        )}
      </ul>
    </div>
  );
}
