import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { MapPin, Train, Car, Clock, Phone } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Access" });
  return pageMetadata({
    locale,
    path: "/access",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function AccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Access");

  return (
    <>
      <PageHeader label={t("pageLabel")} title={t("pageTitle")} subtitle={t("pageSubtitle")} image="/images/access_map_illustration.png" largeSubtitle />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Map */}
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent("神奈川県平塚市代官町7-29")}&hl=${locale}&z=17&output=embed`}
                className="h-80 w-full lg:h-full lg:min-h-[400px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t("mapTitle")}
              />
            </div>

            {/* Info */}
            <div>
              <h2 className="mb-8 text-2xl font-black tracking-wider text-slate-900">
                {t("companyName")}
              </h2>

              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    label: t("addressLabel"),
                    content: t("addressValue"),
                    isTel: false,
                  },
                  {
                    icon: Phone,
                    label: t("telLabel"),
                    content: t("telValue"),
                    isTel: true,
                  },
                  {
                    icon: Train,
                    label: t("trainLabel"),
                    content: t("trainValue"),
                    isTel: false,
                  },
                  {
                    icon: Car,
                    label: t("carLabel"),
                    content: t("carValue"),
                    isTel: false,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex gap-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-santo-sky">
                      <item.icon className="h-5 w-5 text-santo-blue" />
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-black tracking-[0.15em] text-santo-light">
                        {item.label}
                      </p>
                      {item.isTel ? (
                        <p className="text-[13px] font-bold leading-[1.9] text-slate-600 whitespace-pre-line">
                          <a
                            href="tel:0463-24-1722"
                            className="text-santo-blue underline hover:text-santo-navy"
                          >
                            {item.content}
                          </a>
                        </p>
                      ) : (
                        <p className="text-[13px] font-bold leading-[1.9] text-slate-600 whitespace-pre-line">
                          {item.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl bg-slate-100 px-6 py-5">
                <div className="flex items-center gap-4">
                  <Clock className="h-6 w-6 shrink-0 text-santo-navy" />
                  <div>
                    <p className="text-[11px] font-black tracking-[0.15em] text-slate-400">
                      {t("hoursLabel")}
                    </p>
                    <p className="mt-1 text-[17px] font-bold tracking-wide text-slate-800">
                      {t("hoursValue")}
                    </p>
                    <p className="mt-1 text-[12px] font-bold text-slate-400">
                      {t("hoursNote")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
