import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteJsonLd } from "@/components/JsonLd";
import { OG_IMAGE, SITE_BASE, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_BASE),
  title: {
    default: "株式会社サントー | 人材派遣",
    template: "%s | 株式会社サントー",
  },
  description:
    "神奈川県平塚市の人材派遣会社、株式会社サントー。製造・物流・事務の求人紹介から企業の人材課題まで、仕事を探す方と企業を丁寧に支援します。",
  keywords: ["人材派遣", "求人", "派遣会社", "サントー", "求職", "平塚市", "神奈川県"],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <SiteJsonLd />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
