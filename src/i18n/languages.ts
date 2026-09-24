import { routing } from "./routing";

// 言語切替UIの表示定義。routing.locales と対応。
export const LANGUAGES = [
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
] as const;

// "/ja/jobs/" -> "/jobs/"。(?=/|$) で "/ja..." に前方一致する
// 別パスを誤って削らないようにする。
const LOCALE_PREFIX_RE = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

export function stripLocalePrefix(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX_RE, "") || "/";
}
