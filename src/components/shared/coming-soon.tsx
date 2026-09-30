import { Construction } from "lucide-react";
import { getTranslations } from "next-intl/server";

/** Placeholder for portal sections that later phases fill in. */
export async function ComingSoon({ title }: { title: string }) {
  const t = await getTranslations("common");
  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-display text-4xl tracking-wide sm:text-5xl">
        {t("comingSoonTitle", { section: title })}
      </h1>
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card p-10 text-center text-muted-foreground">
        <Construction className="size-10 text-primary" aria-hidden />
        <p className="max-w-md">{t("comingSoonBody")}</p>
      </div>
    </section>
  );
}
