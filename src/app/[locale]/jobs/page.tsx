import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JobSearchBanner } from "@/components/JobSearchBanner";
import { searchJobs } from "@/lib/job-catalog";
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

export default async function JobsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Jobs" });

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (value !== undefined) query.set(key, Array.isArray(value) ? value.join(",") : value);
  }
  query.set("locale", locale);
  const result = await searchJobs(query, locale);
  return (
    <>
      <h1 className="sr-only">{t("pageTitle")}</h1>
      <JobSearchBanner key={query.toString()} />
      <Suspense>
        <JobList initialResult={result} initialQuery={query.toString()} />
      </Suspense>
    </>
  );
}
