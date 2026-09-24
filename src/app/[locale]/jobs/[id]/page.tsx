import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Link from "next/link";
import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { JobApplyModal } from "@/components/JobApplyModal";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { localeUrl, pageMetadata } from "@/lib/seo";
import { JOB_IDS } from "@/lib/jobs";
import { getImportedJob } from "@/lib/job-catalog";
import { ImportedJobDetail } from "@/components/ImportedJobDetail";


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
  if (imported) return pageMetadata({ locale, path: `/jobs/${id}`, title: imported.title, description: [imported.salary, imported.access, imported.fields['業務内容(概要)']].filter(Boolean).join('｜').slice(0, 180) });
  if (!JOB_IDS.includes(id)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Jobs" });
  const title = t(`job${id}Title` as never);
  const description = [
    t(`job${id}Company` as never),
    t(`job${id}Salary` as never),
    t(`job${id}Access` as never),
  ].join("｜");
  return pageMetadata({
    locale,
    path: `/jobs/${id}`,
    title: `${title} | 株式会社サントー`,
    description,
  });
}

/* ── Label + value row for info table ── */
function InfoRow({ label, children, border = true }: { label: string; children: React.ReactNode; border?: boolean }) {
  return (
    <div className={`flex ${border ? "border-b border-slate-100" : ""}`}>
      <div className="flex w-[110px] shrink-0 items-start bg-santo-sky px-[15px] py-[12px] text-[14px] font-bold leading-[1.5] text-santo-blue sm:w-[140px]">
        {label}
      </div>
      <div className="flex-1 px-[15px] py-[12px] text-[14px] leading-[1.8] text-slate-800">
        {children}
      </div>
    </div>
  );
}

