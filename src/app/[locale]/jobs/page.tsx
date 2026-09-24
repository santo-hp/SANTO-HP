import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JobSearchBanner } from "@/components/JobSearchBanner";
import { JobList } from "@/components/JobList";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Jobs" });
  return pageMetadata({
    locale,
    path: "/jobs",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function JobsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Jobs" });

  return (
    <>
      <h1 className="sr-only">{t("pageTitle")}</h1>
      <JobSearchBanner />
      <Suspense>
        <JobList />
      </Suspense>
    </>
  );
}
