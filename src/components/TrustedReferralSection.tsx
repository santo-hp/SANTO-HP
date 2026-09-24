import { getTranslations } from "next-intl/server";

type TrustedReferralSectionProps = {
  rightCard?: "shushoku" | "madeInLocal";
};

export async function TrustedReferralSection({
  rightCard = "shushoku",
}: TrustedReferralSectionProps) {
  const t = await getTranslations("Home");
  const isMadeInLocal = rightCard === "madeInLocal";
  const rightHref = isMadeInLocal
    ? "https://madeinlocal.jp/category/companies/kanagawa096"
    : "https://find-bestwork.com/chiiki/kanagawa/100006/#:~:text=株式会社サントー";

  return (
    <section className="py-6 sm:py-9">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mb-4 text-center text-[15px] font-bold leading-[1.5] text-slate-700 sm:mb-5 sm:text-[24px] lg:text-[28px]">
          <span className="mr-2 hidden text-slate-800 sm:inline">＼</span>
          {t("trustedDesc1")}<br className="sm:hidden" />
          <span className="text-[1.15em] font-black text-santo-blue">{t("trustedDescHighlight")}</span>
          {t("trustedDesc2")}
          <span className="ml-2 hidden text-slate-800 sm:inline">／</span>
        </p>
        <div className="-mx-4 overflow-visible bg-[#5ba3d9] sm:mx-auto sm:max-w-5xl sm:overflow-hidden sm:rounded-2xl">
          <div className="relative flex items-center justify-center px-4 py-3 sm:py-4">
            <a
              href="https://haken-matching.jp/haken-comparison/kanagawa/196/#:~:text=株式会社%20サントー"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-[2%] z-30 w-[35%] -rotate-6 overflow-hidden rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.15] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] sm:left-[1%] sm:w-[37%] sm:hover:scale-110"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hojin_haken_matching_ranking.png"
                alt="神奈川の人材派遣会社おすすめランキング"
                className="w-full"
              />
            </a>

            <div className="relative z-10 flex flex-col items-center rounded-full border-[2px] border-dashed border-white bg-white/95 px-3 py-2.5 shadow-lg sm:border-[3px] sm:px-10 sm:py-6 lg:px-14 lg:py-8">
              <span className="mb-1 inline-block rounded-md bg-[#f5c518] px-2 py-0.5 text-[8px] font-black tracking-widest text-slate-900 shadow-sm sm:mb-2 sm:px-5 sm:py-1 sm:text-[14px]">
                CHECK!
              </span>
              <p className="text-center text-[12px] leading-[1.3] tracking-wider text-santo-navy sm:text-[22px] sm:leading-[1.4] lg:text-[28px]" style={{ fontWeight: 900, WebkitTextStroke: "0.5px currentColor" }}>
                {t("trustedCheckText").split("\n").map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </p>
            </div>

            <a
              href={rightHref}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-[2%] z-30 w-[33%] rotate-6 overflow-hidden rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.15] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] sm:right-[1%] sm:w-[35%] sm:hover:scale-110"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isMadeInLocal ? "/images/made_in_local.png" : "/images/hashtag_shushoku_expanded_v2.png"}
                alt={isMadeInLocal ? "地域がいま、面白い！ MADE IN LOCAL" : "#就職しよう"}
                className="w-full"
              />
            </a>
          </div>
        </div>
        <div className="mt-4 flex flex-row items-stretch justify-center gap-2 sm:gap-4">
          <a
            href="https://haken-matching.jp/haken-comparison/kanagawa/196/#:~:text=株式会社%20サントー"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-santo-navy px-3 py-2.5 text-center text-[13px] font-bold tracking-wide text-white shadow-sm transition hover:bg-santo-blue sm:flex-none sm:px-10 sm:py-3 sm:text-[18px]"
          >
            {t("trustedButtonMatching")}
          </a>
          <a
            href={rightHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-center text-[13px] font-bold tracking-wide text-white shadow-sm transition sm:flex-none sm:px-10 sm:py-3 sm:text-[18px] ${
              isMadeInLocal
                ? "bg-[#175c3a] hover:bg-[#10452b]"
                : "bg-[#e89b0c] hover:bg-[#d08a0a]"
            }`}
          >
            {t(isMadeInLocal ? "trustedButtonMadeInLocal" : "trustedButtonShushoku")}
          </a>
        </div>
      </div>
    </section>
  );
}
