"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

function FeatureRow({
  feature,
  index,
}: {
  feature: {
    problem: string;
    problemImg: string;
    title: string;
    solution: ReactNode;
    img: string;
  };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const timer = setTimeout(() => {
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
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${index * 150}ms, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${index * 150}ms`,
      }}
    >
      {/* モバイル: 縦並び */}
      <div className="flex flex-col md:hidden">
        <div className="rounded-t-2xl bg-slate-100 border border-b-0 border-slate-200 px-4 py-2">
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/extracted_curly_line_straight.png" alt="" className="h-16 w-16 object-contain" />
          </div>
          <p className="whitespace-pre-line text-center text-[16px] font-bold leading-[1.7] text-slate-700 sm:text-[20px]">
            {feature.problem}
          </p>
        </div>
        <div className="rounded-b-2xl border border-t-0 border-slate-200 bg-white p-5 sm:p-8 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-santo-navy before:rounded-bl-2xl">
          <div className="mb-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={feature.img} alt={feature.title} className="h-24 w-24 object-contain sm:h-32 sm:w-32" />
          </div>
          <h3 className="mb-2 text-center text-lg font-black tracking-wider text-santo-navy sm:text-xl">
            {feature.title}
          </h3>
          <p className="text-center text-[15px] font-bold leading-[2] text-slate-600 sm:text-[18px]">
            {feature.solution}
          </p>
        </div>
      </div>

      {/* デスクトップ */}
      <div className="relative hidden md:flex items-stretch">
        {/* 左: 悩み（斜めカット） */}
        <div
          className="flex flex-[0_0_42%] items-center rounded-l-2xl border border-slate-200 bg-slate-100 py-8 pl-7 pr-10"
          style={{
            clipPath: "polygon(0 0, calc(100% - 40px) 0, 100% 100%, 0 100%)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/extracted_curly_line_straight.png" alt="" className="h-20 w-20 object-contain" />
            </div>
            <p className="whitespace-pre-line text-[22px] font-bold leading-[1.7] text-slate-700">
              {feature.problem}
            </p>
          </div>
        </div>

        {/* 右: 解決（斜めカットで噛み合う） */}
        <div
          className="flex flex-[0_0_60%] items-center rounded-r-2xl border border-slate-200 bg-white py-8 pl-12 pr-8"
          style={{
            marginLeft: "-2%",
            clipPath: "polygon(40px 0, 100% 0, 100% 100%, 0 100%)",
          }}
        >
          <div className="flex items-center gap-6">
            <div className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={feature.img} alt={feature.title} className="h-36 w-36 object-contain" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-wider text-santo-navy">
                {feature.title}
              </h3>
              <p className="mt-2 text-[18px] font-bold leading-[2] text-slate-600">
                {feature.solution}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureCards() {
  const t = useTranslations("FeatureCards");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      problem: t("problem1"),
      problemImg: "/images/features/problem01.svg",
      title: t("solution1Title"),
      solution: t("solution1Desc"),
      img: "/images/features/support_illustration.svg",
    },
    {
      problem: t("problem2"),
      problemImg: "/images/features/problem02.svg",
      title: t("solution2Title"),
      solution: t.rich("solution2Desc", { br: () => <br className="md:hidden" /> }),
      img: "/images/features/quick_response.svg",
    },
    {
      problem: t("problem3"),
      problemImg: "/images/features/problem03.svg",
      title: t("solution3Title"),
      solution: t("solution3Desc"),
      img: "/images/features/talent_network.svg",
    },
  ];

  // 表示中のカード index を追跡（ドットとシェブロン制御に使用）
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
    // カードの中心がスクローラの中心と一致するようにスクロール
    const target = card.offsetLeft + card.offsetWidth / 2 - root.clientWidth / 2;
    root.scrollTo({ left: target, behavior: "smooth" });
  };

  const isLast = activeIndex >= features.length - 1;

  return (
    <>
      {/* モバイル: 横スクロール（中央スナップ） */}
      <div className="md:hidden">
        <div className="relative -mx-4">
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto px-[calc((100vw-280px)/2)] pb-4 snap-x snap-mandatory scrollbar-hide"
          >
            {features.map((feature, i) => (
              <div
                key={feature.title}
                ref={(el) => { cardRefs.current[i] = el; }}
                data-idx={i}
                className="w-[280px] shrink-0 snap-center"
              >
                <div className="rounded-t-2xl border border-b-0 border-slate-200 bg-slate-100 px-4 py-2">
                  <div className="flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/extracted_curly_line_straight.png" alt="" className="h-12 w-12 object-contain" />
                  </div>
                  <p className="whitespace-pre-line text-center text-[14px] font-bold leading-[1.6] text-slate-700">
                    {feature.problem}
                  </p>
                </div>
                <div className="rounded-b-2xl border border-t-0 border-slate-200 bg-white p-4">
                  <div className="mb-3 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={feature.img} alt={feature.title} className="h-20 w-20 object-contain" />
                  </div>
                  <h3 className="mb-1 text-center text-[15px] font-black tracking-wider text-santo-navy">
                    {feature.title}
                  </h3>
                  <p className="text-left text-[13px] font-bold leading-[1.8] text-slate-600">
                    {feature.solution}
                  </p>
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
          {features.map((_, i) => (
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

      {/* デスクトップ: 従来の縦並び */}
      <div className="hidden md:block space-y-10">
        {features.map((feature, i) => (
          <FeatureRow key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </>
  );
}
