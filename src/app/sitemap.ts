import type { MetadataRoute } from "next";
import { JOB_IDS } from "@/lib/jobs";
import { LOCALES, languageAlternates, localeUrl } from "@/lib/seo";

export const dynamic = "force-static";

type ChangeFreq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

type StaticPage = {
  path: string; // e.g. "" for home, "/about" (no trailing slash; added later)
  changeFrequency: ChangeFreq;
  priority: number;
};

const STATIC_PAGES: StaticPage[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/employers", changeFrequency: "monthly", priority: 0.8 },
  { path: "/jobseekers", changeFrequency: "monthly", priority: 0.8 },
  { path: "/jobs", changeFrequency: "weekly", priority: 0.9 },
  { path: "/labor-info", changeFrequency: "monthly", priority: 0.5 },
  { path: "/access", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const pages: Array<Pick<StaticPage, "path" | "changeFrequency" | "priority">> = [
    ...STATIC_PAGES,
    // Job detail pages. Apply pages are intentionally excluded (noindex).
    ...JOB_IDS.map((id) => ({
      path: `/jobs/${id}`,
      changeFrequency: "weekly" as ChangeFreq,
      priority: 0.8,
    })),
  ];

  for (const page of pages) {
    const alternates = languageAlternates(page.path);
    for (const locale of LOCALES) {
      entries.push({
        url: localeUrl(locale, page.path),
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: alternates },
      });
    }
  }

  return entries;
}
