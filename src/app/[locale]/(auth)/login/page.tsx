import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AuthCard } from "@/features/auth/components/auth-card";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.login");
  return { title: t("title") };
}

// Phase 2 replaces the notice with Google / Facebook / email sign-in.
export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <AuthCard
      title={t("login.title")}
      subtitle={t("login.subtitle")}
      footer={
        <>
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {t("registerLink")}
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
