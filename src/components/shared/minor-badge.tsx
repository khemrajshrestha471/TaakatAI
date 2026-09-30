import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

/** Minors (under 18) are clearly marked everywhere in the coach portal. */
export function MinorBadge() {
  const t = useTranslations("shared");
  return (
    <span className="inline-flex h-6 items-center gap-1 rounded-full bg-chart-3/15 px-2 text-xs font-semibold text-foreground">
      <ShieldCheck className="size-3.5 text-chart-3" aria-hidden />
      {t("minor")}
    </span>
  );
}
