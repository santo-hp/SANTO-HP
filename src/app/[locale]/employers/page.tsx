import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import {
  Phone,
  FileSearch,
  Handshake,
  UserCheck,
} from "lucide-react";
import { EmployerFlowMobile } from "@/components/EmployerFlowMobile";
import { LinkButton } from "@/components/LinkButton";
import { PageHeader } from "@/components/PageHeader";
import { StrengthTimeline } from "@/components/StrengthTimeline";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Employers" });
  return pageMetadata({
    locale,
    path: "/employers",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function EmployersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Employers");

  const steps = [
    {
      icon: Phone,
      num: "01",
      title: t("step1Title"),
      desc: t.rich("step1Desc", { wbr: () => <wbr /> }),
    },
    {
      icon: FileSearch,
      num: "02",
      title: t("step2Title"),
      desc: t.rich("step2Desc", { wbr: () => <wbr /> }),
    },
    {
      icon: Handshake,
      num: "03",
      title: t("step3Title"),
      desc: t.rich("step3Desc", { wbr: () => <wbr /> }),
    },
    {
      icon: UserCheck,
      num: "04",
      title: t("step4Title"),
      desc: t.rich("step4Desc", { wbr: () => <wbr /> }),
    },
  ];

  const stats = [
    { num: t("stat1Num"), suffix: t("stat1Suffix"), label: t("stat1Label"), desc: t("stat1Desc"), img: "/images/illustration_kizuna_v2.png" },
    { num: t("stat2Num"), suffix: t("stat2Suffix"), label: t("stat2Label"), desc: t("stat2Desc"), img: "/images/illustration_satisfaction_v2.png" },
    { num: t("stat3Num"), suffix: t("stat3Suffix"), label: t("stat3Label"), desc: t("stat3Desc"), img: "/images/illustration_handshake.png" },
  ];

  return (
    <>
      <PageHeader
        label={t("pageLabel")}
        title={t("pageTitle")}
        subtitle={t.rich("pageSubtitle", {
          br: () => <br />,
        })}
        image="/images/employers_factory_boss_wide.png"
        largeSubtitle
      >
        <div className="mt-8">
          <LinkButton
            href={`/${locale}/contact`}
            size="xl"
            className="bg-white text-santo-navy shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-slate-100"
          >
            {t("leadButton")}
          </LinkButton>
        </div>
      </PageHeader>

      {/* Lead */}
      <section className="py-8 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* 左: テキスト */}
            <div>
              <p className="mb-3 text-[14px] font-black tracking-[0.3em] text-santo-light">
                {t("leadLabel")}
              </p>
              <h2 className="mb-6 break-keep text-2xl font-black tracking-wider text-slate-900 [text-wrap:balance] sm:text-4xl">
                <span className="inline-block whitespace-nowrap">{t("leadTitle1")}<span className="text-santo-blue text-3xl sm:text-5xl">{t("leadTitle2")}</span>{t("leadTitle3")}</span><br /><span className="inline-block whitespace-nowrap"><span className="text-santo-blue text-3xl sm:text-5xl">{t("leadTitle4")}</span>{t("leadTitle5")}</span>
              </h2>
              <div className="mb-6 h-1 w-14 rounded-full bg-santo-navy" />
              <p className="text-[15px] font-bold leading-[2.2] text-slate-600 sm:text-[17px]">
                {t("leadDesc")}
              </p>
              <div className="mt-8 flex justify-center">
                <LinkButton
                  href={`/${locale}/contact`}
                  size="xl"
                  className="bg-santo-navy px-14 text-white hover:bg-santo-blue"
                >
                  {t("leadButton")}
                </LinkButton>
              </div>
            </div>

            {/* 右: 実績カード */}
            <div>
              {/* モバイル: 縦並び */}
              <div className="flex flex-col gap-2 lg:hidden">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex w-full items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1 text-center">
                      <p className="text-[14px] font-black tracking-wider text-santo-navy">
                        {stat.label}
                      </p>
                      <div className="flex items-baseline justify-center">
                        <span className="text-[32px] font-black leading-none tabular-nums text-santo-navy">
                          {stat.num}
                        </span>
                        <span className="ml-1 text-[12px] font-bold text-slate-500">
                          {stat.suffix}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] font-bold leading-[1.5] text-slate-500">
                        {stat.desc}
                      </p>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={stat.img} alt="" className="h-[70px] w-[70px] shrink-0 object-contain" />
                  </div>
                ))}
              </div>

              {/* デスクトップ: ピラミッド型 */}
              <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-4">
                <div className="flex justify-center">
                  <div className="flex w-[320px] items-center gap-4 px-6 py-5">
                    <div className="flex-1">
                      <p className="text-[18px] font-black tracking-wider text-santo-navy">
                        {stats[0].label}
                      </p>
                      <div className="flex items-baseline">
                        <span className="text-[46px] font-black leading-none tabular-nums text-santo-navy">
                          {stats[0].num}
                        </span>
                        <span className="ml-1 text-[16px] font-bold text-slate-500">
                          {stats[0].suffix}
                        </span>
                      </div>
                      <p className="mt-1 text-[14px] font-bold leading-[1.6] text-slate-500">
                        {stats[0].desc}
                      </p>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={stats[0].img} alt="" className="h-[130px] w-[130px] shrink-0 object-contain" />
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  {stats.slice(1).map((stat) => (
                    <div key={stat.label} className="flex w-[330px] items-center gap-4 px-6 py-6">
                      <div className="flex-1">
                        <p className="whitespace-nowrap text-[17px] font-black tracking-wider text-santo-navy">
                          {stat.label}
                        </p>
                        <div className="flex items-baseline">
                          <span className="text-[44px] font-black leading-none tabular-nums text-santo-navy">
                            {stat.num}
                          </span>
                          <span className="ml-1 text-[15px] font-bold text-slate-500">
                            {stat.suffix}
                          </span>
                        </div>
                        <p className="mt-1 whitespace-nowrap text-[14px] font-bold leading-[1.6] text-slate-500">
                          {stat.desc}
                        </p>
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={stat.img} alt="" className="h-[130px] w-[130px] shrink-0 object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="border-t border-slate-200 bg-santo-gray py-6 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-1 text-[14px] font-black tracking-[0.3em] text-santo-light sm:mb-3">
            {t("strengthLabel")}
          </p>
          <h2 className="mb-3 text-2xl font-black tracking-wider text-slate-900 sm:mb-4 sm:text-4xl lg:text-5xl">
            {t("strengthTitle")}
          </h2>
          <StrengthTimeline />
        </div>
      </section>
      {/* Flow */}
      <section className="border-t border-slate-200 bg-santo-gray py-6 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-1 text-[14px] font-black tracking-[0.3em] text-santo-light sm:mb-3">
            {t("flowLabel")}
          </p>
          <h2 className="mb-3 text-2xl font-black tracking-wider text-slate-900 sm:mb-4 sm:text-4xl lg:text-5xl">
            {t("flowTitle")}
          </h2>
          {/* モバイル: 横スクロール */}
          <EmployerFlowMobile
            steps={steps.map(({ num, title, desc }) => ({ num, title, desc }))}
          />
          {/* デスクトップ: 矢印型横並び */}
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

      {/* CTA */}
      <section className="relative overflow-hidden py-16 sm:py-28 min-h-[380px] sm:min-h-[480px] lg:min-h-[560px]">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: "url('/images/employers_cta_bg_v2.png')", backgroundPosition: "center 15%" }}
        />
        <div className="absolute inset-0 bg-santo-navy/25" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="mb-3 text-[12px] font-black tracking-[0.3em] text-white/90 [text-shadow:0_2px_6px_rgba(0,0,0,0.95),0_0_14px_rgba(0,0,0,0.8)]">
            {t("ctaLabel")}
          </p>
          <h2 className="mb-4 text-3xl font-black tracking-wider text-white [text-shadow:0_4px_14px_rgba(0,0,0,0.95),0_2px_6px_rgba(0,0,0,0.9),0_0_22px_rgba(0,0,0,0.7)] sm:text-4xl lg:text-5xl">
            {t.rich("ctaTitle", { br: () => <br className="lg:hidden" /> })}
          </h2>
          <p className="mx-auto mb-8 max-w-none text-[16px] font-black leading-[1.9] text-white [text-shadow:0_3px_12px_rgba(0,0,0,0.95),0_2px_6px_rgba(0,0,0,0.9),0_0_20px_rgba(0,0,0,0.7)] sm:mb-10 sm:text-[28px] lg:text-[32px]">
            {t.rich("ctaDesc", {
              br: () => <br />,
              nowrap: (chunks) => <span className="inline-block whitespace-nowrap">{chunks}</span>,
            })}
          </p>
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <LinkButton
              href={`/${locale}/contact`}
              size="xl"
              className="animate-shimmer relative overflow-hidden bg-white px-14 py-5 text-xl font-black text-santo-navy shadow-lg shadow-white/20 hover:bg-slate-100 sm:text-2xl"
            >
              {t("ctaButton")}
            </LinkButton>
            <div className="flex flex-col items-center">
              <p className="text-[13px] font-black tracking-widest text-white/90 [text-shadow:0_2px_6px_rgba(0,0,0,0.95),0_0_14px_rgba(0,0,0,0.8)]">
                TEL
              </p>
              <a
                href="tel:0463-24-1722"
                className="flex items-center gap-2 text-3xl font-black tracking-wider text-white [text-shadow:0_3px_12px_rgba(0,0,0,0.95),0_2px_6px_rgba(0,0,0,0.9),0_0_20px_rgba(0,0,0,0.7)] sm:text-4xl"
              >
                0463-24-1722
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
