import {
  Apple,
  ClipboardCheck,
  Dumbbell,
  LineChart,
  MessageCircle,
  RefreshCw,
  Video,
  VideoIcon,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type ServiceKey =
  | "program"
  | "support"
  | "formCheck"
  | "checkIn"
  | "videoCall"
  | "diet"
  | "adjustments"
  | "progress";

const services: { key: ServiceKey; icon: LucideIcon }[] = [
  { key: "program", icon: Dumbbell },
  { key: "support", icon: MessageCircle },
  { key: "formCheck", icon: Video },
  { key: "checkIn", icon: ClipboardCheck },
  { key: "videoCall", icon: VideoIcon },
  { key: "diet", icon: Apple },
  { key: "adjustments", icon: RefreshCw },
  { key: "progress", icon: LineChart },
];

/** Landing page skeleton. The full marketing site (pricing, testimonials, FAQ…) is Phase 14. */
export default async function HomePage() {
  const t = await getTranslations("marketing");

  return (
    <>
      <section className="bg-grit">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-20 sm:py-28 lg:px-8">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            {t("hero.eyebrow")}
          </p>
          <h1 className="max-w-3xl font-display text-5xl leading-[0.95] tracking-wide sm:text-7xl">
            {t("hero.title")}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{t("hero.subtitle")}</p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <Link href="/register">{t("hero.ctaPrimary")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
              <Link href="/register?type=coach">{t("hero.ctaSecondary")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 lg:px-8">
        <h2 className="mb-8 font-display text-4xl tracking-wide">{t("services.title")}</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ key, icon: Icon }) => (
            <li key={key} className="flex items-start gap-3 rounded-xl border bg-card p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="font-medium">{t(`services.${key}`)}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
