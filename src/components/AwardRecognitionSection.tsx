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
          <div className="relative -my-[5.5%]">
            <Image
              src="/images/award-ribbon-blue-folded.png"
              width={2170}
              height={725}
              sizes="(min-width: 640px) 1024px, 100vw"
              unoptimized
              alt=""
              aria-hidden
              className="block h-auto w-full scale-[1.04]"
            />
            {/* Center the artwork on the ribbon's front face, above the folds. */}
            <Image
              src="/images/kanagawa-best-100-companies-2026-2027.png"
              width={1600}
              height={533}
              sizes="(min-width: 1088px) 676px, 66vw"
              unoptimized
              alt={t("awardImageAlt")}
              className="absolute left-1/2 top-[42%] z-10 block h-auto w-[66%] -translate-x-1/2 -translate-y-1/2 [clip-path:inset(17%_3%_24%_3%)]"
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
