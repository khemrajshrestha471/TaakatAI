import { Dumbbell } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-brand text-brand-foreground">
        <Dumbbell className="size-4" aria-hidden />
      </span>
      {!compact && (
        <span className="font-display text-2xl leading-none tracking-wide">{siteConfig.name}</span>
      )}
      {compact && <span className="sr-only">{siteConfig.name}</span>}
    </span>
  );
}
