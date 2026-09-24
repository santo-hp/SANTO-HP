import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  return pageMetadata({
    locale,
    path: "/privacy",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Privacy");

  const sections = [
    { title: t("section1Title"), body: t("section1Body") },
    { title: t("section2Title"), body: t("section2Body") },
    { title: t("section3Title"), body: t("section3Body") },
    { title: t("section4Title"), body: t("section4Body") },
    { title: t("section5Title"), body: t("section5Body") },
    { title: t("section6Title"), body: t("section6Body") },
    { title: t("section7Title"), body: t("section7Body") },
    { title: t("section8Title"), body: t("section8Body") },
    { title: t("section9Title"), body: t("section9Body") },
  ];

  return (
    <>
      <PageHeader label={t("pageLabel")} title={t("pageTitle")} subtitle={t("pageSubtitle")} />

      <section className="py-8 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="mb-8 text-[14px] leading-[2] text-slate-600 sm:mb-12">
            {t("intro")}
          </p>

          <div className="space-y-8 sm:space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="mb-3 text-[15px] font-black tracking-wider text-santo-navy">
                  {section.title}
                </h2>
                <p className="whitespace-pre-line text-[13px] leading-[2] text-slate-600">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-6 rounded-lg bg-santo-gray p-5 sm:p-8">
            <p className="text-[13px] font-bold leading-[2] text-slate-700">
              {t("contactCompany")}
              <br />
              {t("contactAddress")}
              <br />
              {t("contactTel")}
              <br />
              {t("contactEmail")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
