# 大船渡市 事務事業評価シート ダッシュボード

大船渡市の事務事業評価シートを可視化したダッシュボードアプリケーションです。

## 概要

このアプリケーションは、大船渡市の約407件の事務事業に関する評価シートデータを、分かりやすく可視化して表示します。

### 主な機能

- **概要ダッシュボード**: 総事業数、総予算、政策別・事業区分別の統計情報を表示
- **事業一覧**: 全事業をテーブル形式で表示
- **事業詳細**: 各事業の基本情報、概要、財政データ、評価情報を表示

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **デプロイ**: 静的エクスポート (SSG)

## セットアップ

### 必要な環境

- Node.js 18以降
- npm または pnpm

### インストール

```bash
# 依存関係のインストール
npm install

# Excelファイルからデータを変換
npm run convert-data

# 開発サーバーの起動
npm run dev
```

開発サーバーが起動したら、ブラウザで `http://localhost:3000` にアクセスしてください。

## データ更新方法

事務事業評価シートのExcelファイル（`report.xlsx`）を更新した後、以下のコマンドでJSONデータを再生成してください。

```bash
npm run convert-data
```

## ビルド

静的サイトとしてビルドするには、以下のコマンドを実行してください。

```bash
npm run build
```

ビルド成果物は `out/` ディレクトリに生成されます。

## デプロイ

### Vercel

1. GitHubリポジトリをVercelにインポート
2. ビルドコマンド: `npm run build`
3. 出力ディレクトリ: `out`

### GitHub Pages

1. `out/` ディレクトリの内容をGitHub Pagesにデプロイ

## プロジェクト構成

```
ofunato-transparency-report/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # トップページ
│   ├── globals.css        # グローバルスタイル
│   └── projects/          # 事業関連ページ
│       ├── page.tsx       # 事業一覧
│       └── [id]/page.tsx  # 事業詳細
├── components/            # Reactコンポーネント
│   ├── ui/               # UIコンポーネント
│   └── layout/           # レイアウトコンポーネント
├── lib/                  # ユーティリティ関数
│   ├── data.ts          # データアクセス
│   └── utils.ts         # 汎用ユーティリティ
├── types/               # TypeScript型定義
│   └── index.ts
├── scripts/             # データ変換スクリプト
│   └── convert-excel.ts
├── data/                # JSONデータ（ビルド成果物）
│   └── projects.json
└── report.xlsx          # 元データ（Excelファイル）
```

## スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番用ビルドを実行 |
| `npm run start` | 本番サーバーを起動 |
| `npm run lint` | ESLintを実行 |
| `npm run type-check` | TypeScriptの型チェックを実行 |
| `npm run convert-data` | Excel→JSON変換を実行 |

## ライセンス

ISC

## お問い合わせ

大船渡市に関するお問い合わせは、大船渡市の公式サイトをご覧ください。
