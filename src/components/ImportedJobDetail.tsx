import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { JobApplyModal } from './JobApplyModal';
import { BreadcrumbJsonLd } from './JsonLd';
import { importedHeaders, getImportedJob } from '@/lib/job-catalog';
import { localeUrl } from '@/lib/seo';

type Props = { job: NonNullable<ReturnType<typeof getImportedJob>>; locale: string };
export async function ImportedJobDetail({ job, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'Jobs' });
  const d = await getTranslations({ locale, namespace: 'JobDetail' });
  const sections = [
    { title: '募集情報・勤務地', start: 0, end: 6 },
    { title: '応募条件・雇用形態・試用期間', start: 6, end: 12 },
    { title: '勤務時間・休日', start: 12, end: 24 },
    { title: '職種・仕事内容', start: 24, end: 28 },
    { title: '寮・資格・経験', start: 28, end: 33 },
    { title: '給与・賞与・昇給', start: 33, end: 41 },
    { title: '通勤・職場環境', start: 41, end: 50 },
    { title: '特徴・福利厚生・選考', start: 50, end: 57 },
  ];
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-slate-800 sm:py-12">
      <BreadcrumbJsonLd items={[
        { name: d('breadcrumbHome'), url: localeUrl(locale, '') },
        { name: d('breadcrumbJobs'), url: localeUrl(locale, '/jobs') },
        { name: job.title },
      ]} />
      <Link href={`/${locale}/jobs`} className="text-sm text-santo-navy hover:underline">← {d('breadcrumbJobs')}</Link>
      <p className="mt-7 text-sm text-slate-500">{job.company} · {t('jobReference', { id: job.id })}</p>
      <h1 className="mt-2 text-2xl font-bold leading-relaxed text-santo-navy">{job.title}</h1>
      {locale !== 'ja' && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{t('sourceLanguageNote')}</p>}
      {job.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={job.image} alt={job.title} className="mt-6 max-h-96 w-full rounded-xl object-cover" />
      )}
      <div className="my-6 rounded-xl bg-slate-50 p-5">
        <p className="text-lg font-bold text-santo-navy">{job.salary}</p>
        <p className="mt-2 text-sm">{job.type} · {job.access}</p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{job.fields['業務内容(概要)']}</p>
      </div>
      <div className="flex" id="apply">
        <JobApplyModal locale={locale} jobId={String(job.id)} jobTitle={job.title} jobCompany="" buttonLabel={d('ctaButton')} />
      </div>
      {sections.map(section => {
        const fields = importedHeaders.slice(section.start, section.end).filter(key => job.fields[key] !== '');
        if (!fields.length) return null;
        return <section key={section.title} className="mt-9">
          <h2 className="border-b-2 border-santo-navy pb-3 text-lg font-bold text-santo-navy">{section.title}</h2>
          <dl>
            {fields.map(key => <div key={key} className="grid border-b border-slate-100 sm:grid-cols-[180px_1fr]">
              <dt className="bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">{key}</dt>
              <dd className="min-w-0 whitespace-pre-wrap break-words px-4 py-3 text-sm leading-7">{job.fields[key]}</dd>
            </div>)}
          </dl>
        </section>;
      })}
      <div className="mt-8 flex">
        <Link href={`/${locale}/jobs/${job.id}/apply`} className="w-full rounded-xl bg-santo-navy p-4 text-center font-bold text-white hover:bg-santo-blue">{d('ctaButton')}</Link>
      </div>
    </article>
  );
}
