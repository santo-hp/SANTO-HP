// These photos illustrate job categories; they are not photos of the hiring workplaces.
const image = (name: string) => `/images/job-categories/${name}.jpg`;

const legacyImages: Record<number, string> = {
  1: 'factory-assembly',
  2: 'forklift-logistics',
  3: 'packaging-inspection',
  4: 'packaging-inspection',
  5: 'metal-press',
  6: 'metal-press',
  7: 'automation-plc',
  8: 'cnc-machining',
  9: 'cnc-machining',
  10: 'factory-assembly',
  11: 'food-filling',
  12: 'food-filling',
  13: 'food-filling',
  14: 'food-filling',
  15: 'welding',
  16: 'packaging-inspection',
};

export function legacyJobImage(id: number): string {
  return image(legacyImages[id] || 'factory-assembly');
}

export function importedJobImage(category: string, occupation: string, summary: string): string {
  const firstLine = summary.split(/\r?\n/, 1)[0];
  // Broad "other" roles need the first line of the actual job description to choose a photo.
  const role = /その他|^$/.test(occupation)
    ? `${occupation} ${firstLine}`
    : occupation;

  if (/軽作業・検査・ピッキング/.test(occupation)) {
    return image(/倉庫|ピッキング|仕分け/.test(firstLine) ? 'forklift-logistics' : 'packaging-inspection');
  }
  if (/施工管理・設備保守管理・環境保全/.test(occupation) && /保守|メンテナンス|清掃|点検/.test(firstLine) && !/施工|建築|建設/.test(firstLine)) {
    return image('equipment-maintenance');
  }
  if (/介護|看護|栄養士|教員|講師|インストラクター|教室長|スクール|医療事務/.test(role)) return image('office-admin');
  if (/葬祭/.test(role)) return image('sales-proposal');
  if (/営業事務|営業アシスタント/.test(role)) return image('office-admin');
  if (/マーケティング|リサーチ|商品開発|営業企画|販促企画|経営企画|事業企画|物流企画/.test(role)) return image('planning-meeting');
  if (/フォークリフト|クレーン|運搬|倉庫作業|在庫管理|物流管理|ピッキング|ドライバー/.test(role)) return image('forklift-logistics');
  if (/溶接|鋳造|鍛造/.test(role)) return image('welding');
  if (/プレス|板金/.test(role)) return image('metal-press');
  if (/金型|研磨|切削|機械加工/.test(role)) return image('cnc-machining');
  if (/PLC|シーケンサ|制御設計|組み込み/.test(role)) return image('automation-plc');
  if (/施工管理|建築|土木|測量|積算/.test(role)) return image('construction');
  if (/食品加工|食品製造|調理|製菓/.test(role) && /製造|加工|食品/.test(category + role)) return image('food-filling');
  if (/医薬|化学|研究|分析|実験|品質保証|品質管理/.test(role)) return image('laboratory');
  if (/組み立て|組付け|組立|製造スタッフ|製造オペレーター/.test(role)) return image('factory-assembly');
  if (/検査|検品|梱包|包装|軽作業/.test(role)) return image('packaging-inspection');
  if (/保全|メンテナンス|保守|設備管理|施設管理|清掃|警備|整備/.test(role)) return image('equipment-maintenance');
  if (/回路|半導体|電気|電子/.test(role)) return image('electronics-manufacturing');
  if (/システム|プログラマー|コーダー|ネットワーク|サーバ|インフラ|社内SE|ITエンジニア|テクニカルサポート|ヘルプデスク/.test(role)) return image('it-infrastructure');
  if (/デザイナー|ディレクター|ライター|制作|クリエイティブ/.test(role)) return image('creative-design');
  if (/士業|コンサルタント|法務/.test(role)) return image('legal-consulting');
  if (/営業|セールス|人材コーディネーター|キャリアカウンセラー/.test(role)) return image('sales-proposal');
  if (/販売|ホールスタッフ|店長|ホテル|旅行|美容|エステ|ネイリスト|理容師|葬祭/.test(role)) return image('retail-cafe');
  if (/事務|経理|財務|人事|総務|受付|秘書|コールセンター|カスタマーサポート|アポインター|管理職/.test(role)) return image('office-admin');

  if (/建築|土木/.test(category)) return image('construction');
  if (/ITエンジニア/.test(category)) return image('it-infrastructure');
  if (/クリエイティブ/.test(category)) return image('creative-design');
  if (/医薬|化学|素材/.test(category)) return image('laboratory');
  if (/電気|電子|機械|半導体/.test(category)) return image('electronics-manufacturing');
  if (/運輸|交通|技能工|施設/.test(category)) return image('equipment-maintenance');
  if (/販売|サービス/.test(category)) return image('retail-cafe');
  if (/営業/.test(category)) return image('sales-proposal');
  if (/企画|マーケティング|経営/.test(category)) return image('planning-meeting');
  if (/専門職|コンサルタント/.test(category)) return image('office-admin');
  return image('office-admin');
}
