// node scripts/audit-job-images.mjs [--baseline old-job-images.ts] [--server http://127.0.0.1:3000]
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = file => JSON.parse(readFileSync(path.join(root, file), 'utf8'));
const option = name => {
  const index = process.argv.indexOf(name);
  return index < 0 ? undefined : process.argv[index + 1];
};
function loadTs(filename) {
  const file = path.resolve(root, filename);
  const compiled = { exports: {} };
  const code = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  new Function('require', 'module', 'exports', code)(createRequire(file), compiled, compiled.exports);
  return compiled.exports;
}
const images = loadTs('src/lib/job-images.ts');
const { JOB_IDS } = loadTs('src/lib/jobs.ts');
const source = read('data/imported-jobs.json').records;
const reviews = read('src/data/job-image-reviews.json');
const messages = read('messages/ja.json');
const sourceById = new Map(source.map(row => [row['求人ID'], row]));
assert.equal(sourceById.size, source.length, 'Duplicate imported IDs');
const args = row => [row['職種'], row['職種名'], row['業務内容(概要)'], row['業務内容'], row['求人ID']];
for (const [id, review] of Object.entries(reviews)) {
  const row = sourceById.get(id);
  assert(row, `Review references removed job ${id}`);
  assert.equal(review.fingerprint, images.jobImageFingerprint(...args(row)), `Stale review ${id}`);
  assert(review.key && Object.hasOwn(images.JOB_IMAGES, review.key), `Missing or unknown photo ${id}`);
  assert(review.reason.trim(), `Missing review reason ${id}`);
}

// Real regressions: duties differ from category, product, training, or qualifications.
const examples = {
  112057: 'office-admin', 15553: 'office-admin', 134807: 'it-infrastructure',
  110096: 'equipment-maintenance', 125652: 'equipment-maintenance',
  132503: 'office-admin', 102245: 'equipment-maintenance',
  132529: 'factory-assembly', 118481: 'packaging-inspection',
  113523: 'factory-assembly', 118731: 'factory-assembly',
  69317: 'equipment-maintenance', 69782: 'equipment-maintenance',
  116010: 'manufacturing-general', 118709: 'manufacturing-general',
  126787: 'manufacturing-general', 118475: 'warehouse-handling',
  118518: 'food-filling', 118520: 'food-filling',
  30350: 'laboratory', 15148: 'office-admin', 118495: 'laboratory',
  94746: 'laboratory', 124546: 'office-admin', 66024: 'automation-plc',
  103789: 'construction', 36606: 'construction', 42131: 'construction',
  102250: 'sales-proposal', 15530: 'planning-meeting',
  86407: 'kitchen-nutrition', 76578: 'healthcare-rehabilitation', 47018: 'legal-consulting',
  135259: 'reception-service', 69276: 'vehicle-maintenance', 137394: 'driving-transport',
  36395: 'warehouse-handling', 41760: 'cleaning-sanitation', 30632: 'security-patrol',
  32672: 'field-maintenance', 16974: 'healthcare-rehabilitation', 121284: 'care-support',
  16336: 'beauty-salon', 48669: 'kitchen-nutrition', 35941: 'funeral-service',
  // Final semantic review: source role labels can disagree with the actual duties.
  74293: 'office-admin', 74295: 'office-admin', 72582: 'office-admin',
  15232: 'it-infrastructure', 33609: 'it-infrastructure', 137726: 'it-infrastructure',
  99167: 'creative-design', 76602: 'creative-design', 122118: 'creative-design',
  61533: 'planning-meeting', 61534: 'planning-meeting', 74294: 'planning-meeting',
  131347: 'planning-meeting', 131971: 'reception-service', 128306: 'reception-service',
  132161: 'office-admin', 93555: 'office-admin', 98408: 'office-admin',
  48638: 'kitchen-nutrition', 107108: 'kitchen-nutrition', 74109: 'retail-cafe',
  79101: 'healthcare-rehabilitation', 98378: 'healthcare-rehabilitation',
  110203: 'construction', 52866: 'construction', 29793: 'construction',
  116315: 'sales-proposal', 130556: 'sales-proposal', 117984: 'office-admin',
  119916: 'driving-transport', 75567: 'office-admin', 95150: 'electronics-manufacturing',
};
for (const [id, key] of Object.entries(examples)) {
  assert.equal(images.resolveImportedJobImage(...args(sourceById.get(id))).key, key, `Wrong task photo: ${id}`);
}
const reviewedRow = sourceById.get('134807');
const changedArgs = args(reviewedRow);
changedArgs[3] += '\n変更された仕事内容';
assert.equal(images.resolveImportedJobImage(...changedArgs).status, 'needs-review');
assert.equal(images.resolveImportedJobImage(...changedArgs).image, null);
assert.equal(images.resolveImportedJobImage('運輸・交通・技能工・施設/設備管理職', 'その他', '資格：フォークリフト、溶接、PLC').image, null);
assert.equal(images.resolveImportedJobImage('未登録の職種', '', '製造').status, 'needs-review');
assert.equal(images.legacyJobImage(9999), null);
assert.equal(images.legacyJobImage(1), '/images/jobs/job01.png');
assert.equal(images.legacyJobImage(9), '/images/job-categories/cnc-machining.jpg');

