import "./globals.css";

import type { Metadata } from "next";
import Link from "next/link";

import { fontVariables } from "@/app/fonts";
import en from "@/i18n/messages/en.json";
import ne from "@/i18n/messages/ne.json";

export const metadata: Metadata = { title: `404 — ${en.notFound.title}` };

/** Unmatched URLs outside any root layout. Language is unknown here, so show both. */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${fontVariables} dark`}>
      <body className="grid min-h-dvh place-items-center px-4 text-center">
        <main className="flex flex-col items-center gap-4">
          <p className="font-display text-7xl text-primary">404</p>
          <h1 className="font-display text-3xl tracking-wide">{en.notFound.title}</h1>
          <p className="max-w-md text-muted-foreground">{en.notFound.body}</p>
          <p lang="ne" className="max-w-md text-muted-foreground">
            {ne.notFound.title} — {ne.notFound.body}
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex h-11 items-center rounded-lg bg-primary px-6 font-medium text-primary-foreground"
          >
            {en.common.backHome} / {ne.common.backHome}
          </Link>
        </main>
      </body>
    </html>
  );
}
