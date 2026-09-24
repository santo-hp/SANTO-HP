import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { JobApplyForm } from "@/components/JobApplyForm";
import { JOB_IDS } from "@/lib/jobs";
import { getImportedJob } from "@/lib/job-catalog";


export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    JOB_IDS.map((id) => ({ locale, id }))
  );
}

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const imported = getImportedJob(id);
  if (!imported && !JOB_IDS.includes(id)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Jobs" });
  const a = await getTranslations({ locale, namespace: "JobApply" });
  return {
    title: `${a("pageTitle")} | ${imported?.title ?? t(`job${id}Title` as never)}`,
    robots: { index: false, follow: false },
  };
}

export default async function JobApplyPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const imported = getImportedJob(id);
  if (!imported && !JOB_IDS.includes(id)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Jobs" });
  const a = await getTranslations({ locale, namespace: "JobApply" });

  const jobTitle = imported?.title ?? t(`job${id}Title` as never) as string;
  const jobCompany = imported ? "" : t(`job${id}Company` as never) as string;

  return (
    <div className="bg-white text-slate-800">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[768px] items-center justify-between px-[15px] py-[10px]">
          <Link
            href={`/${locale}/jobs/${id}`}
            className="flex items-center gap-1 text-[13px] text-santo-blue hover:opacity-80"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {a("backToJob")}
          </Link>
          <p className="text-[12px] text-santo-blue">{jobCompany}</p>
        </div>
      </div>

      <div className="mx-auto max-w-[768px] px-[15px] pb-[60px]">
        <div className="pb-[10px] pt-[25px]">
          <p className="mb-2 text-[11px] font-black tracking-[0.25em] text-santo-light">
            {a("pageLabel")}
          </p>
          <h1 className="text-[22px] font-bold leading-[1.4] text-santo-navy sm:text-[26px]">
            {a("pageTitle")}
          </h1>
          <p className="mt-2 text-[13px] leading-[1.8] text-slate-500 sm:text-[14px]">
            {a("pageDesc")}
          </p>
        </div>

        <div className="pt-[15px]">
          <JobApplyForm
            locale={locale}
            jobId={id}
            jobTitle={jobTitle}
            jobCompany={jobCompany}
          />
        </div>
      </div>
    </div>
  );
}
