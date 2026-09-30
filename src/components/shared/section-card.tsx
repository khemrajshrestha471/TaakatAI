import type { ReactNode } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export function SectionCard({
  title,
  description,
  action,
  className,
  contentClassName,
  children,
}: Props) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-sans text-base font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className={cn("flex flex-col gap-3", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
