# 株式会社サントー コーポレートサイト

人材派遣会社「株式会社サントー」のコーポレートサイトです。

---

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | **Next.js 16** (App Router / Node.jsサーバー) |
| スタイリング | **Tailwind CSS v4** |
| UIコンポーネント | **shadcn/ui v4** (base-ui ベース) |
| フォント | **Zen Kaku Gothic New** (角ばったゴシック体) + **Inter** |
| アイコン | **Lucide React** |
| 言語 | **TypeScript** |

---

## ページ構成

| ページ | パス | ファイル |
|--------|------|----------|
| トップページ | `/` | `src/app/page.tsx` |
| 会社概要 | `/about` | `src/app/about/page.tsx` |
| 仕事をお探しの方 | `/jobseekers` | `src/app/jobseekers/page.tsx` |
| 企業様へ | `/employers` | `src/app/employers/page.tsx` |
| アクセス | `/access` | `src/app/access/page.tsx` |
| お問い合わせ | `/contact` | `src/app/contact/page.tsx` |
| English | `/en` | `src/app/en/page.tsx` |
| Português | `/pt` | `src/app/pt/page.tsx` |
| Español | `/es` | `src/app/es/page.tsx` |

---

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx          ← ルートレイアウト（フォント・Header・Footer）
│   ├── globals.css         ← Tailwind設定・カラー変数・カスタムテーマ
│   ├── page.tsx            ← トップページ
│   ├── about/page.tsx
│   ├── jobseekers/page.tsx
│   ├── employers/page.tsx
│   ├── access/page.tsx
│   ├── contact/page.tsx    ← お問い合わせフォーム（use client）
│   ├── en/page.tsx
│   ├── pt/page.tsx
│   └── es/page.tsx
├── components/
│   ├── Header.tsx          ← ヘッダー（2段構成・モバイルSheet対応）
│   ├── Footer.tsx          ← フッター
│   ├── PageHeader.tsx      ← サブページ共通ヘッダー
│   ├── LinkButton.tsx      ← Server Component対応のボタンリンク
│   └── ui/                 ← shadcn/ui コンポーネント群
└── lib/
    └── utils.ts            ← cn() ユーティリティ
```

---

## カラーパレット

| 名前 | 値 | 用途 |
|------|-----|------|
| `santo-navy` | `#0F2B4A` | メインカラー（ヘッダー・ヒーロー・CTA背景） |
| `santo-blue` | `#1A4F8B` | セカンダリ（ホバー・見出しアクセント） |
| `santo-light` | `#2D7DD2` | アクセント（英字ラベル・アイコン） |
| `santo-accent` | `#4A9EED` | ハイライト（PICK UPラベル・CTA内ラベル） |
| `santo-sky` | `#E8F2FC` | ライトブルー背景（メリット・ホバー） |
| `santo-gray` | `#F4F6F9` | セクション背景（交互に使用） |

`globals.css` の `@theme inline` ブロック内で定義。変更はここだけでOK。

---

## セットアップ

```bash
# 依存パッケージインストール
npm install

# 開発サーバー起動
npm run dev
# → http://localhost:3000

# ビルド
npm run build

# 本番起動
npm start
```

---

## デザインルール

### フォント
- **見出し**: `font-black`（weight 900）+ `tracking-wider`
- **英字ラベル**: `text-[11px] font-black tracking-[0.25em]` + `text-santo-light`
- **本文**: `text-[13px]` または `text-[15px]` + `leading-[1.9]`〜`leading-[2.2]`

### レイアウト
- **最大幅**: `max-w-7xl`（1280px）
- **セクション間隔**: `py-20 sm:py-28`
- **角丸**: `rounded`（0.375rem）— シャープな印象
- **ボーダー**: 1pxの`border-slate-200`、アクセントは`border-l-2`

### セクション見出しパターン
```tsx
<p className="mb-2 text-[11px] font-black tracking-[0.25em] text-santo-light">
  ENGLISH LABEL
</p>
<h2 className="mb-10 text-2xl font-black tracking-wider text-slate-900">
  日本語見出し
</h2>
```

---

## 重要な注意点

### shadcn/ui v4 の仕様
- **base-ui ベース**（Radix UIではない）
- `Button` に `asChild` プロップは**存在しない**
- 代わりに `render` プロップを使用（例: `SheetTrigger`）
- Server Component から `buttonVariants` を直接呼べない → `LinkButton` コンポーネントで対応

### LinkButton コンポーネント
Server Component から使えるボタン型リンク。`buttonVariants` のclient制約を回避。
```tsx
<LinkButton href="/contact" size="xl" className="bg-white text-santo-navy">
  お問い合わせ
</LinkButton>
```

### Accordion
- `type="single"` / `collapsible` プロップは**不要**（base-uiのデフォルト動作）
- `value` プロップも不要

---

## TODO（引き継ぎ事項）

### 必須対応
- [ ] ロゴ画像の差し替え（現在はテキスト「S」で代用）
- [ ] 電話番号の差し替え（現在 `000-000-0000`）
- [ ] 住所・所在地の差し替え
- [ ] 代表者名の差し替え
- [ ] 会社情報（設立年、資本金、許可番号 等）の差し替え
- [ ] 代表写真の配置
- [ ] Google Maps の埋め込み（`/access` ページ）
- [ ] おすすめランキングリンク先URL設定
- [ ] 労働者派遣事業情報公開リンク先URL設定
- [ ] お問い合わせフォームのバックエンド実装（現在はフロントのみ）
- [ ] プライバシーポリシーページ作成

### 任意対応
- [ ] OGP画像の設定
- [ ] favicon の差し替え
- [ ] Google Analytics の設定
- [ ] 多言語ページの翻訳テキスト精査（クライアント確認）
- [ ] お知らせのCMS化（microCMS等）
- [ ] メタデータの精査・SEO対策

---

## デプロイ

Vercel 推奨:
```bash
npx vercel
```

求人検索はサーバーで実行するため、Node.js実行環境で `npm run build` → `npm start` を使用してください。
静的エクスポート（`output: 'export'`）には対応していません。

Excel求人の更新・写真追加の手順は [data/README.md](data/README.md) を参照してください。
