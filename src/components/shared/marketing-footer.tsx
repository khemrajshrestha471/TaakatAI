import { getTranslations } from "next-intl/server";

import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/config/site";

export async function MarketingFooter() {
  const t = await getTranslations();
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex flex-col gap-1">
          <Logo />
          <p>{t("common.tagline")}</p>
        </div>
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. {t("marketing.footer.rights")}
        </p>
      </div>
    </footer>
  );
}
