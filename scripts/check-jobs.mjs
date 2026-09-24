// Run against a running Next.js server: node scripts/check-jobs.mjs [base-url]
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const base = process.argv[2] || 'http://127.0.0.1:3000';
const source = JSON.parse(await readFile(new URL('../data/imported-jobs.json', import.meta.url), 'utf8'));
const records = source.records;
const ids = records.map(row => row['求人ID']);
assert.equal(new Set(ids).size, records.length, 'Duplicate job IDs');
assert.equal(source.headers.length, 57);
assert(records.every(row => Object.keys(row).length === source.headers.length));
async function query(params = {}) {
  const res = await fetch(`${base}/api/jobs/?${new URLSearchParams(params)}`);
  assert.equal(res.status, 200);
  return res.json();
}
const first = await query();
assert.equal(first.total, records.length + 16);
assert.equal(first.jobs.length, 20);
assert.equal(first.pages, Math.ceil(first.total / 20));
const second = await query({ page: '2' });
assert(second.jobs.every(job => !first.jobs.some(other => other.id === job.id)));
const last = await query({ page: '999999' });
assert.equal(last.page, first.pages);
assert.equal(last.jobs.at(-1).id, Number(ids.at(-1)));
for (const [employment, label] of [['fulltime', '正社員'], ['contract', '契約社員'], ['newgrad', '新卒'], ['outsourcing', '業務委託'], ['other', 'その他']]) {
  assert.equal((await query({ employment })).total, records.filter(row => row['雇用形態'] === label).length);
}
assert.equal((await query({ features: 'dormitory' })).total, records.filter(row => row['寮'] === '有').length + 1);
const category = records[0]['職種'];
const prefecture = records[0]['エリア名（都道府県）'];
assert.equal((await query({ area: `pref:${prefecture}`, jobType: `category:${category}` })).total,
  records.filter(row => row['職種'] === category && row['エリア名（都道府県）'] === prefecture).length);
assert.equal((await query({ favorites: '1', ids: ids.slice(0, 2).join(',') })).total, 2);
assert.equal((await query({ favorites: '1', ids: '' })).total, 0);
assert.equal((await query({ q: 'no-matching-job-xyz-987654321' })).total, 0);
const find = await query({ q: ids[0] });
assert(find.jobs.some(job => String(job.id) === ids[0]));
assert(!('fields' in find.jobs[0]), 'List API must not expose the entire detail record');
for (const route of [`/ja/jobs/${ids[0]}/`, `/ja/jobs/${ids.at(-1)}/`, `/ja/jobs/${ids[0]}/apply/`, `/en/jobs/${ids[0]}/`, '/ja/jobs/1/']) {
  const response = await fetch(base + route);
  assert.equal(response.status, 200, route);
  assert(!(await response.text()).includes(`Jobs.job${ids[0]}Title`), 'Missing translation fallback');
}
assert.equal((await fetch(`${base}/ja/jobs/999999999/`)).status, 404);
console.log(`PASS: ${records.length} imported jobs / ${source.headers.length} columns; pagination, filters, favorites, detail, application, locales, 404`);