/* ── Section heading ── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b-2 border-santo-navy pb-1 pt-10">
      <h3 className="pl-[15px] text-[14px] font-bold leading-[1.5] text-santo-blue">
        {children}
      </h3>
    </div>
  );
}

/* ── Tag badge ── */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-sm bg-slate-200 px-[6px] py-[1px] text-[12px] leading-[1.5] text-slate-600">
      {children}
    </span>
  );
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const imported = getImportedJob(id);
  if (imported) return <ImportedJobDetail job={imported} locale={locale} />;
  if (!JOB_IDS.includes(id)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Jobs" });
  const d = await getTranslations({ locale, namespace: "JobDetail" });

  const jobIndex = parseInt(id, 10);
  const prefix = `job${id}` as const;

  const job = {
    id: jobIndex,
    company: t(`${prefix}Company` as never),
    title: t(`${prefix}Title` as never),
    image: `/images/jobs/job${String(jobIndex).padStart(2, "0")}.png`,
    salary: t(`${prefix}Salary` as never),
    type: t(`${prefix}Type` as never),
    shift: t(`${prefix}Shift` as never),
    access: t(`${prefix}Access` as never),
    isNew: [1, 2, 5].includes(jobIndex),
  };

  const flowSteps = [
    { num: 1, title: d("flowStep1Title"), desc: d("flowStep1Desc") },
    { num: 2, title: d("flowStep2Title"), desc: d("flowStep2Desc") },
    { num: 3, title: d("flowStep3Title"), desc: d("flowStep3Desc") },
    { num: 4, title: d("flowStep4Title"), desc: d("flowStep4Desc") },
  ];

  return (
    <div className="bg-white text-slate-800">
      <BreadcrumbJsonLd
        items={[
          { name: d("breadcrumbHome"), url: localeUrl(locale, "") },
          { name: d("breadcrumbJobs"), url: localeUrl(locale, "/jobs") },
          { name: job.title },
        ]}
      />
      {/* ══════ Header Nav ══════ */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[768px] items-center justify-between px-[15px] py-[10px]">
          <Link href={`/${locale}/jobs`} className="text-[13px] text-santo-blue hover:opacity-80">
            ← {d("breadcrumbJobs")}
          </Link>
          <p className="text-[12px] text-santo-blue">{job.company}</p>
        </div>
      </div>

      <div className="mx-auto max-w-[768px] px-[15px] pb-[40px]">
        {/* ══════ Title ══════ */}
        <div className="pb-[10px] pt-[25px]">
          <h1 className="text-[20px] font-bold leading-[1.5] text-santo-blue [text-wrap:balance] break-keep sm:text-[24px]">
            {job.title}
          </h1>
        </div>

        {/* ══════ Hero Image ══════ */}
        <div className="py-[10px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={job.image}
            alt={job.title}
            className="w-full rounded-[10px] object-cover"
            style={{ maxHeight: 400 }}
          />
        </div>

        {/* ══════ 勤務地 ══════ */}
        <SectionHeading>{d("locationTitle")}</SectionHeading>
        <div className="py-[12px] pl-[15px] text-[14px] leading-[1.8] text-slate-800">
          <div className="mb-2 flex flex-wrap gap-[6px]">
            {(d(`job${id}LocationTags` as never) as string).split(",").map((tag: string) => (
              <Tag key={tag}>{tag.trim()}</Tag>
            ))}
          </div>
          <p>{d(`job${id}Location` as never)}</p>
        </div>

        {/* ══════ 勤務時間 ══════ */}
        <SectionHeading>{d("hoursTitle")}</SectionHeading>
        <div className="py-[12px] pl-[15px] text-[14px] leading-[1.8] text-slate-800">
          <Tag>{job.type}</Tag>
          <p className="mt-1">{job.shift}</p>
        </div>

        {/* ══════ 休日・休暇 ══════ */}
        <SectionHeading>{d("daysOffTitle")}</SectionHeading>
        <div className="py-[12px] pl-[15px] text-[14px] leading-[1.8] text-slate-800">
          <p className="whitespace-pre-line">{d(`job${id}DaysOff` as never)}</p>
        </div>

        {/* ══════ 職種 ══════ */}
        <SectionHeading>{d("jobCategoryTitle")}</SectionHeading>
        <div className="py-[12px] pl-[15px] text-[14px] leading-[1.8] text-slate-800">
          <Tag>{job.type}</Tag>
          <p className="mt-1">{d(`job${id}Category` as never)}</p>
        </div>

        {/* ══════ 給与 ══════ */}
        <SectionHeading>{d("salaryTitle")}</SectionHeading>
        <div className="py-[12px] pl-[15px] text-[14px] leading-[1.8] text-slate-800">
          <Tag>{job.type}</Tag>
          <p className="mt-1 text-[16px] font-bold">{job.salary}</p>
          <p className="mt-1 text-[13px] text-santo-blue">{d(`job${id}SalaryNote` as never)}</p>
        </div>

        {/* ══════ 仕事内容 ══════ */}
        <SectionHeading>{d("descriptionTitle")}</SectionHeading>
        <div className="py-[15px] pl-[15px] text-[14px] leading-[2] text-slate-800">
          <p className="whitespace-pre-line">{d(`job${id}Description` as never)}</p>
        </div>

        {/* ══════ 経験・資格 ══════ */}
        <SectionHeading>{d("requirementsTitle")}</SectionHeading>
        <div className="py-[15px] pl-[15px]">
          <div className="mb-3 flex flex-wrap gap-[6px]">
            {(d(`job${id}RequirementTags` as never) as string).split(",").map((tag: string) => (
              <Tag key={tag}>{tag.trim()}</Tag>
            ))}
          </div>
          <div className="text-[14px] leading-[2] text-slate-800">
            <p className="whitespace-pre-line">{d(`job${id}Requirements` as never)}</p>
          </div>
        </div>

        {/* ══════ 待遇・福利厚生 ══════ */}
        <SectionHeading>{d("benefitsTitle")}</SectionHeading>
        <div className="py-[15px] pl-[15px] text-[14px] leading-[2] text-slate-800">
          <p className="whitespace-pre-line">{d(`job${id}Benefits` as never)}</p>
        </div>

        {/* ══════ CTA Buttons (mid) ══════ */}
        <div className="py-[20px]">
          <div className="flex gap-[10px]">
            <JobApplyModal
              locale={locale}
              jobId={id}
              jobTitle={job.title}
              jobCompany={job.company}
              buttonLabel={d("ctaButton")}
            />
            <a
              href="tel:0463-24-1722"
              className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border-2 border-santo-navy py-[16px] text-[17px] font-bold text-santo-navy transition hover:bg-santo-navy hover:text-white"
              style={{ minHeight: 60 }}
            >
              <Phone className="h-4 w-4" />
              {d("callButton")}
            </a>
          </div>
        </div>

        {/* ══════ 応募から就業までの流れ ══════ */}
        <SectionHeading>{d("flowTitle")}</SectionHeading>
        <div className="py-[20px]">
          <div className="flex flex-col gap-0">
            {flowSteps.map((step, i) => (
              <div key={step.num} className={`flex gap-[15px] ${i < flowSteps.length - 1 ? "pb-[20px]" : ""}`}>
                {/* Number circle + line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-santo-navy text-[14px] font-bold text-white">
                    {step.num}
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div className="w-[2px] flex-1 bg-slate-200" />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 pb-[5px]">
                  <p className="text-[14px] font-bold leading-[36px] text-slate-800">
                    {step.title}
                  </p>
                  <p className="text-[13px] leading-[1.8] text-santo-blue">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════ FAQ ══════ */}
        <SectionHeading>{d("faqTitle")}</SectionHeading>
        <div className="py-[15px]">
          {[1, 2, 3, 4].map((n) => (
            <details key={n} className="mb-[10px] rounded-[10px] bg-santo-navy text-white">
              <summary className="cursor-pointer px-[15px] py-[15px] text-[14px] font-bold leading-[1.5]">
                {d(`faq${n}Q` as never)}
              </summary>
              <div className="px-[15px] pb-[15px] text-[13px] leading-[1.8] text-white/80">
                {d(`faq${n}A` as never)}
              </div>
            </details>
          ))}
        </div>

        {/* ══════ Company Info ══════ */}
        <SectionHeading>{d("companyInfoTitle")}</SectionHeading>
        <div className="py-[12px]">
          <InfoRow label={d("companyNameLabel")} border={false}>{job.company}</InfoRow>
        </div>

        {/* ══════ CTA Buttons (bottom) ══════ */}
        <div className="py-[20px]">
          <div className="flex gap-[10px]">
            <JobApplyModal
              locale={locale}
              jobId={id}
              jobTitle={job.title}
              jobCompany={job.company}
              buttonLabel={d("ctaButton")}
            />
            <a
              href="tel:0463-24-1722"
              className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border-2 border-santo-navy py-[16px] text-[17px] font-bold text-santo-navy transition hover:bg-santo-navy hover:text-white"
              style={{ minHeight: 60 }}
            >
              <Phone className="h-4 w-4" />
              {d("callButton")}
            </a>
          </div>
        </div>

        {/* ══════ Breadcrumb (footer) ══════ */}
        <div className="border-t border-slate-100 py-[15px] text-[12px] text-santo-blue">
          <Link href={`/${locale}`} className="hover:underline">{d("breadcrumbHome")}</Link>
          {" > "}
          <Link href={`/${locale}/jobs`} className="hover:underline">{d("breadcrumbJobs")}</Link>
          {" > "}
          <span className="text-slate-800">{job.title}</span>
        </div>

        {/* ══════ Footer ══════ */}
        <div className="border-t border-slate-100 py-[20px] text-center text-[11px] text-santo-blue">
          <p>© {job.company} All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}
