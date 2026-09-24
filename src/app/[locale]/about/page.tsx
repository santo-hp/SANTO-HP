import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return pageMetadata({
    locale,
    path: "/about",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const isJa = locale === "ja";

  const companyInfo = [
    { label: t("infoCompanyName"), value: t("infoCompanyNameValue") },
    { label: t("infoEnName"), value: t("infoEnNameValue") },
    { label: t("infoCeo"), value: t("infoCeoValue") },
    { label: t("infoFounded"), value: t("infoFoundedValue") },
    { label: t("infoBusiness"), value: t("infoBusinessValue") },
    { label: t("infoLicense"), value: t("infoLicenseValue") },
    { label: t("infoAddress"), value: t("infoAddressValue") },
    { label: t("infoTel"), value: t("infoTelValue") },
    { label: t("infoFax"), value: t("infoFaxValue") },
    { label: t("infoEmployees"), value: t("infoEmployeesValue") },
  ];

  return (
    <>
      <PageHeader label={t("pageLabel")} title={t("pageTitle")} subtitle={t.rich("pageSubtitle", { br: () => <br className="sm:hidden" /> })} image="/images/jobseekers_hero.png" imagePosition="35%" tall largeSubtitle />

      {/* 代表挨拶 */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-2 text-[14px] font-black tracking-[0.3em] text-santo-light">
            {t("messageLabel")}
          </p>
          <h2 className="mb-3 text-3xl font-black tracking-wider text-slate-900 sm:text-4xl lg:text-5xl">
            {t("messageTitle")}
          </h2>
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="flex items-start justify-center lg:col-span-2">
              <div className="aspect-[4/5] w-64 shrink-0 overflow-hidden rounded-2xl sm:w-72">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ceo_photo_latest.jpg"
                  alt={t("messageName")}
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
            <div className="lg:col-span-3">
              <p className="mb-3 text-[15px] font-bold leading-[2] text-slate-600">
                {t("messageP1")}
              </p>
              <p className="mb-3 text-[15px] font-bold leading-[2] text-slate-600">
                {t("messageP2")}
              </p>
              <p className="mb-5 text-[15px] font-bold leading-[2] text-slate-600">
                {t("messageP3")}
              </p>
              <div className="border-l-2 border-santo-navy pl-5">
                <p className="text-sm font-black tracking-wider text-slate-800">
                  {t("messageRole")}
                </p>
                <p className="mt-1 text-xl font-black tracking-wider text-santo-navy">
                  {t("messageName")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 企業理念 */}
      <section className="relative min-h-[400px] overflow-hidden bg-cover py-16 sm:min-h-[520px] sm:py-36 lg:py-44" style={{ backgroundImage: "url('/images/philosophy_bg_sky.png')", backgroundPosition: "center 20%" }}>
        <div className="absolute inset-0 bg-white/40" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="mb-3 text-[14px] font-black tracking-[0.3em] text-slate-500">
            {t("philosophyLabel")}
          </p>
          <h2 className="mb-8 text-2xl font-black tracking-wider text-slate-800 drop-shadow-md sm:text-3xl lg:text-4xl">
            {t("philosophyTitle")}
          </h2>
          <div className="mx-auto h-1 w-14 rounded-full bg-slate-800/30" />
          <div className="mx-auto max-w-4xl py-12 sm:py-16">
            <p className={`break-keep font-black leading-[1.8] text-slate-800 drop-shadow-lg [text-wrap:balance] ${isJa ? "text-2xl tracking-[0.05em] sm:text-4xl sm:tracking-[0.1em] lg:text-6xl" : "text-xl tracking-wide sm:text-3xl lg:text-4xl"}`}>
              <span className="inline-block">
                {t("philosophyText1")}<span className="text-santo-blue">{t("philosophyHighlight1")}</span>{t("philosophyText2")}
              </span>
              <br />
              <span className="inline-block">
                {t("philosophyText3")}<span className="text-santo-blue">{t("philosophyHighlight2")}</span>{t("philosophyText4")}<span className="text-santo-blue">{t("philosophyHighlight3")}</span>{t("philosophyText5")}
              </span>
            </p>
          </div>
          <p className={`mx-auto max-w-5xl text-[16px] font-bold leading-[2] text-slate-600 [text-wrap:balance] sm:text-[20px] lg:text-[22px] ${isJa ? "break-keep" : ""}`}>
            {t.rich("philosophyDesc", { wbr: () => <wbr /> })}
          </p>
        </div>
      </section>

      {/* 会社情報テーブル */}
      <section className="py-8 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-1 text-[14px] font-black tracking-[0.3em] text-santo-light sm:mb-3">
            {t("overviewLabel")}
          </p>
          <h2 className="mb-3 text-2xl font-black tracking-wider text-slate-900 sm:mb-4 sm:text-4xl lg:text-5xl">
            {t("overviewTitle")}
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full">
              <tbody>
                {companyInfo.map((item, i) => (
                  <tr
                    key={item.label}
                    className={
                      i % 2 === 0 ? "bg-white" : "bg-santo-gray"
                    }
                  >
                    <th className="w-28 border-r border-slate-200 px-3 py-2.5 text-left text-[12px] font-black tracking-wider text-santo-navy sm:w-52 sm:px-6 sm:py-3.5 sm:text-[16px]">
                      {item.label}
                    </th>
                    <td className="px-3 py-2.5 text-[12px] font-bold text-slate-600 sm:px-6 sm:py-3.5 sm:text-[16px]">
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </>
  );
}