const rows = JOB_IDS.map(id => ({
  id, category: '既存求人', occupation: messages.JobDetail[`job${id}Category`],
  summary: messages.JobDetail[`job${id}Description`], key: images.legacyImageKeys[Number(id)],
  image: images.legacyJobImage(Number(id)), status: 'matched', reason: '既存求人の仕事内容を個別確認',
}));
for (const row of source) {
  const decision = images.resolveImportedJobImage(...args(row));
  // This is the same explicit per-job photo precedence used by job-catalog.ts.
  const photo = ['webp', 'jpg', 'jpeg', 'png'].map(ext => `/images/jobs/${row['求人ID']}.${ext}`)
    .find(file => existsSync(path.join(root, 'public', file)));
  rows.push({ id: row['求人ID'], category: row['職種'] || '職種未登録', occupation: row['職種名'],
    summary: row['業務内容(概要)'], ...decision,
    ...(photo ? { image: photo, status: 'needs-review', reason: '求人別写真の目視確認が必要' } : {}),
  });
}
assert.equal(new Set(rows.map(row => row.id)).size, rows.length, 'Duplicate catalog IDs');
for (const row of rows) {
  assert.equal(row.status, 'matched', `Unreviewed or unpictured job ${row.id}: ${row.reason}`);
  assert(row.image, `Every job must have a reference image: ${row.id}`);
  assert(existsSync(path.join(root, 'public', row.image)), `Missing image ${row.id}`);
}

const baseline = option('--baseline') ? loadTs(option('--baseline')) : null;
let changed = 0;
if (baseline) for (const row of rows) {
  const imported = sourceById.get(row.id);
  row.previousImage = imported ? baseline.importedJobImage(...args(imported)) : baseline.legacyJobImage(Number(row.id));
  row.changed = row.previousImage !== row.image;
  if (row.changed) changed++;
}
const counts = Object.fromEntries(Object.entries(images.JOB_IMAGES).map(([key, label]) => [key, {
  label, count: rows.filter(row => row.key === key).length,
  image: key === 'glass-processing' ? '/images/jobs/job01.png' : `/images/job-categories/${key}.jpg`,
}]));
const summary = {
  total: rows.length, imported: source.length, legacy: JOB_IDS.length,
  classifiedRoles: new Set(source.map(row => JSON.stringify([row['職種'], row['職種名']]))).size,
  individualReviews: Object.keys(reviews).length,
  matched: rows.filter(row => row.status === 'matched').length,
  noReference: rows.filter(row => row.status === 'no-reference').length,
  needsReview: 0, ...(baseline ? { changed } : {}),
};
const reportDir = path.join(root, 'reports');
mkdirSync(reportDir, { recursive: true });
const csvCell = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
const csv = [['求人ID', '職種', '職種名', '仕事内容概要', '画像分類', '画像パス', '確認結果', '選定理由', ...(baseline ? ['前の画像', '変更'] : [])],
  ...rows.map(row => [row.id, row.category, row.occupation, row.summary, images.JOB_IMAGES[row.key] || '該当写真なし', row.image,
    row.status, row.reason, ...(baseline ? [row.previousImage, row.changed ? '変更あり' : ''] : [])])];
