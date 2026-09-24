import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LaborInfo" });
  return pageMetadata({
    locale,
    path: "/labor-info",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

const pieSegments = [
  { key: "marginChartWorkerWage", percent: 71.9, color: "#bae6fd", text: "#0c4a6e", fontSize: 16, labelRadius: 0.6 },
  { key: "marginChartProfit",     percent: 9.37, color: "#fecaca", text: "#9f1239", fontSize: 11, labelRadius: 0.7 },
  { key: "marginChartLegalWelfare", percent: 9.37, color: "#fde68a", text: "#92400e", fontSize: 11, labelRadius: 0.7 },
  { key: "marginChartOtherExpenses", percent: 9.36, color: "#a7f3d0", text: "#065f46", fontSize: 11, labelRadius: 0.7 },
] as const;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function MarginPieChart({ legendLabels }: { legendLabels: { key: string; node: React.ReactNode; color: string }[] }) {
  const cx = 110;
  const cy = 110;
  const r = 95;

  const slices = pieSegments.reduce<Array<(typeof pieSegments)[number] & {
    path: string;
    labelPos: { x: number; y: number };
  }>>((acc, seg) => {
    const startDeg = acc.reduce((sum, slice) => sum + (slice.percent / 100) * 360, 0);
    const sweep = (seg.percent / 100) * 360;
    const endDeg = startDeg + sweep;
    const start = polarToCartesian(cx, cy, r, startDeg);
    const end = polarToCartesian(cx, cy, r, endDeg);
    const largeArc = sweep > 180 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
    const midDeg = startDeg + sweep / 2;
    const labelPos = polarToCartesian(cx, cy, r * seg.labelRadius, midDeg);
    acc.push({ ...seg, path, labelPos });
    return acc;
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
      <svg
        viewBox="0 0 220 220"
        className="h-64 w-64 sm:h-72 sm:w-72"
        role="img"
        aria-label="Margin breakdown"
      >
        {slices.map((slice) => (
          <path
            key={`${slice.key}-slice`}
            d={slice.path}
            fill={slice.color}
            stroke="#ffffff"
            strokeWidth={2}
          />
        ))}
        {slices.map((slice) => (
          <text
            key={`${slice.key}-pct`}
            x={slice.labelPos.x}
            y={slice.labelPos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={slice.fontSize}
            fontWeight="700"
            fill={slice.text}
          >
            {slice.percent}%
          </text>
        ))}
      </svg>

      <ul className="grid w-full max-w-xs grid-cols-1 gap-2 text-xs sm:w-auto sm:text-sm">
        {legendLabels.map((seg) => (
          <li key={seg.key} className="flex items-start gap-2">
            <span
              className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-sm border border-slate-300"
              style={{ backgroundColor: seg.color }}
            />
            <span className="font-semibold text-slate-700">
              {seg.node}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function LaborInfoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "LaborInfo" });
  const tFooter = await getTranslations({ locale, namespace: "Footer" });

  const trainingRows = Array.from({ length: 7 }, (_, i) => {
    const n = i + 1;
    return {
      target: t(`trainingRow${n}Target`),
      content: t(`trainingRow${n}Content`),
      method: t(`trainingRow${n}Method`),
      provider: t(`trainingRow${n}Provider`),
      cost: t(`trainingRow${n}Cost`),
      wage: t(`trainingRow${n}Wage`),
      hours: t(`trainingRow${n}Hours`),
    };
  });

  const richNowrap = (chunks: React.ReactNode) => <span className="inline-block whitespace-nowrap">{chunks}</span>;
  const richBrMobile = () => <br className="sm:hidden" />;
  const richBr = () => <br />;

  const legendLabels = pieSegments.map((seg) => ({
    key: seg.key,
    color: seg.color,
    node: t.rich(seg.key, { nowrap: (c) => <>{c}</>, br: richBrMobile }),
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-2 text-xl font-bold text-slate-900 sm:text-2xl">
        {t("pageTitle")}
      </h1>
      <p className="mb-2 text-sm text-slate-600">
        {t("pageSubtitle")}
      </p>
      <p className="mb-10 text-sm text-slate-600">
        {t("targetPeriodNote")}
      </p>

      <hr className="mb-8 border-slate-300" />

      {/* マージン率の計算式 */}
      <section className="mb-10">
        <h2 className="mb-3 text-base font-bold text-slate-800">{t("marginFormulaTitle")}</h2>
        <div className="mb-4 rounded bg-slate-50 px-4 py-3">
          <p className="text-center text-sm font-semibold text-slate-700 [text-wrap:balance] break-keep">
            {t.rich("marginFormulaDesc", { nowrap: richNowrap, br: richBrMobile })}
          </p>
        </div>

        {/* 円グラフ */}
        <div className="mb-4 rounded border border-slate-200 bg-white p-4">
          <MarginPieChart legendLabels={legendLabels} />
          <p className="mt-4 text-xs text-slate-500">
            {t("marginChartOtherNote")}
          </p>
        </div>

        <p className="text-xs text-slate-500">
          {t("marginNote")}
        </p>
      </section>

      {/* 派遣事業の状況 */}
      <section className="mb-10">
        <h2 className="mb-4 text-base font-bold text-slate-800">{t("dispatchInfoTitle")}</h2>
        <table className="w-full border-collapse border border-slate-300 text-sm">
          <tbody>
            <tr className="border-b border-slate-300">
              <th className="w-1/2 border-r border-slate-300 bg-slate-100 px-3 py-3 text-left font-semibold text-slate-700 sm:w-[55%] sm:break-keep sm:px-4">
                {t("dispatchWorkers")}
              </th>
              <td className="px-3 py-3 text-right font-semibold text-slate-800 sm:px-4">{t("dispatchWorkersValue")}</td>
            </tr>
            <tr className="border-b border-slate-300">
              <th className="border-r border-slate-300 bg-slate-100 px-3 py-3 text-left font-semibold text-slate-700 sm:break-keep sm:px-4">
                {t("dispatchDestinations")}
              </th>
              <td className="px-3 py-3 text-right font-semibold text-slate-800 sm:px-4">{t("dispatchDestinationsValue")}</td>
            </tr>
            <tr className="border-b border-slate-300">
              <th className="border-r border-slate-300 bg-slate-100 px-3 py-3 text-left font-semibold text-slate-700 sm:break-keep sm:px-4">
                {t("avgFee")}
                <span className="block text-xs font-normal text-slate-500 sm:break-keep">
                  {t("avgFeeNote")}
                </span>
              </th>
              <td className="px-3 py-3 text-right font-semibold text-slate-800 sm:px-4">{t("avgFeeValue")}</td>
            </tr>
            <tr className="border-b border-slate-300">
              <th className="border-r border-slate-300 bg-slate-100 px-3 py-3 text-left font-semibold text-slate-700 sm:break-keep sm:px-4">
                {t("avgWage")}
                <span className="block text-xs font-normal text-slate-500 sm:break-keep">
                  {t("avgWageNote")}
                </span>
              </th>
              <td className="px-3 py-3 text-right font-semibold text-slate-800 sm:px-4">{t("avgWageValue")}</td>
            </tr>
            <tr className="border-b border-slate-300">
              <th className="border-r border-slate-300 bg-slate-100 px-3 py-3 text-left font-semibold text-slate-700 sm:break-keep sm:px-4">
                {t.rich("marginRateDesc", { br: richBr })}
              </th>
              <td className="px-3 py-3 text-right text-lg font-bold text-slate-900 sm:px-4">{t("marginRateValue")}</td>
            </tr>
            <tr>
              <th className="border-r border-slate-300 bg-slate-100 px-3 py-3 text-left font-semibold text-slate-700 sm:break-keep sm:px-4">
                {t.rich("careerContact", { nowrap: (c) => <>{c}</>, br: richBrMobile })}
              </th>
              <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-slate-800 sm:px-4">{t("careerContactValue")}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 教育訓練 */}
      <section className="mb-10">
        <h2 className="mb-4 text-base font-bold text-slate-800">{t("trainingTitle")}</h2>
        <div>
          <table className="w-full border-collapse border border-slate-300 text-[11px] sm:text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 px-1 py-2 text-left font-semibold text-slate-700 sm:px-3">{t("trainingColTarget")}</th>
                <th className="border border-slate-300 px-1 py-2 text-left font-semibold text-slate-700 sm:px-3">{t("trainingColContent")}</th>
                <th className="border border-slate-300 px-1 py-2 text-left font-semibold text-slate-700 sm:px-3">{t("trainingColMethod")}</th>
                <th className="border border-slate-300 px-1 py-2 text-left font-semibold text-slate-700 sm:px-3">{t("trainingColProvider")}</th>
                <th className="border border-slate-300 px-1 py-2 text-left font-semibold text-slate-700 sm:px-3">{t("trainingColCost")}</th>
                <th className="border border-slate-300 px-1 py-2 text-left font-semibold text-slate-700 sm:px-3">{t("trainingColWage")}</th>
                <th className="border border-slate-300 px-1 py-2 text-left font-semibold text-slate-700 sm:px-3">{t("trainingColHours")}</th>
              </tr>
            </thead>
            <tbody>
              {trainingRows.map((row, i) => (
                <tr key={i} className="border-b border-slate-300 odd:bg-white even:bg-slate-50/60">
                  <td className="border-r border-slate-300 px-1 py-2 text-slate-600 sm:px-3">{row.target}</td>
                  <td className="border-r border-slate-300 px-1 py-2 text-slate-600 sm:px-3">{row.content}</td>
                  <td className="border-r border-slate-300 px-1 py-2 text-slate-600 sm:px-3">{row.method}</td>
                  <td className="border-r border-slate-300 px-1 py-2 text-slate-600 sm:px-3">{row.provider}</td>
                  <td className="border-r border-slate-300 px-1 py-2 text-slate-600 sm:px-3">{row.cost}</td>
                  <td className="border-r border-slate-300 px-1 py-2 text-slate-600 sm:px-3">{row.wage}</td>
                  <td className="px-1 py-2 text-slate-600 sm:px-3">{row.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 労使協定 */}
      <section className="mb-10">
        <h2 className="mb-3 text-base font-bold text-slate-800">
          {t("agreementTitle")}
        </h2>
        <p className="mb-1 text-sm text-slate-600">
          {t("agreementNote")}
        </p>
        <p className="text-sm text-slate-600">
          {t("agreementScope")}
        </p>
      </section>

      <hr className="mb-6 border-slate-300" />

      <div className="text-center text-sm text-slate-500">
        <p>{tFooter("address")}</p>
        <p className="mt-1 font-bold text-slate-700">{tFooter("companyName")}</p>
      </div>
    </div>
  );
}
