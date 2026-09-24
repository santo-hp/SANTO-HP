"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { JOB_IDS } from "@/lib/jobs";

// 各求人のフィルタ用メタデータ（言語非依存）
// area/line/jobType のキーは JobSearchForm と一致させている
type JobMeta = {
  area: string[];        // areaOptions keys
  line: string[];        // lineOptions keys
  jobType: string[];     // jobTypeOptions keys
  hourlyMin: number;     // 時給下限（円）
  salaryTypes: string[]; // 支給区分（hourly/daily/monthly）
  employment: string[];  // 雇用形態
  period: string[];      // 勤務期間
  features: string[];    // 特徴
};

const JOB_META: Record<number, JobMeta> = {
  1:  { area: ["koto"], line: ["jr_east"], jobType: ["assembly"], hourlyMin: 1600, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  2:  { area: ["atsugi"], line: ["odakyu"], jobType: ["forklift"], hourlyMin: 1600, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation"] },
  3:  { area: ["ota"], line: ["keikyu"], jobType: ["inspection"], hourlyMin: 1800, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  4:  { area: ["ota"], line: ["keikyu"], jobType: ["assembly","inspection"], hourlyMin: 1400, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  5:  { area: ["hadano"], line: ["odakyu"], jobType: ["press"], hourlyMin: 1300, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  6:  { area: ["ota"], line: ["keikyu"], jobType: ["press"], hourlyMin: 1300, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  7:  { area: ["atsugi"], line: ["odakyu","sagami"], jobType: ["plc"], hourlyMin: 2300, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation"] },
  8:  { area: ["atsugi"], line: ["odakyu","sagami"], jobType: ["press","assembly"], hourlyMin: 1400, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  9:  { area: ["ota"], line: ["keikyu"], jobType: ["press","assembly"], hourlyMin: 1350, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  10: { area: ["atsugi"], line: ["odakyu"], jobType: ["assembly"], hourlyMin: 1600, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience","dormitory"] },
  11: { area: ["sagamihara"], line: ["jr_east"], jobType: ["line"], hourlyMin: 1400, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  12: { area: ["sagamihara"], line: ["jr_east"], jobType: ["machine","line"], hourlyMin: 1600, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  13: { area: ["sagamihara"], line: ["jr_east"], jobType: ["machine","line"], hourlyMin: 1400, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  14: { area: ["sagamihara"], line: ["jr_east"], jobType: ["machine","line"], hourlyMin: 1600, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  15: { area: ["ayase"], line: ["sagami"], jobType: ["welding","assembly"], hourlyMin: 1400, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  16: { area: ["samukawa"], line: ["jr_east"], jobType: ["inspection","line"], hourlyMin: 1900, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation"] },
};

// 現在掲載中の求人を勤務時間帯で分類する。
// 記載がない求人は日勤のみとして扱い、交替勤務には日勤帯と夜勤帯の両方を含める。
const JOB_WORK_SCHEDULE: Record<number, string[]> = {
  10: ["day", "night"],
  11: ["day", "night"],
  16: ["day", "night"],
};

export function JobList() {
  const t = useTranslations("Jobs");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const toggleFav = (id: number) =>
    setFavorites((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const allJobs = JOB_IDS.map((jobId) => {
    const id = parseInt(jobId, 10);
    return {
      id,
      company: t(`job${id}Company` as never) as string,
      title: t(`job${id}Title` as never) as string,
      image: `/images/jobs/job${String(id).padStart(2, "0")}.png`,
      salary: t(`job${id}Salary` as never) as string,
      type: t(`job${id}Type` as never) as string,
      shift: t(`job${id}Shift` as never) as string,
      access: t(`job${id}Access` as never) as string,
    };
  });

  // 検索パラメータをパース（カンマ区切り、no_preference は無視）
  const parseParam = (name: string) =>
    (searchParams.get(name) || "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && s !== "no_preference");

  const selArea = parseParam("area");
  const selLine = parseParam("line");
  const selJobType = parseParam("jobType");
  const selEmployment = parseParam("employment");
  const selWorkSchedule = parseParam("workSchedule");
  const selSalary = parseParam("salary");
  const selFeatures = parseParam("features");
  const q = searchParams.get("q")?.trim() || "";

  const activeFilters: string[] = [];
  if (selArea.length) activeFilters.push(...selArea);
  if (selLine.length) activeFilters.push(...selLine);
  if (selJobType.length) activeFilters.push(...selJobType);
  if (selEmployment.length) activeFilters.push(...selEmployment);
  if (selWorkSchedule.length) activeFilters.push(...selWorkSchedule);
  if (selSalary.length) activeFilters.push(...selSalary);
  if (selFeatures.length) activeFilters.push(...selFeatures);
  if (q) activeFilters.push(q);

  // 各フィールドでの絞り込み: 各フィールド内は OR、フィールド間は AND
  const jobs = allJobs.filter((job) => {
    const meta = JOB_META[job.id];
    if (!meta) return false;

    if (showFavoritesOnly && !favorites.includes(job.id)) return false;

    const anyIn = (selected: string[], pool: string[]) =>
      selected.length === 0 || selected.some((s) => pool.includes(s));

    if (!anyIn(selArea, meta.area)) return false;
    if (!anyIn(selLine, meta.line)) return false;
    if (!anyIn(selJobType, meta.jobType)) return false;
    if (!anyIn(selEmployment, meta.employment)) return false;
    if (!anyIn(selWorkSchedule, JOB_WORK_SCHEDULE[job.id] ?? ["day"])) return false;
    if (!anyIn(selFeatures, meta.features)) return false;

    // 給与レンジ: 選択された最小閾値以上の時給なら OK
    if (selSalary.length > 0) {
      const thresholds = selSalary.map((s) => parseInt(s, 10)).filter((n) => !isNaN(n));
      if (thresholds.length > 0) {
        const minThreshold = Math.min(...thresholds);
        if (meta.hourlyMin < minThreshold) return false;
      }
    }

    // フリーワード: 表示フィールドを連結して部分一致（大文字小文字無視、スペース区切りで AND）
    if (q) {
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      if (terms.length > 0) {
        const hay = `${job.company} ${job.title} ${job.salary} ${job.type} ${job.shift} ${job.access}`.toLowerCase();
        if (!terms.every((term) => hay.includes(term))) return false;
      }
    }

    return true;
  });

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* 戻る + 件数 + お気に入り絞り込み */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/${locale}/jobseekers`}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToSearch")}
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFavoritesOnly((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-[13px] font-bold tracking-wide transition ${
                showFavoritesOnly
                  ? "border-orange-400 bg-orange-400 text-white hover:bg-orange-500"
                  : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-500"
              }`}
            >
              <Star
                className="h-4 w-4"
                fill={showFavoritesOnly ? "currentColor" : "none"}
              />
              {showFavoritesOnly ? t("showAll") : t("favoritesOnly")}
              <span className={`ml-1 rounded-full px-1.5 text-[11px] ${showFavoritesOnly ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>
                {favorites.length}
              </span>
            </button>
            <p className="text-[14px] text-slate-500">
              {t("resultCount", { count: jobs.length })}
              {activeFilters.length > 0 && (
                <span className="ml-2 text-slate-400">
                  ({activeFilters.join(", ")})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* 未ヒット時 */}
        {jobs.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-[14px] text-slate-500">
            {showFavoritesOnly ? t("favoritesEmpty") : t("noResults")}
          </div>
        )}

        {/* 求人カード一覧 */}
        <div className="flex flex-col gap-5">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md"
            >
              {/* ── 上部: 企業名 ── */}
              <div className="border-b border-slate-100 px-5 py-3 sm:px-6">
                <p className="text-[15px] font-bold text-slate-900">
                  {job.company}
                </p>
              </div>

              {/* ── メイン: 画像 + 右側コンテンツ ── */}
              <div className="flex flex-col sm:flex-row">
                {/* サムネイル */}
                <div className="shrink-0 p-4 sm:p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={job.image}
                    alt={job.title}
                    className="h-[120px] w-full rounded object-cover sm:h-[130px] sm:w-[160px]"
                  />
                </div>

                {/* 右側 */}
                <div className="flex-1 px-4 pb-4 sm:py-4 sm:pl-0 sm:pr-5">
                  {/* タイトル */}
                  <Link
                    href={`/${locale}/jobs/${job.id}`}
                    className="text-[14px] font-bold leading-[1.7] text-[#1a6dcc] [text-wrap:balance] break-keep hover:underline sm:text-[15px]"
                  >
                    {job.title}
                  </Link>

                  {/* 情報テーブル */}
                  <div className="-mx-4 mt-3 border-t border-slate-100 text-[13px] sm:mx-0">
                    {/* 給与 */}
                    <div className="flex border-b border-slate-100">
                      <div className="flex w-[72px] shrink-0 items-center whitespace-nowrap border-r border-slate-100 bg-slate-50/80 px-2 py-2 sm:w-[100px] sm:gap-1.5 sm:px-3">
                        <span className="hidden text-[12px] text-slate-400 sm:inline">$</span>
                        <span className="font-bold text-slate-600">{t("labelSalary")}</span>
                      </div>
                      <div className="min-w-0 flex-1 px-3 py-2 text-slate-700 [text-wrap:balance] break-keep">
                        {job.salary}
                      </div>
                    </div>
                    {/* 雇用形態 */}
                    <div className="flex border-b border-slate-100">
                      <div className="flex w-[72px] shrink-0 items-center whitespace-nowrap border-r border-slate-100 bg-slate-50/80 px-2 py-2 sm:w-[100px] sm:gap-1.5 sm:px-3">
                        <span className="hidden text-[12px] text-slate-400 sm:inline">&#9776;</span>
                        <span className="font-bold text-slate-600">{t("labelType")}</span>
                      </div>
                      <div className="min-w-0 flex-1 px-3 py-2 text-slate-700 [text-wrap:balance] break-keep">
                        {job.type}
                      </div>
                    </div>
                    {/* シフト */}
                    <div className="flex border-b border-slate-100">
                      <div className="flex w-[72px] shrink-0 items-center whitespace-nowrap border-r border-slate-100 bg-slate-50/80 px-2 py-2 sm:w-[100px] sm:gap-1.5 sm:px-3">
                        <span className="hidden text-[12px] text-slate-400 sm:inline">&#9776;</span>
                        <span className="font-bold text-slate-600">{t("labelShift")}</span>
                      </div>
                      <div className="min-w-0 flex-1 px-3 py-2 text-slate-700 [text-wrap:balance] break-keep">
                        {job.shift}
                      </div>
                    </div>
                    {/* アクセス */}
                    <div className="flex">
                      <div className="flex w-[72px] shrink-0 items-center whitespace-nowrap border-r border-slate-100 bg-slate-50/80 px-2 py-2 sm:w-[100px] sm:gap-1.5 sm:px-3">
                        <span className="hidden text-[12px] text-slate-400 sm:inline">&#9737;</span>
                        <span className="font-bold text-slate-600">{t("labelAccess")}</span>
                      </div>
                      <div className="min-w-0 flex-1 px-3 py-2 text-slate-700 [text-wrap:balance] break-keep">
                        {job.access}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── フッター: ボタン + 残り日数 ── */}
              <div className="border-t border-slate-200 px-5 py-3 sm:px-6">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/${locale}/jobs/${job.id}#apply`}
                    className="flex-1 rounded-lg bg-santo-navy py-2.5 text-center text-[14px] font-bold tracking-wide text-white transition hover:bg-santo-blue"
                  >
                    {t("apply")}
                  </Link>
                  <Link
                    href={`/${locale}/jobs/${job.id}`}
                    className="flex-1 rounded-lg border-2 border-santo-navy py-2.5 text-center text-[14px] font-bold tracking-wide text-santo-navy transition hover:bg-santo-navy hover:text-white"
                  >
                    {t("detail")}
                  </Link>
                  <button
                    onClick={() => toggleFav(job.id)}
                    className={`shrink-0 transition ${favorites.includes(job.id) ? "text-orange-400" : "text-slate-300 hover:text-orange-400"}`}
                  >
                    <Star
                      className="h-5 w-5"
                      fill={favorites.includes(job.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-[#dce8f5] p-8 text-center sm:p-12">
          <h2 className="whitespace-nowrap text-lg font-black tracking-wider text-slate-800 sm:whitespace-normal sm:text-2xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-[1.9] text-slate-500">
            {t("ctaDesc")}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-santo-navy px-8 py-3 text-[14px] font-bold text-white transition hover:bg-santo-blue"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </div>
    </section>
  );
}
