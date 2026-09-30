import { FlaskConical } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Shows a "Sample data" badge until the page is wired to real data. */
  sample?: boolean;
};

export function PageHeader({ title, description, actions, sample = true }: Props) {
  const t = useTranslations("shared");
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-4xl tracking-wide sm:text-5xl">{title}</h1>
          {sample && (
            <Badge variant="outline" className="gap-1 text-muted-foreground">
              <FlaskConical aria-hidden /> {t("sampleData")}
            </Badge>
          )}
        </div>
        {description && <p className="max-w-2xl text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
