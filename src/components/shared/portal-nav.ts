import {
  Apple,
  BarChart3,
  Bot,
  Building2,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  Dumbbell,
  Home,
  LayoutDashboard,
  LineChart,
  MessageCircle,
  ScrollText,
  Settings,
  Tags,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

export type PortalId = "client" | "coach" | "guardian" | "superAdmin";

export type NavItem = {
  href: string;
  /** Key inside the `portal` messages namespace. */
  labelKey: `${PortalId}.nav.${string}`;
  icon: LucideIcon;
};

export const portalNav = {
  client: [
    { href: "/app", labelKey: "client.nav.home", icon: Home },
    { href: "/app/train", labelKey: "client.nav.train", icon: Dumbbell },
    { href: "/app/diet", labelKey: "client.nav.diet", icon: Apple },
    { href: "/app/progress", labelKey: "client.nav.progress", icon: LineChart },
    { href: "/app/chat", labelKey: "client.nav.chat", icon: MessageCircle },
  ],
  coach: [
    { href: "/coach", labelKey: "coach.nav.dashboard", icon: LayoutDashboard },
    { href: "/coach/clients", labelKey: "coach.nav.clients", icon: Users },
    { href: "/coach/programs", labelKey: "coach.nav.programs", icon: Dumbbell },
    { href: "/coach/diet", labelKey: "coach.nav.diet", icon: Apple },
    { href: "/coach/check-ins", labelKey: "coach.nav.checkIns", icon: ClipboardCheck },
    { href: "/coach/form-checks", labelKey: "coach.nav.formChecks", icon: Video },
    { href: "/coach/calendar", labelKey: "coach.nav.calendar", icon: CalendarDays },
    { href: "/coach/payments", labelKey: "coach.nav.payments", icon: CreditCard },
    { href: "/coach/settings", labelKey: "coach.nav.settings", icon: Settings },
  ],
  guardian: [
    { href: "/guardian", labelKey: "guardian.nav.overview", icon: Home },
    { href: "/guardian/plans", labelKey: "guardian.nav.plans", icon: Dumbbell },
    { href: "/guardian/progress", labelKey: "guardian.nav.progress", icon: LineChart },
    { href: "/guardian/chat", labelKey: "guardian.nav.chat", icon: MessageCircle },
    { href: "/guardian/payments", labelKey: "guardian.nav.payments", icon: CreditCard },
  ],
  superAdmin: [
    { href: "/super-admin", labelKey: "superAdmin.nav.overview", icon: LayoutDashboard },
    { href: "/super-admin/workspaces", labelKey: "superAdmin.nav.workspaces", icon: Building2 },
    { href: "/super-admin/plans", labelKey: "superAdmin.nav.plans", icon: Tags },
    { href: "/super-admin/revenue", labelKey: "superAdmin.nav.revenue", icon: BarChart3 },
    { href: "/super-admin/ai-usage", labelKey: "superAdmin.nav.aiUsage", icon: Bot },
    { href: "/super-admin/audit-logs", labelKey: "superAdmin.nav.auditLogs", icon: ScrollText },
  ],
} as const satisfies Record<PortalId, readonly NavItem[]>;

/** Portal root links match exactly; nested links also match their sub-pages. */
export function isActive(pathname: string, href: string, rootHref: string) {
  if (href === rootHref) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const SIDEBAR_COOKIE = "sidebar_collapsed";
