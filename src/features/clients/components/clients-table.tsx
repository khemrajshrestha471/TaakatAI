"use client";

import { HeartPulse, Search } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { MinorBadge } from "@/components/shared/minor-badge";
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ClientStatus, CoachClient, Goal } from "@/features/demo/data";

const statusTone: Record<ClientStatus, StatusTone> = {
  active: "good",
  paused: "warning",
  expired: "critical",
  lead: "info",
};

const statuses: ClientStatus[] = ["active", "paused", "expired", "lead"];
const goals: Goal[] = [
  "fatLoss",
  "muscleGain",
  "recomposition",
  "strength",
  "contestPrep",
  "generalFitness",
];

export function ClientsTable({ clients }: { clients: CoachClient[] }) {
  const t = useTranslations("coach.clients");
  const ts = useTranslations("shared");
  const format = useFormatter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ClientStatus | "all">("all");
  const [goal, setGoal] = useState<Goal | "all">("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter(
      (c) =>
        (status === "all" || c.status === status) &&
        (goal === "all" || c.goal === goal) &&
        (!q || c.name.toLowerCase().includes(q)),
    );
  }, [clients, query, status, goal]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            aria-label={t("search")}
            className="h-11 pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as ClientStatus | "all")}>
          <SelectTrigger className="h-11 min-h-11 sm:w-44" aria-label={t("filterStatus")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStatuses")}</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {ts(`clientStatus.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={goal} onValueChange={(v) => setGoal(v as Goal | "all")}>
          <SelectTrigger className="h-11 min-h-11 sm:w-48" aria-label={t("filterGoal")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allGoals")}</SelectItem>
            {goals.map((g) => (
              <SelectItem key={g} value={g}>
                {ts(`goals.${g}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {t("showing", { count: rows.length, total: clients.length })}
      </p>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("client")}</TableHead>
              <TableHead>{t("goal")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="text-right">{t("adherence")}</TableHead>
              <TableHead className="text-right">{t("weightChange")}</TableHead>
              <TableHead>{t("lastCheckIn")}</TableHead>
              <TableHead>{t("coach")}</TableHead>
              <TableHead>{t("packageEnds")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-2 font-medium">
                    {c.name}
                    {c.isMinor && <MinorBadge />}
                    {c.healthFlag && (
                      <span title={t("healthFlag")} className="text-destructive">
                        <HeartPulse className="size-4" aria-hidden />
                        <span className="sr-only">{t("healthFlag")}</span>
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{ts(`goals.${c.goal}`)}</TableCell>
                <TableCell>
                  <StatusBadge tone={statusTone[c.status]}>
                    {ts(`clientStatus.${c.status}`)}
                  </StatusBadge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {c.status === "lead" ? "—" : `${format.number(c.adherence)}%`}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {c.status === "lead"
                    ? "—"
                    : `${format.number(c.weightChange, { signDisplay: "exceptZero", maximumFractionDigits: 1 })} ${ts("kg")}`}
                </TableCell>
                <TableCell>
                  {c.lastCheckInDays === null ? "—" : t("daysAgo", { count: c.lastCheckInDays })}
                </TableCell>
                <TableCell>{c.coach}</TableCell>
                <TableCell>
                  {c.packageEndsInDays === null ? "—" : t("inDays", { count: c.packageEndsInDays })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
