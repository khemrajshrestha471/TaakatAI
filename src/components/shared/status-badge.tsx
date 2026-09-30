import { AlertTriangle, CheckCircle2, Circle, Clock, XCircle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type StatusTone = "good" | "warning" | "critical" | "neutral" | "info";

const tones: Record<StatusTone, { className: string; icon: LucideIcon }> = {
  good: { className: "bg-success/12 text-success", icon: CheckCircle2 },
  warning: { className: "bg-warning/12 text-warning", icon: Clock },
  critical: { className: "bg-destructive/12 text-destructive", icon: XCircle },
  info: { className: "bg-chart-2/12 text-chart-2", icon: AlertTriangle },
  neutral: { className: "bg-muted text-muted-foreground", icon: Circle },
};

/** Status always pairs an icon + label with the color (never color alone). */
export function StatusBadge({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  const { className, icon: Icon } = tones[tone];
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-full px-2 text-xs font-medium whitespace-nowrap",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {children}
    </span>
  );
}
