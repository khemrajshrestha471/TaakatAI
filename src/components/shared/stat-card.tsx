import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  /** Optional emphasis for the value — e.g. highlight items needing attention. */
  tone?: "default" | "attention";
};

export function StatCard({ label, value, hint, icon: Icon, tone = "default" }: Props) {
  return (
    <Card size="sm">
      <CardContent className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p
            className={cn(
              "font-display text-3xl leading-none tracking-wide tabular-nums",
              tone === "attention" && "text-primary",
            )}
          >
            {value}
          </p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden />
          </span>
        )}
      </CardContent>
    </Card>
  );
}
