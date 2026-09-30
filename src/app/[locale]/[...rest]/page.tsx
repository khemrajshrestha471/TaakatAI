import { notFound } from "next/navigation";

/** Unknown paths under /en or /ne render the localized 404 instead of the global one. */
export default function CatchAll() {
  notFound();
}
