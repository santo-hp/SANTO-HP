import { SITE_BASE, SITE_NAME } from "@/lib/seo";

const ORGANIZATION_ID = `${SITE_BASE}/#organization`;
const WEBSITE_ID = `${SITE_BASE}/#website`;

// 人材派遣会社としての組織情報。Google のナレッジパネル/企業情報
// リッチリザルトの元データになる。
const organization = {
  "@type": "EmploymentAgency",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  alternateName: "SANTO CO., LTD.",
  url: `${SITE_BASE}/`,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_BASE}/images/santo_logo_square.jpg`,
    width: 300,
    height: 300,
  },
  image: `${SITE_BASE}/images/og-image.jpg`,
  email: "santo@santo-hp.co.jp",
  telephone: "+81-463-24-1722",
  address: {
    "@type": "PostalAddress",
    postalCode: "254-0807",
    addressRegion: "神奈川県",
    addressLocality: "平塚市",
    streetAddress: "代官町7-29",
    addressCountry: "JP",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "神奈川県",
  },
};

// サイト名リッチリザルト(検索結果でのサイト名表示)用。
const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_BASE}/`,
  name: SITE_NAME,
  alternateName: ["サントー", "SANTO CO., LTD."],
  publisher: { "@id": ORGANIZATION_ID },
};

export function SiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [organization, website],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export type BreadcrumbItem = {
  name: string;
  /** Absolute URL. Omit for the current (last) page. */
  url?: string;
};

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
