import type { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Link } from "@/i18n/navigation";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-16 items-center gap-2 px-4">
        <Link href="/" className="rounded-md focus-visible:ring-2 focus-visible:outline-none">
          <Logo />
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitcher mode="routing" />
          <ThemeToggle />
        </div>
      </header>
      <main id="main" className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
