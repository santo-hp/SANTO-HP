import "server-only";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { getTranslations } from "next-intl/server";
import { JOB_IDS } from "./jobs";
import { JOB_META, JOB_WORK_SCHEDULE } from "./legacy-job-meta";
import type { JobCard, JobResults } from "./job-types";

type SourceRecord = Record<string, string>;
type ImportedJob = JobCard & { fields: SourceRecord; searchText: string };
const source = JSON.parse(readFileSync(path.join(process.cwd(), "data/imported-jobs.json"), "utf8")) as {
  headers: string[]; records: SourceRecord[];
};
export const importedHeaders = source.headers;
const normalize = (value: string) => value.normalize("NFKC").toLowerCase();
const money = (value: string) => /^\d+(\.\d+)?$/.test(value) ? Number(value).toLocaleString("ja-JP") + "円" : value;
const importedJobs: ImportedJob[] = source.records.map((fields) => {
  const id = Number(fields['求人ID']);
  const location = fields['エリア名（都道府県）'] + fields['エリア名（市区町村）'];
  const station = fields['公共交通機関1'] || fields['最寄駅'];
  const transport = [station, fields['公共交通機関1_交通手段'], fields['公共交通機関1_所要時間（分）'] ? `${fields['公共交通機関1_所要時間（分）']}分` : ''].filter(Boolean).join(' ');
  return {
    id, fields,
    // The source has no employer-name or photo column. Do not invent either.
    company: location,
    title: `【${fields['エリア名（市区町村）'] || fields['エリア名（都道府県）']}】${fields['職種名'] || fields['職種'] || fields['業務内容(概要)'].split(/\r?\n/)[0].slice(0, 80) || '求人情報'}`,
    image: null,
    salary: [fields['給与形態'], money(fields['給与（月給/時給）'])].filter(Boolean).join(' '),
    type: fields['雇用形態'],
    shift: fields['就業時間'],
    access: transport || location,
    searchText: normalize(Object.values(fields).join(' ')),
  };
});
const importedById = new Map(importedJobs.map((job) => [String(job.id), job]));
export const allJobIds = [...JOB_IDS, ...importedById.keys()];
export function jobPhoto(id: number) {
  for (const ext of ['webp', 'jpg', 'jpeg', 'png']) {
    const file = `/images/jobs/${id}.${ext}`;
    if (existsSync(path.join(process.cwd(), 'public', file))) return file;
  }
  return null;
}
export function getImportedJob(id: string) {
  const job = importedById.get(id);
  return job ? { ...job, image: jobPhoto(job.id) } : undefined;
}

