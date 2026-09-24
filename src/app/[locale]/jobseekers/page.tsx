import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import {
  ClipboardList,
  MessageSquare,
  Briefcase,
  ThumbsUp,
} from "lucide-react";
import { LinkButton } from "@/components/LinkButton";
import { CountUpStats } from "@/components/CountUpStats";
import { PageHeader } from "@/components/PageHeader";
import { HexMerits } from "@/components/HexMerits";
import { Suspense } from "react";
import { JobSearchForm } from "@/components/JobSearchForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Jobseekers" });
  return pageMetadata({
    locale,
    path: "/jobseekers",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function JobseekersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Jobseekers");
  // 日本語は指定の3行をモバイルでも維持。他言語は従来どおりモバイルで自然折り返し（sm以上のみ改行）。
  const ctaBr = () => <br className={locale === "ja" ? undefined : "hidden sm:block"} />;

  const steps = [
    {
      icon: ClipboardList,
      num: "01",
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      icon: MessageSquare,
      num: "02",
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      icon: Briefcase,
      num: "03",
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
    {
      icon: ThumbsUp,
      num: "04",
      title: t("step4Title"),
      desc: t("step4Desc"),
    },
  ];

  const faqs = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
    { q: t("faq5Q"), a: t("faq5A") },
    { q: t("faq7Q"), a: t("faq7A") },
    { q: t("faq8Q"), a: t("faq8A") },
    { q: t("faq9Q"), a: t("faq9A") },
  ];

  return (
    <>
      <PageHeader
        label={t("pageLabel")}
        title={t("pageTitle")}
        subtitle={t.rich("pageSubtitle", { br: () => <br /> })}
        image="/images/jobseekers_hero_office_factory.jpg"
        imagePosition="80% center"
        tall
        largeSubtitle
        wideGradient
      />

      {/* Job Categories */}
      <section className="py-6 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-1 text-[14px] font-black tracking-[0.3em] text-santo-light sm:mb-3">
            {t("jobTypeLabel")}
          </p>
          <h2 className="mb-3 text-2xl font-black tracking-wider text-slate-900 sm:mb-4 sm:text-4xl lg:text-5xl">
            {t("jobTypeTitle")}
          </h2>
          <Suspense>
            <JobSearchForm />
          </Suspense>
        </div>
      </section>

      {/* Merits */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-3 text-[14px] font-black tracking-[0.3em] text-santo-light">
            {t("meritLabel")}
          </p>
          <h2 className="mb-4 text-2xl font-black tracking-wider text-slate-900 sm:text-4xl lg:text-6xl">
            {t("meritTitle1")}<span className="relative inline-block text-santo-blue" style={{ backgroundImage: "linear-gradient(transparent 70%, #bfdbfe 70%)", backgroundRepeat: "no-repeat" }}>{t("meritTitle2")}</span>
          </h2>
          <div className="mt-5 h-1 w-14 rounded-full bg-santo-navy" />
          <p className="mt-5 mb-8 break-keep text-[18px] font-bold leading-[1.8] tracking-wide text-slate-500 [text-wrap:balance] sm:text-[26px] lg:text-[34px] lg:whitespace-nowrap">
            {t.rich("meritDesc", { wbr: () => <wbr /> })}
          </p>
          <HexMerits />
          <div className="mt-10 flex flex-col items-center text-center">
            <div className="h-[2px] w-12 rounded-full bg-santo-blue" />
            <p className="mt-5 sm:break-keep text-[20px] font-bold leading-[1.8] tracking-wide text-slate-700 [text-wrap:balance] sm:text-[34px] lg:whitespace-nowrap lg:text-[40px]">
              {t.rich("meritCta1", { br: ctaBr })}<span className="text-[1.1em] font-black text-santo-blue">{t("meritCtaHighlight1")}</span>{t("meritCta2")}{t.rich("meritCta3", { br: ctaBr })}<span className="text-[1.1em] font-black text-santo-blue">{t("meritCtaHighlight2")}</span>{t("meritCta4")}
            </p>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="bg-[#f4f7fb] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <CountUpStats />
        </div>
      </section>

      {/* Flow */}
      <section className="border-t border-slate-200 bg-santo-gray py-6 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-1 text-[14px] font-black tracking-[0.3em] text-santo-light sm:mb-3">
            {t("flowLabel")}
          </p>
          <h2 className="mb-3 text-2xl font-black tracking-wider text-slate-900 sm:mb-4 sm:text-4xl lg:text-5xl">
            {t("flowTitle")}
          </h2>
          {/* モバイル: 横スクロール */}
          <div className="-mx-4 px-4 lg:hidden">
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
              {steps.map((step) => (
                <div key={step.title} className="flex w-[200px] shrink-0 snap-start flex-col rounded-xl bg-white p-4">
                  <span className="text-[28px] font-light leading-none text-santo-navy/20">
                    {step.num}
                  </span>
                  <h3 className="mt-1 text-[14px] font-black tracking-wider text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-1 break-words text-[12px] font-bold leading-[1.7] text-slate-500">
                    {step.desc}
                  </p>
                  <div className="mt-auto flex justify-end pt-2">
                    <step.icon className="h-8 w-8 text-slate-300" strokeWidth={1} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-stretch">
            {steps.map((step, i) => {
              const isFirst = i === 0;
              const isLast = i === steps.length - 1;
              const clip = isFirst
                ? "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)"
                : isLast
                  ? "polygon(0 0, 100% 0, 100% 100%, 0 100%, 20px 50%)"
                  : "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)";
              const topColors = [
                "#93c5fd",
                "#3b82f6",
                "#1d6fb5",
                "#0f2d5c",
              ];
              const numColors = [
                "text-blue-300",
                "text-blue-400",
                "text-santo-blue",
                "text-santo-navy",
              ];
              return (
                <div key={step.title} className="flex flex-1 items-stretch">
                  <div
                    className="relative flex flex-1 flex-col bg-white px-8 py-7"
                    style={{
                      clipPath: clip,
                      marginLeft: isFirst ? 0 : -10,
                      paddingLeft: isFirst ? 32 : 40,
                    }}
                  >
                    {/* 上部カラーライン */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ background: topColors[i] }}
                    />
                    <span className={`text-[38px] font-light leading-none ${numColors[i]}`}>
                      {step.num}
                    </span>
                    <h3 className="mt-2 whitespace-nowrap text-[18px] font-black tracking-wider text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[15px] font-bold leading-[1.9] text-slate-500">
                      {step.desc}
                    </p>
                    <div className="mt-auto flex justify-end pt-4">
                      <step.icon className="h-14 w-14 text-slate-300" strokeWidth={1} />
                    </div>
                  </div>
                  {/* カード間アニメーション矢印 */}
                  {!isLast && (
                    <div className="relative z-10 -mx-3 flex items-center">
                      <div className="flex items-center gap-[3px] animate-pulse">
                        <span className="block h-[3px] w-[6px] rounded-full bg-santo-blue/50" />
                        <span className="block h-[3px] w-[8px] rounded-full bg-santo-blue/70" />
                        <span className="block h-[3px] w-[10px] rounded-full bg-santo-navy" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-200 bg-santo-gray py-6 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-1 text-[14px] font-black tracking-[0.3em] text-santo-light sm:mb-3">
            {t("faqLabel")}
          </p>
          <h2 className="mb-3 text-2xl font-black tracking-wider text-slate-900 sm:mb-4 sm:text-4xl lg:text-5xl">
            {t("faqTitle")}
          </h2>
          <Accordion className="space-y-1.5 sm:space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                className="rounded border border-slate-200 bg-white"
              >
                <AccordionTrigger className="px-4 py-2.5 text-left text-[12px] font-bold tracking-wide sm:px-6 sm:py-4 sm:text-[13px]">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3 text-[12px] font-bold leading-[1.8] text-slate-600 sm:px-6 sm:pb-5 sm:text-[13px] sm:leading-[1.9]">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: "url('/images/trustworthy_woman_blurred_man.png')", backgroundPosition: "center 30%" }}
        />
        <div className="absolute inset-0 bg-santo-navy/55" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="mb-3 text-[12px] font-black tracking-[0.3em] text-white/80 [text-shadow:0_2px_8px_rgba(0,0,0,0.7),0_0_14px_rgba(0,0,0,0.5)]">
            {t("ctaLabel")}
          </p>
          <h2 className="mb-4 text-3xl font-black tracking-wider text-white [text-shadow:0_3px_12px_rgba(0,0,0,0.85),0_2px_6px_rgba(0,0,0,0.7),0_0_22px_rgba(0,0,0,0.5)] sm:text-4xl lg:text-5xl">
            {t.rich("ctaTitle", { br: () => <br className="lg:hidden" /> })}
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-[16px] font-bold leading-[1.9] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.8),0_2px_6px_rgba(0,0,0,0.7)] sm:text-[20px] lg:max-w-none lg:whitespace-nowrap lg:text-[22px]">
            {t.rich("ctaDesc", { br: () => <br className="lg:hidden" /> })}
          </p>
          <LinkButton
            href={`/${locale}/contact`}
            size="xl"
            className="bg-white text-santo-navy shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-slate-100"
          >
            {t("ctaButton")}
          </LinkButton>
        </div>
      </section>
    </>
  );
}
