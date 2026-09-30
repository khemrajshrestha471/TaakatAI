"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter as useNextRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLocaleAction } from "@/i18n/actions";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

type Props = {
  /**
   * `routing`: public pages — swaps the /en|/ne prefix (the middleware stores the cookie).
   * `cookie`: portals — saves the preference and re-renders in place.
   */
  mode: "routing" | "cookie";
};

export function LanguageSwitcher({ mode }: Props) {
  const t = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const intlRouter = useRouter();
  const nextRouter = useNextRouter();
  const [isPending, startTransition] = useTransition();

  function change(next: string) {
    const target = next as Locale;
    if (target === locale) return;
    startTransition(async () => {
      if (mode === "routing") {
        intlRouter.replace(pathname, { locale: target });
      } else {
        await setLocaleAction(target);
        nextRouter.refresh();
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-11 gap-1.5 px-3"
          aria-label={t("label")}
          disabled={isPending}
        >
          <Languages className="size-5" aria-hidden />
          <span className="text-sm font-semibold">{t("short")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale} onValueChange={change}>
          {locales.map((l) => (
            <DropdownMenuRadioItem key={l} value={l} lang={l}>
              {t(l)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
