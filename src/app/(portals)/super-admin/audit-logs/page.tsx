import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auditLogs } from "@/features/demo/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portal");
  return { title: t("superAdmin.nav.auditLogs") };
}

export default async function AuditLogsPage() {
  const t = await getTranslations("admin.audit");
  const format = await getFormatter();
  const now = new Date();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("when")}</TableHead>
              <TableHead>{t("actor")}</TableHead>
              <TableHead>{t("action")}</TableHead>
              <TableHead>{t("target")}</TableHead>
              <TableHead>{t("ip")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs(now).map((l) => (
              <TableRow key={l.id}>
                <TableCell className="whitespace-nowrap">
                  {format.dateTime(new Date(l.at), {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>{l.actor}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{l.action}</code>
                </TableCell>
                <TableCell>{l.target}</TableCell>
                <TableCell className="font-mono text-xs">{l.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
