"use client";

import { Save } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

function Group({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans text-base font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function ToggleRow({
  id,
  label,
  hint,
  defaultChecked,
}: {
  id: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 rounded-lg border p-3 sm:col-span-2">
      <Label htmlFor={id} className="flex flex-col items-start gap-0.5">
        <span>{label}</span>
        {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
      </Label>
      <Switch id={id} defaultChecked={defaultChecked} />
    </div>
  );
}

export function WorkspaceSettingsForm() {
  const t = useTranslations("coach.settings");
  const ts = useTranslations("shared");
  const format = useFormatter();
  const [color, setColor] = useState("#E11D2A");
  // 2023-01-01 was a Sunday — only used for localized weekday names.
  const weekday = (d: number) =>
    format.dateTime(new Date(Date.UTC(2023, 0, 1 + d, 12)), { weekday: "long" });

  function save(e: FormEvent) {
    e.preventDefault();
    toast.info(ts("actionSoon"));
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-6">
      <Group title={t("branding")} description={t("brandingHint")}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="ws-name">{t("workspaceName")}</Label>
          <Input id="ws-name" defaultValue="Aarav Fitness Coaching" className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="ws-color">{t("brandColor")}</Label>
          <div className="flex gap-2">
            <input
              id="ws-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-11 w-14 cursor-pointer rounded-md border bg-transparent"
            />
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label={t("brandColor")}
              className="h-11 font-mono"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="ws-welcome">{t("welcome")}</Label>
          <Textarea
            id="ws-welcome"
            rows={3}
            defaultValue={t("welcomeDefault")}
            className="text-base"
          />
        </div>
      </Group>

      <Group title={t("checkIns")} description={t("checkInsHint")}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="ci-day">{t("checkInDay")}</Label>
          <Select defaultValue="6">
            <SelectTrigger id="ci-day" className="h-11 min-h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {weekday(d)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="ci-sla">{t("reviewWithin")}</Label>
          <Select defaultValue="24">
            <SelectTrigger id="ci-sla" className="h-11 min-h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[12, 24, 48].map((h) => (
                <SelectItem key={h} value={String(h)}>
                  {t("hours", { count: h })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ToggleRow id="rem-fri" label={t("reminderFriday")} defaultChecked />
        <ToggleRow id="rem-sat" label={t("reminderSaturday")} defaultChecked />
        <ToggleRow id="rem-overdue" label={t("reminderOverdue")} defaultChecked />
      </Group>

      <Group title={t("ai")} description={t("aiHint")}>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="ai-tone">{t("tone")}</Label>
          <Select defaultValue="supportive">
            <SelectTrigger id="ai-tone" className="h-11 min-h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["supportive", "direct", "motivational"] as const).map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {t(`tones.${tone}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ToggleRow id="ai-checkins" label={t("aiCheckIns")} defaultChecked />
        <ToggleRow id="ai-form" label={t("aiFormChecks")} defaultChecked />
        <ToggleRow
          id="ai-assistant"
          label={t("aiAssistant")}
          hint={t("aiAssistantHint")}
          defaultChecked
        />
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="ai-instructions">{t("instructions")}</Label>
          <Textarea
            id="ai-instructions"
            rows={3}
            defaultValue={t("instructionsDefault")}
            className="text-base"
          />
        </div>
      </Group>

      <Group title={t("minors")} description={t("minorsHint")}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="min-age">{t("minAge")}</Label>
          <Select defaultValue="13">
            <SelectTrigger id="min-age" className="h-11 min-h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[13, 14, 15, 16, 18].map((a) => (
                <SelectItem key={a} value={String(a)}>
                  {t("ageOrOlder", { age: a })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Group>

      <Button type="submit" className="h-12 w-full sm:w-fit">
        <Save aria-hidden /> {t("save")}
      </Button>
    </form>
  );
}
