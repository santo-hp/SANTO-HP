import type { Metadata } from "next";
import { LinkButton } from "@/components/LinkButton";
import { FeatureCards } from "@/components/FeatureCards";
import { HeroSection } from "@/components/HeroSection";
import { ServiceOverview } from "@/components/ServiceOverview";
import { TrustedReferralSection } from "@/components/TrustedReferralSection";
import { AwardRecognitionSection } from "@/components/AwardRecognitionSection";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });
  return pageMetadata({
    locale,
    path: "",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");


  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* 神奈川を代表する企業100選（ファーストビュー直下） */}
      <AwardRecognitionSection />

      {/* Service Overview */}
      <ServiceOverview />

      {/* Features */}
      <section className="bg-santo-gray py-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-5 text-center sm:mb-14">
            <p className="mb-1 text-[14px] font-black tracking-[0.3em] text-santo-light sm:mb-3">
              {t("whySantoLabel")}
            </p>
            <h2 className="text-2xl font-black tracking-wider text-slate-900 sm:text-4xl lg:text-5xl">
              {t("whySantoTitle")}
            </h2>
            <div className="mx-auto mt-1.5 h-1 bg-santo-navy" style={{ width: "555px", maxWidth: "100%" }} />
            <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-[1.7] text-slate-500 sm:mt-4 sm:text-[18px] sm:leading-[1.9]">
              {t("whySantoDescPre1")}<span className="whitespace-nowrap text-[1.15em] font-bold text-santo-blue">{t("whySantoDescHighlight1")}</span>{t("whySantoDescMid1")}<span className="whitespace-nowrap text-[1.15em] font-bold text-santo-navy">{t("whySantoDescHighlight2")}</span>{t("whySantoDescMid2")}<span className="whitespace-nowrap text-[1.15em] font-bold text-santo-blue">{t("whySantoDescHighlight3")}</span>{t("whySantoDescPost")}
            </p>
          </div>

          <FeatureCards />
        </div>
      </section>


      {/* 信頼の紹介（既存位置） */}
      <TrustedReferralSection />

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        {/* 背景画像エリア */}
        <div className="relative px-5 pb-32 pt-16 sm:px-6 sm:pb-48 sm:pt-28">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/cta-bg-v2.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-santo-navy/70 via-santo-navy/50 to-santo-navy/30" />
          <div className="relative mx-auto max-w-4xl text-center lg:max-w-none">
            <h2 className="text-2xl font-black leading-[1.5] tracking-wider text-white drop-shadow-lg sm:text-4xl lg:text-7xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[18px] font-bold leading-[2] text-white drop-shadow-md sm:text-[28px] lg:max-w-none lg:whitespace-nowrap lg:text-[36px]">
              {t("ctaDesc")}
            </p>
          </div>
        </div>

        {/* オーバーラップする2カラムカード */}
        <div className="relative -mt-24 px-4 pb-20 sm:px-6 sm:pb-28">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {/* 求職者向け */}
            <div className="flex flex-col rounded-xl bg-white p-6 shadow-xl sm:p-10">
              <span className="inline-block rounded-full bg-santo-sky px-4 py-1.5 text-[13px] font-black tracking-wider text-santo-blue">
                {t("ctaJobseekersTitle")}
              </span>
              <h3 className="mt-4 text-2xl font-black tracking-wider text-slate-900 sm:text-3xl">
                {t("ctaJobseekersDesc")}
              </h3>
              <ul className="mt-5 space-y-3">
                {[
                  t("ctaJobseekersBullet1"),
                  t("ctaJobseekersBullet2"),
                  t("ctaJobseekersBullet3"),
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[16px] font-bold leading-[1.8] text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-santo-blue" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <p className="text-center text-[14px] text-slate-400">
                  {t("ctaJobseekersPrompt")}
                </p>
                <LinkButton
                  href={`/${locale}/jobseekers/`}
                  size="xl"
                  className="mt-2 w-full justify-center bg-santo-navy text-white hover:bg-santo-blue"
                >
                  {t("ctaJobseekersButton")}
                </LinkButton>
              </div>
            </div>

            {/* 企業向け */}
            <div className="flex flex-col rounded-xl bg-white p-6 shadow-xl sm:p-10">
              <span className="inline-block rounded-full bg-santo-navy/5 px-4 py-1.5 text-[13px] font-black tracking-wider text-santo-navy">
                {t("ctaEmployersTitle")}
              </span>
              <h3 className="mt-4 text-2xl font-black tracking-wider text-slate-900 sm:text-3xl">
                {t("ctaEmployersDesc")}
              </h3>
              <ul className="mt-5 space-y-3">
                {[
                  t("ctaEmployersBullet1"),
                  t("ctaEmployersBullet2"),
                  t("ctaEmployersBullet3"),
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[16px] font-bold leading-[1.8] text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-santo-navy" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <p className="text-center text-[14px] text-slate-400">
                  {t("ctaEmployersPrompt")}
                </p>
                <LinkButton
                  href={`/${locale}/employers/`}
                  size="xl"
                  className="mt-2 w-full justify-center bg-slate-800 text-white hover:bg-slate-700"
                >
                  {t("ctaEmployersButton")}
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Contact CTA */}
      <section className="relative overflow-hidden py-20 sm:py-36 lg:py-44 min-h-[420px] sm:min-h-[520px] lg:min-h-[600px]">
        {/* 背景画像 */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: "url('/images/trustworthy_woman_blurred_man.png')", backgroundPosition: "center 30%" }}
        />
        <div className="absolute inset-0 bg-santo-navy/55" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="mb-3 text-[12px] font-black tracking-[0.3em] text-white/80 lg:text-[14px]">
            {t("contactLabel")}
          </p>
          <h2 className="mb-4 text-3xl font-black tracking-wider text-white sm:text-4xl lg:text-6xl">
            {t("contactTitle")}
          </h2>
          <p className="mx-auto mb-8 max-w-md text-[14px] font-bold leading-[1.9] text-white/90 sm:mb-10 sm:max-w-xl sm:text-[17px] lg:max-w-3xl lg:text-[22px]">
            {t.rich("contactDesc", { br: () => <br className="sm:hidden" /> })}
          </p>
          <div className="flex flex-col items-center gap-6">
            <LinkButton
              href={`/${locale}/contact/`}
              size="xl"
              className="animate-shimmer relative overflow-hidden bg-white px-8 py-4 text-lg text-santo-navy shadow-lg shadow-white/20 hover:bg-slate-100 sm:px-12 sm:text-xl lg:px-16 lg:py-5 lg:text-2xl"
            >
              {t("contactButton")}
            </LinkButton>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
              <div className="flex flex-col items-center">
                <p className="text-[10px] font-bold tracking-widest text-white/70 lg:text-[12px]">
                  TEL
                </p>
                <a
                  href="tel:0463-24-1722"
                  className="text-2xl font-black tracking-wider text-white sm:text-3xl lg:text-4xl"
                >
                  0463-24-1722
                </a>
              </div>
              <div className="hidden h-10 w-px bg-white/30 sm:block lg:h-14" />
              <div className="flex flex-col items-center">
                <p className="text-[10px] font-bold tracking-widest text-white/70 lg:text-[12px]">
                  MAIL
                </p>
                <a
                  href="mailto:santo@santo-hp.co.jp"
                  className="text-lg font-black tracking-wider text-white sm:text-xl lg:text-2xl"
                >
                  santo@santo-hp.co.jp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
