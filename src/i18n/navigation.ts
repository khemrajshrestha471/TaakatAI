import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/** Locale-aware navigation for PUBLIC (locale-prefixed) pages only. Portals use next/link. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
