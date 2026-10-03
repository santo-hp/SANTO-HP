import { createHash } from 'node:crypto';
import reviewedJobs from '../data/job-image-reviews.json';

// Category illustrations, not photographs of the advertised workplaces.
export const JOB_IMAGES = {
  'it-infrastructure': 'ITエンジニア',
  'creative-design': 'クリエイティブ',
  'office-admin': '事務・管理部門',
  'planning-meeting': '企画・マーケティング・経営',
  'sales-proposal': '営業',
  'legal-consulting': '教育・士業・コンサルタント',
  laboratory: '医薬・化学・研究',
  construction: '建築・土木',
  'electronics-manufacturing': '電気・電子・機械・半導体技術',
  'retail-cafe': '販売・接客・飲食サービス',
  'equipment-maintenance': '設備保守・メンテナンス',
  'factory-assembly': '組立・加工',
  'packaging-inspection': '検査・梱包・ピッキング',
  'metal-press': 'プレス・板金加工',
  welding: '溶接',
  'cnc-machining': '機械加工・機械オペレーター',
  'forklift-logistics': 'フォークリフト',
  'food-filling': '調合・充填・製造ライン',
  'automation-plc': 'PLC・設備制御',
  'glass-processing': '板ガラス加工',
  // User-supplied additions, in the agreed No.1–13 order.
  'manufacturing-general': '製造・工場作業全般',
  'vehicle-maintenance': '自動車整備・車両点検',
  'driving-transport': 'ドライバー・配送・送迎',
  'warehouse-handling': '物流・搬入・構内運搬',
  'cleaning-sanitation': '清掃・洗浄',
  'security-patrol': '警備・交通誘導',
  'field-maintenance': '住宅設備修理・現場点検',
  'healthcare-rehabilitation': '医療・看護・リハビリ',
  'care-support': '介護・福祉・生活支援',
  'beauty-salon': '美容・サロン',
  'kitchen-nutrition': '給食・厨房・栄養管理',
  'reception-service': '受付・案内・お客様対応',
  'funeral-service': '葬祭・セレモニー',
} as const;
export type JobImageKey = keyof typeof JOB_IMAGES;
export type JobImageDecision = {
  key: JobImageKey | null;
  image: string | null;
  status: 'matched' | 'no-reference' | 'needs-review';
  reason: string;
  evidence: string;
};

type Review = { fingerprint: string; key: JobImageKey | null; reason: string };
const reviews = reviewedJobs as Record<string, Review>;
const normalize = (value: string) => value.normalize('NFKC').trim();
const imagePath = (key: JobImageKey) => key === 'glass-processing'
  ? '/images/jobs/job01.png'
  : `/images/job-categories/${key}.jpg`;
const choose = (key: JobImageKey | null, reason: string, evidence: string, status: JobImageDecision['status'] = key ? 'matched' : 'no-reference'): JobImageDecision => ({
  key, image: key ? imagePath(key) : null, status, reason, evidence: evidence.trim().slice(0, 240),
});

export const legacyImageKeys: Record<number, JobImageKey> = {
  1: 'glass-processing', 2: 'forklift-logistics', 3: 'packaging-inspection',
  4: 'packaging-inspection', 5: 'metal-press', 6: 'metal-press', 7: 'automation-plc',
  8: 'cnc-machining', 9: 'cnc-machining', 10: 'factory-assembly',
  11: 'food-filling', 12: 'food-filling', 13: 'food-filling', 14: 'food-filling',
  15: 'welding', 16: 'packaging-inspection',
};
export function legacyJobImage(id: number): string | null {
  const key = legacyImageKeys[id];
  return key ? imagePath(key) : null;
}

// Reviews expire when any role/description field changes in a later import.
export function jobImageFingerprint(category: string, occupation: string, summary: string, details: string): string {
  return createHash('sha256').update(JSON.stringify([category, occupation, summary, details])).digest('hex');
}

/**
 * Resolve the image from a reviewed task or a clear source occupation.
 * Never search the whole advert for a product, qualification or training keyword:
 * those caused repairs to look like packing, software vendors like metal presses,
 * and forklift qualifications to replace the actual primary job.
 */
export function resolveImportedJobImage(category: string, occupation: string, summary: string, details = '', id?: string): JobImageDecision {
  const reviewed = id ? reviews[id] : undefined;
  if (reviewed) {
    if (reviewed.fingerprint !== jobImageFingerprint(category, occupation, summary, details)) {
      return choose(null, '確認後に求人内容が変更されたため画像の再確認が必要', summary, 'needs-review');
    }
    return choose(reviewed.key, reviewed.reason, summary);
  }
  const cat = normalize(category);
  const role = normalize(occupation);
  const pick = (key: JobImageKey | null, reason: string) => choose(key, reason, occupation);
  const pending = () => choose(null, '職種・仕事内容と写真の個別確認が必要', summary, 'needs-review');

  // Broad and missing roles require an explicit decision in the review manifest.
  if (!cat || !role || /その他/.test(role)) return pending();
  if (cat === '営業職') {
    return /コールセンター|カスタマーサポート|アポインター/.test(role)
      ? pick('office-admin', 'コールセンター・顧客対応')
      : pick('sales-proposal', '営業職（商材の業界から画像を選ばない）');
  }
  if (cat === 'ITエンジニア職(SE・システム開発・インフラ)') return pick('it-infrastructure', 'IT開発・運用・保守');
  if (cat === 'クリエイティブ職(ディレクター・デザイナー・ライター・その他)') return pick('creative-design', 'デザイン・映像・制作');
  if (cat === '企画・マーケティング・経営・管理職') return pick('planning-meeting', '企画・マーケティング・経営管理');
  if (cat === '事務・管理部門職') return pick('office-admin', '事務・管理部門（取扱商材や勤務先業界から画像を選ばない）');
  if (cat === '販売・サービス業(小売・外食・専門)') {
    if (/理容|美容|エステ|ネイリスト/.test(role)) return pick('beauty-salon', '美容・サロンの接客・カウンセリング');
    if (/葬祭/.test(role)) return pick('funeral-service', '葬祭の準備・運営・案内');
    if (/ホテル|旅行/.test(role)) return pending();
    if (/販売スタッフ|ホールスタッフ・調理スタッフ|店長・店長候補/.test(role)) return pick('retail-cafe', '販売・接客・飲食サービス');
  }
  if (cat === '専門職・その他(教育・通訳・士業・公務員・コンサルタント)') {
    // Care, nursing and nutrition share one source role; inspect the duties.
    if (role === '士業') return pick('legal-consulting', '士業・専門相談');
  }
  // Manufacturing, transport and construction contain many different processes.
  // New or changed adverts must be reviewed before showing a category photograph.
  return pending();
}

export function importedJobImage(category: string, occupation: string, summary: string, details = '', id?: string): string | null {
  return resolveImportedJobImage(category, occupation, summary, details, id).image;
}
