import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import { fontVariables } from "@/app/fonts";
import { Providers } from "@/components/providers";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Shared <html>/<body> for every root layout (public [locale] routes and portals). */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} className={cn(fontVariables, "h-full")} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
