"use client";

import { Power } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";

/** Global AI kill-switch. Persisted with audit logging once the admin backend lands (Phase 13). */
export function AiKillSwitch() {
  const t = useTranslations("admin.aiUsage");
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
      <div className="flex items-start gap-3">
        <Power className="mt-0.5 size-5 text-primary" aria-hidden />
        <div>
          <p className="font-semibold">{t("killSwitch")}</p>
          <p className="text-sm text-muted-foreground">
            {enabled ? t("killSwitchOn") : t("killSwitchOff")}
          </p>
        </div>
      </div>
      <Switch
        checked={enabled}
        aria-label={t("killSwitch")}
        onCheckedChange={(v) => {
          setEnabled(v);
          toast.warning(v ? t("resumed") : t("paused"));
        }}
      />
    </div>
  );
}
