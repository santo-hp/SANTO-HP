import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_BASE = "https://santo-hp.co.jp";
export const SITE_NAME = "株式会社サントー";
export const LOCALES = routing.locales;
export const DEFAULT_LOCALE = routing.defaultLocale;

const OG_LOCALE: Record<string, string> = {
  ja: "ja_JP",
  en: "en_US",
  zh: "zh_CN",
  es: "es_ES",
  pt: "pt_BR",
};

export const OG_IMAGE = {
  url: "/images/og-image.jpg",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

// Trailing slash to match next.config.ts trailingSlash: true
export function localeUrl(locale: string, path: string): string {
  return `${SITE_BASE}/${locale}${path}/`;
}

export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = localeUrl(locale, path);
  }
  languages["x-default"] = localeUrl(DEFAULT_LOCALE, path);
  return languages;
}

type PageMetadataInput = {
  locale: string;
  /** Path without locale prefix or trailing slash, e.g. "" for home, "/about" */
  path: string;
  title: string;
  description?: string;
  noindex?: boolean;
};

/**
 * Builds full page metadata: canonical URL, hreflang alternates,
 * Open Graph and Twitter cards. Titles in messages already include
 * the brand, so they are set as absolute to avoid the layout
 * template appending the brand twice.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex,
}: PageMetadataInput): Metadata {
  const url = localeUrl(locale, path);
  return {
    metadataBase: new URL(SITE_BASE),
    title: { absolute: title },
    description,
    alternates: noindex
      ? undefined
      : {
          canonical: url,
          languages: languageAlternates(path),
        },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale] ?? OG_LOCALE[DEFAULT_LOCALE],
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
