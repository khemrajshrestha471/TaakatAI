import {
  Apple,
  BadgeCheck,
  Bot,
  Building2,
  Check,
  ClipboardCheck,
  Dumbbell,
  Languages,
  LineChart,
  MessageCircle,
  Quote,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRound,
  Video,
  VideoIcon,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { saasPlans, TRIAL_DAYS } from "@/config/plans";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10 flex max-w-2xl flex-col gap-3">
      {eyebrow && (
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">{eyebrow}</p>
      )}
      <h2 className="font-display text-4xl tracking-wide sm:text-5xl">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------

export async function Hero() {
  const t = await getTranslations("marketing.hero");
  const tl = await getTranslations("landing.hero");
  const highlights = [
    { icon: Smartphone, label: tl("mobile") },
    { icon: Languages, label: tl("bilingual") },
    { icon: ShieldCheck, label: tl("private") },
  ];

  return (
    <section className="bg-grit overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="flex flex-col items-start gap-6">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="font-display text-5xl leading-[0.95] tracking-wide sm:text-7xl">
            {t("title")}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">{t("subtitle")}</p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <Link href="/register">{t("ctaPrimary")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
              <Link href="#for-coaches">{t("ctaSecondary")}</Link>
            </Button>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="size-4 text-primary" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
        <HeroPreview />
      </div>
    </section>
  );
}

/** A stylized phone-sized preview of the client "Today" screen. */
async function HeroPreview() {
  const t = await getTranslations("landing.preview");
  const format = await getFormatter();
  const macros = [
    { label: t("protein"), value: 96, target: 140 },
    { label: t("carbs"), value: 120, target: 190 },
    { label: t("fat"), value: 31, target: 55 },
  ];

  return (
    <div aria-hidden className="mx-auto w-full max-w-sm">
      <div className="rounded-[2rem] border bg-card p-4 shadow-2xl shadow-primary/10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{t("greeting")}</p>
            <p className="font-display text-2xl tracking-wide">{t("today")}</p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            🔥 {t("streak", { days: 12 })}
          </span>
        </div>
        <div className="mb-3 rounded-xl bg-primary p-4 text-primary-foreground">
          <p className="text-xs opacity-80">{t("workoutLabel")}</p>
          <p className="font-display text-2xl tracking-wide">{t("workoutName")}</p>
          <p className="text-xs opacity-80">{t("workoutMeta")}</p>
        </div>
        <div className="mb-3 rounded-xl border p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <p className="text-sm font-medium">{t("nutrition")}</p>
            <p className="text-xs text-muted-foreground">
              {format.number(1240)} / {format.number(1850)} kcal
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {macros.map((m) => (
              <div key={m.label} className="flex items-center gap-2 text-xs">
                <span className="w-16 text-muted-foreground">{m.label}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${(m.value / m.target) * 100}%` }}
                  />
                </span>
                <span className="w-14 text-right tabular-nums">
                  {format.number(m.value)}/{format.number(m.target)}g
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-primary/50 p-3">
          <ClipboardCheck className="size-5 text-primary" />
          <p className="text-xs">{t("checkInDue")}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export async function PaymentStrip() {
  const t = await getTranslations("landing.payments");
  const methods = ["eSewa", "Khalti", "Stripe", "PayPal", t("cash")];
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between lg:px-8">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Wallet className="size-4 text-primary" aria-hidden />
          {t("title")}
        </p>
        <ul className="flex flex-wrap justify-center gap-2">
          {methods.map((m) => (
            <li
              key={m}
              className="rounded-md border bg-background px-3 py-1.5 text-sm font-semibold"
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

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

export async function Services() {
  const t = await getTranslations("marketing.services");
  const tl = await getTranslations("landing.services");
  return (
    <section id="features" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 lg:px-8">
      <SectionHeading eyebrow={tl("eyebrow")} title={t("title")} subtitle={tl("subtitle")} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ key, icon: Icon }) => (
          <li key={key} className="flex flex-col gap-3 rounded-xl border bg-card p-5">
            <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="font-semibold">{t(key)}</h3>
            <p className="text-sm text-muted-foreground">{tl(key)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------------

export async function HowItWorks() {
  const t = await getTranslations("landing.how");
  const steps = [
    { n: 1, title: t("step1Title"), body: t("step1Body") },
    { n: 2, title: t("step2Title"), body: t("step2Body") },
    { n: 3, title: t("step3Title"), body: t("step3Body") },
  ];
  const format = await getFormatter();
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="relative flex flex-col gap-3 rounded-xl border bg-card p-6">
              <span className="font-display text-6xl leading-none text-primary">
                {format.number(s.n, { minimumIntegerDigits: 2 })}
              </span>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export async function AiSection() {
  const t = await getTranslations("landing.ai");
  const points = [
    { icon: ClipboardCheck, title: t("p1Title"), body: t("p1Body") },
    { icon: Video, title: t("p2Title"), body: t("p2Body") },
    { icon: Bot, title: t("p3Title"), body: t("p3Body") },
    { icon: ShieldCheck, title: t("p4Title"), body: t("p4Body") },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
          <ul className="grid gap-5 sm:grid-cols-2">
            {points.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex flex-col gap-2">
                <Icon className="size-5 text-primary" aria-hidden />
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div aria-hidden className="rounded-2xl border bg-card p-5 shadow-xl">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <p className="text-sm font-semibold">{t("cardTitle")}</p>
            <Badge variant="outline" className="ml-auto">
              {t("draft")}
            </Badge>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">{t("cardSummary")}</p>
          <div className="mb-4 rounded-lg border-l-4 border-primary bg-primary/5 p-3 text-sm">
            <p className="font-medium">{t("cardSuggestionTitle")}</p>
            <p className="text-muted-foreground">{t("cardSuggestion")}</p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground">
              {t("approve")}
            </span>
            <span className="inline-flex h-9 items-center rounded-lg border px-3 text-sm font-medium">
              {t("edit")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export async function ForCoaches() {
  const t = await getTranslations("landing.coaches");
  const cards = [
    {
      icon: UserRound,
      title: t("coachTitle"),
      body: t("coachBody"),
      points: [t("coachP1"), t("coachP2"), t("coachP3"), t("coachP4")],
    },
    {
      icon: Building2,
      title: t("gymTitle"),
      body: t("gymBody"),
      points: [t("gymP1"), t("gymP2"), t("gymP3"), t("gymP4")],
    },
  ];
  return (
    <section id="for-coaches" className="scroll-mt-20 border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map(({ icon: Icon, title, body, points }) => (
            <article key={title} className="flex flex-col gap-4 rounded-xl border bg-card p-6">
              <span className="grid size-12 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="font-display text-3xl tracking-wide">{title}</h3>
              <p className="text-muted-foreground">{body}</p>
              <ul className="flex flex-col gap-2">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

/** Illustrative results. Real before/after photos require client consent (Phase 14). */
export async function Transformations() {
  const t = await getTranslations("landing.results");
  const format = await getFormatter();
  const items = [
    { name: "S. G.", goal: t("goalFatLoss"), change: -8.2, unit: "kg", weeks: 16 },
    { name: "B. T.", goal: t("goalMuscle"), change: 4.5, unit: "kg", weeks: 20 },
    { name: "P. M.", goal: t("goalRecomp"), change: -9, unit: "cm", weeks: 12 },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <ul className="grid gap-6 md:grid-cols-3">
        {items.map((r) => (
          <li key={r.name} className="overflow-hidden rounded-xl border bg-card">
            <div className="grid grid-cols-2 gap-px bg-border" aria-hidden>
              {[t("before"), t("after")].map((label, i) => (
                <div
                  key={label}
                  className={cn(
                    "flex aspect-3/4 items-end p-3 text-xs font-semibold tracking-wide uppercase",
                    i === 0 ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary",
                  )}
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-muted-foreground">{r.goal}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl leading-none tracking-wide text-primary">
                  {format.number(r.change, { signDisplay: "always" })} {r.unit}
                </p>
                <p className="text-xs text-muted-foreground">{t("weeks", { count: r.weeks })}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <BadgeCheck className="size-4" aria-hidden />
        {t("consentNote")}
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------

export async function Pricing() {
  const t = await getTranslations("landing.pricing");
  const tp = await getTranslations("plans");
  const format = await getFormatter();
  const unlimited = t("unlimited");
  const limit = (n: number | null) => (n === null ? unlimited : format.number(n));

  return (
    <section id="pricing" className="scroll-mt-20 border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle", { days: TRIAL_DAYS })}
        />
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {saasPlans.map((plan) => (
            <li
              key={plan.id}
              className={cn(
                "relative flex flex-col gap-5 rounded-xl border bg-card p-6",
                plan.highlighted && "border-primary ring-2 ring-primary",
              )}
            >
              {plan.highlighted && <Badge className="absolute -top-3 left-6">{t("popular")}</Badge>}
              <div>
                <p className="text-sm text-muted-foreground">
                  {plan.audience === "gym" ? t("forGyms") : t("forCoaches")}
                </p>
                <h3 className="font-display text-3xl tracking-wide">{tp(`${plan.id}.name`)}</h3>
              </div>
              <div>
                <p className="font-display text-4xl tracking-wide">
                  {format.number(plan.monthly.npr, {
                    style: "currency",
                    currency: "NPR",
                    maximumFractionDigits: 0,
                  })}
                  <span className="font-sans text-sm text-muted-foreground"> {t("perMonth")}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("orUsd", {
                    price: format.number(plan.monthly.usd, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }),
                  })}
                </p>
              </div>
              <ul className="flex flex-1 flex-col gap-2 text-sm">
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  {t("coaches", { value: limit(plan.limits.coaches) })}
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  {t("clients", { value: limit(plan.limits.clients) })}
                </li>
                {plan.audience === "gym" && (
                  <li className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {t("branches", { value: limit(plan.limits.branches) })}
                  </li>
                )}
                <li className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  {t("aiCredits", { value: format.number(plan.limits.aiCredits) })}
                </li>
                {plan.features.customBranding && (
                  <li className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {t("branding")}
                  </li>
                )}
                {plan.features.customSubdomain && (
                  <li className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {t("subdomain")}
                  </li>
                )}
                {plan.features.prioritySupport && (
                  <li className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {t("support")}
                  </li>
                )}
              </ul>
              <Button asChild variant={plan.highlighted ? "default" : "outline"} className="h-11">
                <Link href={`/register?plan=${plan.id}`}>{t("cta", { days: TRIAL_DAYS })}</Link>
              </Button>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">{t("clientNote")}</p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

/** TODO(owner): replace with real, consented testimonials before launch. */
export async function Testimonials() {
  const t = await getTranslations("landing.testimonials");
  const items = [
    { quote: t("q1"), name: "Sita G.", role: t("r1") },
    { quote: t("q2"), name: "Aarav S.", role: t("r2") },
    { quote: t("q3"), name: "Iron Temple Gym", role: t("r3") },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
      <ul className="grid gap-6 md:grid-cols-3">
        {items.map((it) => (
          <li key={it.name} className="flex flex-col gap-4 rounded-xl border bg-card p-6">
            <Quote className="size-6 text-primary" aria-hidden />
            <blockquote className="flex-1 text-lg leading-relaxed">“{it.quote}”</blockquote>
            <div>
              <p className="font-semibold">{it.name}</p>
              <p className="text-sm text-muted-foreground">{it.role}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">{t("note")}</p>
    </section>
  );
}

// ---------------------------------------------------------------------------

export async function Faq() {
  const t = await getTranslations("landing.faq");
  const keys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"] as const;
  return (
    <section id="faq" className="scroll-mt-20 border-y bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[1fr_2fr] lg:px-8">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <Accordion type="single" collapsible className="w-full">
          {keys.map((k) => (
            <AccordionItem key={k} value={k}>
              <AccordionTrigger className="py-4 text-left text-base">
                {t(`${k}.question`)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t(`${k}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export async function FinalCta() {
  const t = await getTranslations("landing.cta");
  const tm = await getTranslations("marketing.hero");
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="bg-grit flex flex-col items-start gap-6 rounded-2xl border bg-card p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="font-display text-4xl tracking-wide sm:text-5xl">{t("title")}</h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg" className="h-12 px-6 text-base">
            <Link href="/register">{tm("ctaPrimary")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
            <Link href="/register?type=coach">{t("coachCta")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
