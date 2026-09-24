import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

const MADE_IN_LOCAL_URL =
  "https://madeinlocal.jp/category/companies/kanagawa096";

export async function AwardRecognitionSection() {
  const t = await getTranslations("Home");

  return (
    <section className="overflow-hidden bg-white py-4 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="-mx-4 sm:mx-auto sm:max-w-5xl">
          <div className="-my-[5.5%] grid">
            <Image
              src="/images/award-ribbon-background-v2.png"
              width={1600}
              height={533}
              sizes="(min-width: 640px) 1024px, 100vw"
              unoptimized
              alt=""
              aria-hidden
              className="col-start-1 row-start-1 block h-auto w-full scale-[1.04]"
            />
            <Image
              src="/images/kanagawa-best-100-companies-2026-2027.png"
              width={1600}
              height={533}
              sizes="(min-width: 640px) 1024px, 100vw"
              unoptimized
              alt={t("awardImageAlt")}
              className="relative z-10 col-start-1 row-start-1 block h-auto w-full scale-[0.8]"
            />
          </div>
          <div className="relative z-10 px-4 py-1 text-center sm:px-6 sm:py-1.5">
            <a
              href={MADE_IN_LOCAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-sm bg-santo-blue px-10 py-3 text-[15px] font-black tracking-wide text-white shadow-sm transition-colors hover:bg-santo-navy sm:px-12 sm:text-[17px]"
            >
              {t("trustedButtonMadeInLocal")}
              <ArrowUpRight className="h-5 w-5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
