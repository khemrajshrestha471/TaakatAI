import { cookies } from "next/headers";
import type { ReactNode } from "react";

import { SIDEBAR_COOKIE } from "@/components/shared/portal-nav";
import { PortalShell } from "@/components/shared/portal-shell";

// Phase 2: guard with requireSession({ roles: [...] }) before rendering.
export default async function AppLayout({ children }: { children: ReactNode }) {
  const collapsed = (await cookies()).get(SIDEBAR_COOKIE)?.value === "1";
  return (
    <PortalShell portal="client" defaultCollapsed={collapsed}>
      {children}
    </PortalShell>
  );
}
