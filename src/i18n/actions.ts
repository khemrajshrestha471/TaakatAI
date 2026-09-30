"use server";

import { cookies } from "next/headers";
import { z } from "zod";

import { LOCALE_COOKIE, locales } from "./routing";

const schema = z.enum(locales);

/** Saves the language for unprefixed routes (portals). Phase 2 also persists it on the user. */
export async function setLocaleAction(input: unknown) {
  const locale = schema.parse(input);
  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
