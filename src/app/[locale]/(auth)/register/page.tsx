import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AuthCard } from "@/features/auth/components/auth-card";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.register");
  return { title: t("title") };
}

// Phase 2 replaces the notice with Google / Facebook / email sign-up.
export default async function RegisterPage() {
  const t = await getTranslations("auth");

  return (
    <AuthCard
      title={t("register.title")}
      subtitle={t("register.subtitle")}
      footer={
        <>
          {t("haveAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {t("loginLink")}
          </Link>
        </>
      }
    >
      <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
        {t("phaseNotice")}
      </p>
    </AuthCard>
  );
}
