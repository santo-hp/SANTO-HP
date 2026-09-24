"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { ChevronRight } from "lucide-react";

function ServiceRow({
  service,
  index,
}: {
  service: {
    img: string;
    label: string;
    title: string;
    subtitle: string;
    description: ReactNode;
    bg: string;
  };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isEven = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`${service.bg} relative overflow-hidden`}>
      {/* 背景の大きな番号 */}
      <div
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[280px] font-black leading-none text-santo-navy/[0.03] sm:text-[360px] ${
          isEven ? "right-8" : "left-8"
        }`}
      >
        {service.label}
      </div>

      <div
        ref={ref}
        className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:py-14"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateX(0)"
            : isEven
              ? "translateX(-60px)"
              : "translateX(60px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <div
          className={`flex flex-col items-center gap-6 lg:gap-10 ${
            isEven ? "lg:flex-row" : "lg:flex-row-reverse"
          }`}
        >
          {/* 図 */}
          <div className="flex w-full items-center justify-center lg:w-[55%]">
            <div className="w-full max-w-[560px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.img}
                alt={service.title}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>

          {/* テキスト */}
          <div className="w-full lg:w-[45%]">
            <p className="mb-3 text-[14px] font-black tracking-[0.3em] text-santo-light">
              {service.subtitle.toUpperCase()}
            </p>
            <div className="mb-3 flex items-baseline gap-3 sm:gap-4">
              <span className="text-5xl font-black leading-none text-santo-navy/10 sm:text-7xl lg:text-8xl">
                {service.label}
              </span>
              <h3 className="text-2xl font-black tracking-wider text-slate-900 sm:text-3xl lg:text-4xl">
                {service.title}
              </h3>
            </div>
            <div className="mb-3 h-1 w-14 rounded-full bg-santo-navy" />
            <p className="text-[16px] font-bold leading-[2.2] text-slate-600 [text-wrap:pretty] sm:text-[20px]">
              {service.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceOverview() {
  const t = useTranslations("ServiceOverview");
  const locale = useLocale();
  const imgSuffix = locale === "ja" ? "" : locale === "zh" ? "_zh" : locale === "es" ? "_es" : locale === "pt" ? "_pt" : "_en";
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const services = [
    {
      img: locale === "ja" ? `/images/services/dispatch_service_v6.png` : `/images/services/dispatch_service${imgSuffix}_v6.png`,
      label: "01",
      title: t("dispatchTitle"),
      subtitle: "Staffing Service",
      description: t.rich("dispatchDesc", { br: () => <br className="hidden md:block" /> }),
      bg: "bg-white",
    },
    {
      img: locale === "ja" ? `/images/services/outsourcing_service_v7.png` : `/images/services/outsourcing_service${imgSuffix}_v7.png`,
      label: "02",
      title: t("outsourcingTitle"),
      subtitle: "Outsourcing Service",
      description: t.rich("outsourcingDesc", { br: () => <br className="hidden md:block" /> }),
      bg: "bg-[#f4f7fb]",
    },
    {
      img: `/images/services/labor_management_${locale}.png`,
      label: "03",
      title: t("diagramTitle"),
      subtitle: "Staffing Structure",
      description: t.rich("diagramDesc", { br: () => <br className="hidden md:block" /> }),
      bg: "bg-white",
    },
  ];

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const idx = Number(entry.target.getAttribute("data-idx"));
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      { root, threshold: [0.6] }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToCard = (i: number) => {
    const card = cardRefs.current[i];
    const root = scrollerRef.current;
    if (!card || !root) return;
    const target = card.offsetLeft + card.offsetWidth / 2 - root.clientWidth / 2;
    root.scrollTo({ left: target, behavior: "smooth" });
  };

  const isLast = activeIndex >= services.length - 1;

  return (
    <div>
      {/* セクションヘッダー */}
      <section className="bg-white pb-0 pt-8 sm:pt-14 lg:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <p className="mb-3 text-[13px] font-black tracking-[0.25em] text-santo-light">
              {t("label")}
            </p>
            <h2 className="text-3xl font-black tracking-wider text-slate-900 sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <div className="mx-auto mt-2 h-1 rounded-full bg-santo-navy" style={{ width: "557px", maxWidth: "100%" }} />
            <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-[1.9] text-slate-500 [text-wrap:pretty] sm:text-[18px]">
              {t("subtitlePre1")}<span className="whitespace-nowrap text-[1.15em] font-bold text-santo-blue">{t("subtitleHighlight1")}</span>{t("subtitleMid1")}<span className="whitespace-nowrap text-[1.15em] font-bold text-santo-blue">{t("subtitleHighlight2")}</span>{(() => {
                const mid2 = t("subtitleMid2");
                const m = mid2.match(/^([^、，]*[、，])(.*)$/);
                return m ? <>{m[1]}<br className="sm:hidden" />{m[2]}</> : mid2;
              })()}<span className="whitespace-nowrap text-[1.15em] font-bold text-santo-navy">{t("subtitleHighlight3")}</span>{t("subtitlePost1")}<br />{t("subtitle2Pre")}<span className="whitespace-nowrap font-bold text-slate-700">{t("subtitle2Highlight1")}</span>{t("subtitle2Mid")}<span className="whitespace-nowrap font-bold text-slate-700">{t("subtitle2Highlight2")}</span>{t("subtitle2Post")}
            </p>
          </div>
        </div>
      </section>

      {/* モバイル: 横スクロールカード（中央スナップ） */}
      <div className="md:hidden bg-white py-6 px-4">
        <div className="relative -mx-4">
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto px-[calc((100vw-280px)/2)] pb-4 snap-x snap-mandatory scrollbar-hide"
          >
            {services.map((service, i) => (
              <div
                key={service.title}
                ref={(el) => { cardRefs.current[i] = el; }}
                data-idx={i}
                className="w-[280px] shrink-0 snap-center"
              >
                <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {/* 画像 */}
                  <div className="flex items-center justify-center bg-slate-50/60 px-2 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.img}
                      alt={service.title}
                      className="h-auto max-h-[220px] w-full object-contain"
                    />
                  </div>
                  {/* 本文 */}
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[11px] font-black tracking-[0.25em] text-santo-light">
                      {service.subtitle.toUpperCase()}
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-3xl font-black leading-none text-santo-navy/15">
                        {service.label}
                      </span>
                      <h3 className="text-[17px] font-black tracking-wider text-slate-900">
                        {service.title}
                      </h3>
                    </div>
                    <div className="mt-2 mb-2 h-[2px] w-10 rounded-full bg-santo-navy" />
                    <p className="text-[13px] font-bold leading-[1.9] text-slate-600">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 右端の「もっと見る」シェブロン（最後のカードでフェードアウト） */}
          <div
            className={`pointer-events-none absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-opacity duration-300 ${
              isLast ? "opacity-0" : "opacity-100 animate-pulse"
            }`}
            aria-hidden="true"
          >
            <ChevronRight className="h-6 w-6 text-santo-navy" />
          </div>
        </div>

        {/* ページネーションドット */}
        <div className="mt-2 flex justify-center gap-2">
          {services.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToCard(i)}
              aria-label={t("cardDotLabel", { number: i + 1 })}
              className={`h-2 rounded-full transition-all ${
                activeIndex === i ? "w-6 bg-santo-navy" : "w-2 bg-santo-navy/25"
              }`}
            />
          ))}
        </div>
      </div>

      {/* デスクトップ: ジグザグレイアウト */}
      <div className="hidden md:block">
        {services.map((service, i) => (
          <ServiceRow key={service.title} service={service} index={i} />
        ))}
      </div>
    </div>
  );
}
