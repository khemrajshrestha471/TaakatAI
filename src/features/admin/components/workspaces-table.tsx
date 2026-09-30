"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { PendingAction } from "@/components/shared/pending-action";
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WorkspaceType } from "@/features/demo/data";

export type WorkspaceRow = {
  id: string;
  name: string;
  type: WorkspaceType;
  plan: string;
  status: "active" | "trial" | "pastDue" | "suspended";
  clients: number;
  coaches: number;
  branches: number;
  storageGb: number;
  aiTokens: number;
};

const statusTone: Record<WorkspaceRow["status"], StatusTone> = {
  active: "good",
  trial: "info",
  pastDue: "warning",
  suspended: "critical",
};

export function WorkspacesTable({ rows }: { rows: WorkspaceRow[] }) {
  const t = useTranslations("admin.workspaces");
  const tp = useTranslations("plans");
  const format = useFormatter();
  const [type, setType] = useState<WorkspaceType | "all">("all");
  const filtered = rows.filter((r) => type === "all" || r.type === type);

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={type} onValueChange={(v) => setType(v as WorkspaceType | "all")}>
        <TabsList>
          <TabsTrigger value="all" className="min-h-10 px-3">
            {t("all")}
          </TabsTrigger>
          <TabsTrigger value="INDEPENDENT_COACH" className="min-h-10 px-3">
            {t("types.INDEPENDENT_COACH")}
          </TabsTrigger>
          <TabsTrigger value="GYM_CENTER" className="min-h-10 px-3">
            {t("types.GYM_CENTER")}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("plan")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="text-right">{t("clients")}</TableHead>
              <TableHead className="text-right">{t("coaches")}</TableHead>
              <TableHead className="text-right">{t("storage")}</TableHead>
              <TableHead className="text-right">{t("aiTokens")}</TableHead>
              <TableHead>
                <span className="sr-only">{t("actions")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-medium">{w.name}</TableCell>
                <TableCell>{t(`types.${w.type}`)}</TableCell>
                <TableCell>{tp(`${w.plan as "soloCoach"}.name`)}</TableCell>
                <TableCell>
                  <StatusBadge tone={statusTone[w.status]}>{t(`statuses.${w.status}`)}</StatusBadge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {format.number(w.clients)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {format.number(w.coaches)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {format.number(w.storageGb, { maximumFractionDigits: 1 })} GB
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {format.number(w.aiTokens, { notation: "compact" })}
                </TableCell>
                <TableCell>
                  <PendingAction variant="outline" size="sm" className="h-9">
                    {w.status === "suspended" ? t("reactivate") : t("suspend")}
                  </PendingAction>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
