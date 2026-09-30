import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function LocaleNotFound() {
  const t = useTranslations();
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="font-display text-7xl text-primary">404</p>
      <h1 className="font-display text-3xl tracking-wide">{t("notFound.title")}</h1>
      <p className="max-w-md text-muted-foreground">{t("notFound.body")}</p>
      <Button asChild size="lg" className="mt-2 h-11">
        <Link href="/">{t("common.backHome")}</Link>
      </Button>
    </main>
  );
}
