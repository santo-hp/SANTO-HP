"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import type { JobResults } from "@/lib/job-types";

export function JobList({ initialResult, initialQuery }: { initialResult: JobResults; initialQuery: string }) {
  const t = useTranslations("Jobs");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoritePage, setFavoritePage] = useState(1);
  const [response, setResponse] = useState<{ key: string; data?: JobResults; error?: boolean }>();
  const [retry, setRetry] = useState(0);
  const queryParams = new URLSearchParams(searchParams.toString());
  queryParams.set("locale", locale);
  if (showFavoritesOnly) {
    queryParams.set("favorites", "1");
    queryParams.set("ids", favorites.join(","));
    queryParams.set("page", String(favoritePage));
  }
  const query = queryParams.toString();
  const result = query === initialQuery ? initialResult : response?.key === query ? response.data : undefined;
  const error = query !== initialQuery && response?.key === query && response.error;
  useEffect(() => {
    if (query === initialQuery) return;
    const controller = new AbortController();
    fetch(`/api/jobs/?${query}`, { signal: controller.signal })
      .then(res => { if (!res.ok) throw new Error("Could not load jobs"); return res.json(); })
      .then((data: JobResults) => setResponse({ key: query, data }))
      .catch(err => { if (err.name !== "AbortError") setResponse({ key: query, error: true }); });
    return () => controller.abort();
  }, [query, initialQuery, retry]);
  const jobs = result?.jobs || [];
  const toggleFav = (id: number) => {
    setFavorites(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]);
  };
  const changePage = (page: number) => {
    if (showFavoritesOnly) setFavoritePage(page);
    else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`/${locale}/jobs/?${params}#job-results`, { scroll: false });
    }
    document.getElementById("job-results")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section id="job-results" className="scroll-mt-24 py-10 sm:py-14" aria-busy={!result && !error}>
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
              onClick={() => { setShowFavoritesOnly((v) => !v); setFavoritePage(1); }}
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
              {result ? t("resultCount", { count: result.total }) : error ? "" : t("loading")}
            </p>
          </div>
        </div>

        {error && <div role="alert" className="mb-6 rounded-lg border border-slate-200 p-6 text-center">
          <p>{t("loadError")}</p>
          <button onClick={() => { setResponse(undefined); setRetry(value => value + 1); }} className="mt-3 text-santo-navy underline">{t("retry")}</button>
        </div>}
        {/* 未ヒット時 */}
        {result && jobs.length === 0 && (
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
                {job.image && <div className="shrink-0 p-4 sm:p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={job.image}
                    loading="lazy"
                    alt={job.title}
                    className="h-[120px] w-full rounded object-cover sm:h-[130px] sm:w-[160px]"
                  />
                </div>}

                {/* 右側 */}
                <div className={`min-w-0 flex-1 px-4 py-4 sm:pr-5 ${job.image ? "sm:pl-0" : "sm:pl-6"}`}>
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
                        <span className="whitespace-pre-line">{job.shift}</span>
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
                    href={`/${locale}/jobs/${job.id}/apply`}
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
                    aria-label={`${t("favoritesOnly")}: ${job.title}`}
                    aria-pressed={favorites.includes(job.id)}
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

        {result && result.pages > 1 && (
          <nav aria-label={t("pagination")} className="mt-8 flex items-center justify-center gap-4">
            <button disabled={result.page <= 1} onClick={() => changePage(result.page - 1)} className="rounded-lg border border-slate-200 px-5 py-3 text-santo-navy disabled:opacity-40">{t("previousPage")}</button>
            <span className="text-sm text-slate-600">{result.page} / {result.pages}</span>
            <button disabled={result.page >= result.pages} onClick={() => changePage(result.page + 1)} className="rounded-lg border border-slate-200 px-5 py-3 text-santo-navy disabled:opacity-40">{t("nextPage")}</button>
          </nav>
        )}
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
