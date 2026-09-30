import { getTranslations } from "next-intl/server";

import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export async function MarketingHeader() {
  const t = await getTranslations("marketing.nav");
  const links = [
    { href: "/#features", label: t("features") },
    { href: "/#how-it-works", label: t("howItWorks") },
    { href: "/#for-coaches", label: t("forCoaches") },
    { href: "/#pricing", label: t("pricing") },
    { href: "/#faq", label: t("faq") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 lg:px-8">
        <Link href="/" className="rounded-md focus-visible:ring-2 focus-visible:outline-none">
          <Logo />
        </Link>
        <nav className="ml-8 hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitcher mode="routing" />
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden h-11 sm:inline-flex">
            <Link href="/login">{t("login")}</Link>
          </Button>
          <Button asChild className="h-11">
            <Link href="/register">{t("getStarted")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
