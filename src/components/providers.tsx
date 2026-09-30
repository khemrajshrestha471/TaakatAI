"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState, type ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * next-themes renders an inline <script> that sets the theme class before paint. That script only
 * needs to run in the server-rendered HTML. When the root layout re-renders on the client (e.g.
 * switching /en → /ne), React warns about client-rendered scripts, so there we mark it as a
 * non-executable data block, which React ignores. The theme is already applied by then.
 */
const themeScriptProps =
  typeof window === "undefined" ? undefined : ({ type: "application/json" } as const);

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } }),
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      scriptProps={themeScriptProps}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={300}>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