writeFileSync(path.join(reportDir, 'job-image-audit.csv'), '\ufeff' + csv.map(row => row.map(csvCell).join(',')).join('\r\n'));
const safeJson = value => JSON.stringify(value).replaceAll('<', '\\u003c');
writeFileSync(path.join(reportDir, 'job-image-audit.html'), String.raw`<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>求人画像の全件確認</title>
<style>body{font:15px/1.6 system-ui,sans-serif;background:#f6f8fb;color:#203348;margin:24px auto;max-width:1440px;padding:0 20px}h1{margin-bottom:4px}select,input,button{padding:10px;border:1px solid #cad4df;border-radius:6px;background:white}input{min-width:260px}.filters{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0}table{width:100%;border-collapse:collapse;background:white}td,th{padding:12px;text-align:left;border-bottom:1px solid #e1e7ee;vertical-align:top}td:nth-child(3){max-width:420px;white-space:pre-wrap}img{width:160px;aspect-ratio:16/9;object-fit:cover;border-radius:5px}.note{color:#596b80}#gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:16px}figure{margin:0}figure img{width:100%}figcaption{font-size:13px}.table-scroll{overflow:auto}nav{display:flex;gap:12px;align-items:center;margin:18px 0}</style>
<h1>求人画像の全件確認</h1><p>${summary.total.toLocaleString()}件 / 画像あり ${summary.matched.toLocaleString()}件 / 該当写真なし ${summary.noReference}件${baseline ? ` / 画像変更 ${changed}件` : ''}</p>
<p class="note">職種・職種名・仕事内容を照合し、全求人に参考画像を設定しています。個別工程が不明な製造職は工場作業の共通画像を使用。画像は職種のイメージで、掲載先企業や実際の勤務地を示すものではありません。</p>
<details><summary>使用画像と件数（${Object.keys(counts).length}種類）</summary><div id="gallery"></div></details>
<div class="filters"><input id="search" aria-label="検索" placeholder="求人ID・職種・仕事内容で検索"><select id="category" aria-label="職種"><option value="">全職種</option></select><select id="photo" aria-label="画像"><option value="">全画像</option><option value="none">該当写真なし</option></select><label><input type="checkbox" id="changed" style="min-width:0">変更分のみ</label></div>
<p id="count"></p><div class="table-scroll"><table><thead><tr><th>ID</th><th>職種</th><th>仕事内容</th><th>画像</th><th>選定理由</th></tr></thead><tbody id="body"></tbody></table></div><nav><button id="prev">前へ</button><span id="page"></span><button id="next">次へ</button></nav>
<script>const rows=${safeJson(rows.map(({ id, category, occupation, summary, key, image, reason, changed }) => ({ id, category, occupation, summary, key, image, reason, changed })))};const photos=${safeJson(counts)};
const el=id=>document.getElementById(id);let page=0;const size=50;
const option=(parent,value,label)=>{const x=document.createElement('option');x.value=value;x.textContent=label;parent.append(x)};
for(const category of [...new Set(rows.map(x=>x.category))])option(el('category'),category,category);
for(const [key,p] of Object.entries(photos)){option(el('photo'),key,p.label+'（'+p.count+'件）');const f=document.createElement('figure'),i=document.createElement('img'),c=document.createElement('figcaption');i.src='../public'+p.image;i.loading='lazy';i.alt=p.label;c.textContent=p.label+' / '+p.count+'件';f.append(i,c);el('gallery').append(f)}
function render(){const q=el('search').value.toLowerCase(),category=el('category').value,photo=el('photo').value;const matches=rows.filter(x=>(!category||x.category===category)&&(!photo||(photo==='none'?!x.image:x.key===photo))&&(!el('changed').checked||x.changed)&&(!q||[x.id,x.category,x.occupation,x.summary,x.reason].join(' ').toLowerCase().includes(q)));const pages=Math.max(1,Math.ceil(matches.length/size));page=Math.min(page,pages-1);el('body').replaceChildren();el('count').textContent=matches.length+'件';el('page').textContent=(page+1)+' / '+pages;el('prev').disabled=page===0;el('next').disabled=page>=pages-1;for(const x of matches.slice(page*size,(page+1)*size)){const tr=document.createElement('tr');for(const value of [x.id,x.category+'\n'+x.occupation,x.summary,null,x.reason]){const td=document.createElement('td');if(value===null){if(x.image){const img=document.createElement('img');img.src='../public'+x.image;img.alt=photos[x.key]?.label||'';img.loading='lazy';td.append(img,document.createElement('br'),document.createTextNode(photos[x.key]?.label||''))}else td.textContent='該当写真なし'}else td.textContent=value;tr.append(td)}el('body').append(tr)}}
for(const id of ['search','category','photo','changed'])el(id).addEventListener('input',()=>{page=0;render()});el('prev').onclick=()=>{page--;render()};el('next').onclick=()=>{page++;render()};render();</script></html>`);

const server = option('--server');
if (server) {
  const expected = new Map(rows.map(row => [Number(row.id), row.image]));
  const seen = new Set();
  const pages = Array.from({ length: Math.ceil(rows.length / 20) }, (_, i) => i + 1);
  let cursor = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (cursor < pages.length) {
      const response = await fetch(`${server}/api/jobs/?locale=ja&page=${pages[cursor++]}`);
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.equal(result.total, rows.length);
      for (const job of result.jobs) {
        assert.equal(job.image, expected.get(job.id), `Rendered list photo ${job.id}`);
        assert(!seen.has(job.id), `Repeated API job ${job.id}`);
        seen.add(job.id);
      }
    }
  }));
  assert.equal(seen.size, rows.length, 'Full list API coverage');
  const detailIds = ['1', '9', '134807', '110096', '118495', '116010', '69276', '137394', '118475',
    '41760', '30632', '32672', '16974', '121284', '16336', '48669', '135259', '35941', '47018'];
  for (const id of detailIds) {
    const response = await fetch(`${server}/ja/jobs/${id}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    const photo = expected.get(Number(id));
    if (photo) assert(html.includes(`src="${photo}"`), `Detail photo ${id}`);
    else assert(!/<img[^>]+src="\/images\/(job-categories|jobs)\//.test(html), `Unexpected detail photo ${id}`);
  }
  for (const { image } of Object.values(counts)) {
    const response = await fetch(server + image);
    assert.equal(response.status, 200, `Asset request ${image}`);
    assert(response.headers.get('content-type')?.startsWith('image/'), `Asset type ${image}`);
  }
  console.log(`PASS: all ${seen.size} list API images, ${detailIds.length} representative details, ${Object.keys(counts).length} image assets`);
}
console.log(JSON.stringify(summary, null, 2));
console.log('PASS: source coverage, fingerprints, assets, regression cases; reports/job-image-audit.{csv,html}');
