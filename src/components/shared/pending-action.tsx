"use client";

import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

/**
 * A real, visible action whose backend arrives in a later phase. Clicking explains that
 * instead of silently doing nothing.
 */
export function PendingAction(props: Omit<ComponentProps<typeof Button>, "onClick">) {
  const t = useTranslations("shared");
  return <Button {...props} onClick={() => toast.info(t("actionSoon"))} />;
}
