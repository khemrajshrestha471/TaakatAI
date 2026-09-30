"use client";

import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { isActive, portalNav, SIDEBAR_COOKIE, type PortalId } from "@/components/shared/portal-nav";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  portal: PortalId;
  /** Initial collapsed state, read from a cookie on the server to avoid a layout flash. */
  defaultCollapsed?: boolean;
  children: ReactNode;
};

export function PortalShell({ portal, defaultCollapsed = false, children }: Props) {
  const t = useTranslations("portal");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = portalNav[portal];
  const rootHref = items[0].href;
  // Clients get a bottom tab bar on mobile; other portals use a slide-out drawer.
  const useBottomNav = portal === "client";
  const title = t(`${portal}.title`);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${SIDEBAR_COOKIE}=${next ? 1 : 0}; path=/; max-age=31536000; samesite=lax`;
  }

  function renderNavLinks(compact: boolean, onNavigate?: () => void) {
    return (
      <ul className="flex flex-col gap-1">
        {items.map(({ href, labelKey, icon: Icon }) => {
          const active = isActive(pathname, href, rootHref);
          const label = t(labelKey);
          const link = (
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                active &&
                  "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground",
                compact && "justify-center px-0",
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              <span className={cn(compact && "sr-only")}>{label}</span>
            </Link>
          );
          return (
            <li key={href}>
              {compact ? (
                <Tooltip>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              ) : (
                link
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {tc("skipToContent")}
      </a>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:flex",
          collapsed ? "w-18" : "w-64",
        )}
      >
        <div className={cn("flex h-16 items-center px-4", collapsed && "justify-center px-0")}>
          <Link
            href={rootHref}
            className="rounded-md focus-visible:ring-2 focus-visible:outline-none"
          >
            <Logo compact={collapsed} />
          </Link>
        </div>
        <nav aria-label={t("mainNav")} className="flex-1 overflow-y-auto px-3 py-2">
          {renderNavLinks(collapsed)}
        </nav>
        <div className={cn("border-t p-3", collapsed && "flex justify-center")}>
          <Button
            variant="ghost"
            size="icon"
            className="size-11"
            onClick={toggleCollapsed}
            aria-label={collapsed ? t("expandSidebar") : t("collapseSidebar")}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-5" />
            ) : (
              <PanelLeftClose className="size-5" />
            )}
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
          {!useBottomNav && (
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-11 lg:hidden"
                  aria-label={tc("openMenu")}
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar p-0">
                <div className="flex h-16 items-center px-4">
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </div>
                <nav aria-label={t("mainNav")} className="px-3 py-2">
                  {renderNavLinks(false, () => setMobileOpen(false))}
                </nav>
              </SheetContent>
            </Sheet>
          )}
          <Link href={rootHref} className="rounded-md lg:hidden" aria-label={title}>
            <Logo compact={!useBottomNav} />
          </Link>
          <p className="hidden text-sm font-medium text-muted-foreground lg:block">{title}</p>
          <div className="ml-auto flex items-center gap-1">
            <LanguageSwitcher mode="cookie" />
            <ThemeToggle />
          </div>
        </header>

        <main
          id="main"
          tabIndex={-1}
          className={cn(
            "mx-auto w-full max-w-7xl flex-1 px-4 py-6 outline-none lg:px-8",
            useBottomNav && "pb-28 lg:pb-6",
          )}
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar (client portal) */}
      {useBottomNav && (
        <nav
          aria-label={t("mainNav")}
          className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        >
          <ul className="grid grid-cols-5">
            {items.map(({ href, labelKey, icon: Icon }) => {
              const active = isActive(pathname, href, rootHref);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="size-6" aria-hidden />
                    <span className="max-w-full truncate px-1">{t(labelKey)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