const cities: Record<string, string> = {
  atsugi: '厚木市', ota: '大田区', sagamihara: '相模原市', koto: '江東区', hadano: '秦野市', ayase: '綾瀬市', samukawa: '寒川町', yokohama: '横浜市', kawasaki: '川崎市', hiratsuka: '平塚市', fujisawa: '藤沢市', chigasaki: '茅ヶ崎市', isehara: '伊勢原市', ebina: '海老名市', zama: '座間市',
};
const jobWords: Record<string, RegExp> = {
  assembly: /組立|組み立て|加工/, inspection: /検査|検品/, press: /プレス/, welding: /溶接/, machine: /機械|マシン|オペレーター/, forklift: /フォークリフト/, line: /ライン|製造/, plc: /PLC|シーケンサ/i,
};
const employmentWords: Record<string, RegExp> = {
  dispatch: /派遣/, fulltime: /正社員/, contract: /契約社員/, parttime: /アルバイト|パート/, newgrad: /^新卒$/, outsourcing: /^業務委託$/, other: /^その他$/,
};
const lineWords: Record<string, RegExp> = { jr_east: /JR|ＪＲ/, odakyu: /小田急/, sagami: /相模線/, keikyu: /京急|京浜急行/ };
function importedMatches(job: ImportedJob, key: string, value: string): boolean {
  const f = job.fields;
  switch (key) {
    case 'area': return value.startsWith('pref:') ? f['エリア名（都道府県）'] === value.slice(5) : !!cities[value] && f['エリア名（市区町村）'].includes(cities[value]);
    case 'jobType': return value.startsWith('category:') ? f['職種'] === value.slice(9) : !!jobWords[value]?.test(f['職種名'] + ' ' + f['業務内容(概要)']);
    case 'employment': return !!employmentWords[value]?.test(f['雇用形態']);
    case 'line': return !!lineWords[value]?.test(f['公共交通機関1']);
    case 'workSchedule': {
      const schedule = f['勤務形態'];
      const starts = ['就業時間開始①', '就業時間開始②', '就業時間開始③'].map(k => f[k]).filter(Boolean);
      const ends = ['就業時間終了①', '就業時間終了②', '就業時間終了③'].map(k => f[k]).filter(Boolean);
      const hour = (s: string) => Number(s.slice(0, 2));
      if (value === 'night') return /夜勤|交替|交代/.test(schedule) || starts.some(s => hour(s) >= 22 || hour(s) < 5) || ends.some(s => hour(s) > 22 || hour(s) <= 5);
      return value === 'day' && (/日勤|交替|交代/.test(schedule) || starts.some(s => hour(s) >= 5 && hour(s) < 18));
    }
    case 'features': {
      const features = f['求人の特徴'];
      if (value === 'daily_pay') return /日払い/.test(features);
      if (value === 'weekly_pay') return /週払い/.test(features);
      if (value === 'transportation') return /交通費|通勤手当/.test(features + f['福利厚生（手当）'] + f['給与備考']);
      if (value === 'no_experience') return /未経験/.test(features + f['必要な免許・資格'] + f['必要な学歴・経験・スキル']);
      if (value === 'dormitory') return /^(有|あり)/.test(f['寮']);
      if (value === 'bonus') return !!f['賞与'] && !/なし|無し|^無$/.test(f['賞与']);
      return false;
    }
    default: return false;
  }
}
export async function searchJobs(params: URLSearchParams, locale: string): Promise<JobResults> {
  const t = await getTranslations({ locale, namespace: 'Jobs' });
  const legacy: JobCard[] = JOB_IDS.map(id => ({
    id: Number(id), company: t(`job${id}Company`), title: t(`job${id}Title`),
    image: `/images/jobs/job${id.padStart(2, '0')}.png`,
    salary: t(`job${id}Salary`), type: t(`job${id}Type`), shift: t(`job${id}Shift`), access: t(`job${id}Access`),
  }));
  const values = (key: string) => (params.get(key) || '').split(',').filter(v => v && v !== 'no_preference');
  const filters = ['area', 'jobType', 'employment', 'workSchedule', 'features', 'line'].map(key => ({ key, values: values(key) }));
  const terms = normalize(params.get('q') || '').trim().split(/\s+/).filter(Boolean);
  const favoriteIds = new Set(values('ids'));
  const favoritesOnly = params.get('favorites') === '1';
  const salaries = values('salary').map(Number).filter(Number.isFinite);
  const matches = [...legacy, ...importedJobs].filter(job => {
    if (favoritesOnly && !favoriteIds.has(String(job.id))) return false;
    const imported = importedById.get(String(job.id));
    if (!terms.every(term => (imported?.searchText || normalize(Object.values(job).join(' '))).includes(term))) return false;
    if (salaries.length) {
      const hourly = imported ? imported.fields['給与形態'] === '時給' ? Number(imported.fields['給与（月給/時給）']) : 0 : JOB_META[job.id].hourlyMin;
      if (hourly < Math.min(...salaries)) return false;
    }
    return filters.every(filter => !filter.values.length || filter.values.some(value => {
      if (imported) return importedMatches(imported, filter.key, value);
      const meta = JOB_META[job.id];
      if (filter.key === 'workSchedule') return (JOB_WORK_SCHEDULE[job.id] || ['day']).includes(value);
      if (filter.key === 'area' && value.startsWith('pref:')) return (meta.area.some(area => ['ota', 'koto'].includes(area)) ? '東京都' : '神奈川県') === value.slice(5);
      return (meta[filter.key as 'area' | 'jobType' | 'employment' | 'features' | 'line'] || []).includes(value);
    }));
  });
  const pages = Math.max(1, Math.ceil(matches.length / 20));
  const requested = Number(params.get('page') || 1);
  const page = Math.max(1, Math.min(pages, Number.isFinite(requested) ? Math.floor(requested) : 1));
  const jobs = matches.slice((page - 1) * 20, page * 20).map(job => ({
    id: job.id, company: job.company, title: job.title, salary: job.salary, type: job.type,
    shift: job.shift, access: job.access, image: importedById.has(String(job.id)) ? jobPhoto(job.id) : job.image,
  }));
  return { jobs, total: matches.length, page, pages };
}
