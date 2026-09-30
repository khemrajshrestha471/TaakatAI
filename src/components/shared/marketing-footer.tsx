import { getTranslations } from "next-intl/server";

import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";

export async function MarketingFooter() {
  const t = await getTranslations();
  const columns = [
    {
      title: t("landing.footer.product"),
      links: [
        { href: "/#features", label: t("marketing.nav.features") },
        { href: "/#how-it-works", label: t("marketing.nav.howItWorks") },
        { href: "/#pricing", label: t("marketing.nav.pricing") },
        { href: "/#faq", label: t("marketing.nav.faq") },
      ],
    },
    {
      title: t("landing.footer.business"),
      links: [
        { href: "/#for-coaches", label: t("marketing.nav.forCoaches") },
        { href: "/register?type=coach", label: t("landing.footer.startTrial") },
      ],
    },
    {
      title: t("landing.footer.account"),
      links: [
        { href: "/login", label: t("marketing.nav.login") },
        { href: "/register", label: t("marketing.nav.getStarted") },
      ],
    },
  ];

  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="font-display text-xl tracking-wide">{t("common.tagline")}</p>
          <p className="max-w-sm text-sm text-muted-foreground">{t("landing.footer.about")}</p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3 text-sm">
            <p className="font-semibold">{col.title}</p>
            {col.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground lg:px-8">
          © {new Date().getFullYear()} {siteConfig.name}. {t("marketing.footer.rights")}
        </p>
      </div>
    </footer>
  );
}
