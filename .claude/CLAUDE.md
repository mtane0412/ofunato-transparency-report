# プロジェクト固有設定

## プロジェクト概要

大船渡市の事務事業評価シートを可視化したダッシュボードアプリケーションです。約407件の事務事業データをExcelファイルから読み込み、Next.jsで可視化します。

## 開発言語・フレームワーク

- **言語**: TypeScript
- **フレームワーク**: Next.js 16 (App Router)
- **スタイリング**: Tailwind CSS v4
- **デプロイ**: 静的サイト生成（SSG）

## 品質チェックコマンド

### Lint

```bash
npm run lint
```

**注意**: 現在の環境では`npm run lint`がESLint設定の問題でエラーになる場合があります。その場合は型チェックとビルドで品質を保証してください。

### 型チェック

```bash
npm run type-check
```

### ビルド

```bash
npm run build
```

### テスト

```bash
npm test
```

## テスト環境

- **フレームワーク**: Vitest + React Testing Library + jsdom
- **設定ファイル**: `vitest.config.ts`, `vitest.setup.ts`
- **実行コマンド**: `npm test`（全テスト）、`npm run test:watch`（watch mode）

## 開発ワークフロー

### データ更新

事務事業評価シートのExcelファイル（`report.xlsx`）を更新した後、以下のコマンドを実行してください：

```bash
npm run convert-data
```

これにより、`data/projects.json` が再生成されます。

#### Excelファイル構造の注意点

- JavaScriptの配列インデックスは0始まり（A列=0, B列=1, ...）
- Excel列名との対応: `row[52]` = BB列, `row[53]` = BC列
- Excelデータの即座確認: `npx tsx -e "import XLSX from 'xlsx'; ..."`
- データ変換後の検証: `npm run convert-data && cat data/projects.json | jq '.projects[] | select(.id == "xxxx")'`

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスして確認できます。

## プロジェクト構成

```
ofunato-transparency-report/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # トップページ（概要ダッシュボード）
│   ├── globals.css        # グローバルスタイル
│   └── projects/          # 事業関連ページ
│       ├── page.tsx       # 事業一覧
│       └── [id]/page.tsx  # 事業詳細
├── components/            # Reactコンポーネント
│   ├── ui/               # UIコンポーネント（Card等）
│   └── layout/           # レイアウトコンポーネント（Header、Footer）
├── lib/                  # ユーティリティ関数
│   ├── data.ts          # データアクセス関数
│   └── utils.ts         # 汎用ユーティリティ
├── types/               # TypeScript型定義
│   └── index.ts        # プロジェクト全体の型定義
├── scripts/             # データ変換スクリプト
│   └── convert-excel.ts # Excel→JSON変換
├── data/                # JSONデータ（ビルド成果物）
│   └── projects.json   # 変換済みデータ
└── report.xlsx          # 元データ（Excelファイル）
```

## データ構造

### Project型

主要な型定義は `types/index.ts` を参照してください。

- **基本情報**: ID、名称、年度、作成日
- **政策階層**: 政策、施策、基本事業
- **組織情報**: 部課名、課長名、係名、担当者
- **事業情報**: 事業区分、期間、概要、対象、意図、結果
- **財政データ**: 6年分の財政情報（国庫支出金、一般財源、トータルコスト等）
- **指標データ**: 6年分の指標データ（活動指標、対象指標、成果指標）
- **評価情報**: 改革改善の方向性、今後の方向性、評価コメント

## 実装パターン

### Client ComponentでuseSearchParams使用時（SSG対応）

```tsx
// ❌ 悪い例（prerenderエラー）
export default function Page() {
  const searchParams = useSearchParams();
  // ...
}

// ✅ 良い例（Suspenseでラップ）
function PageContent() {
  const searchParams = useSearchParams();
  // ...
}

export default function Page() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <PageContent />
    </Suspense>
  );
}
```

### フィルター機能のパフォーマンス最適化

- URLパラメータでフィルター状態を管理（ブックマーク・共有可能）
- `useMemo`で件数計算をメモ化（407件のデータで体感遅延なし）
- カスケードフィルター実装時は、上位フィルター変更で下位フィルターをリセット

### TypeScriptの型安全なオブジェクト操作

```typescript
// ❌ delete演算子は型エラーになる可能性
const filters = { ...currentFilters };
delete filters.policy; // エラー: The operand of a 'delete' operator must be optional

// ✅ 分割代入で新オブジェクトを作成
const { policy: _p, ...filtersWithoutPolicy } = currentFilters;
```

## 注意事項

### ダークモード

このプロジェクトではダークモード対応を行っていません。常に明るい背景で表示されます。

### データファイル

- `report.xlsx` はGitにコミットされています（データソースとして必要）
- `data/projects.json` は `.gitignore` に追加せず、ビルド成果物としてコミットしています（SSGのため）

## 実装済み機能

1. **フィルター機能**: 政策・施策・基本事業・部署・事業区分でのフィルタリング
   - URLパラメータ方式（ブックマーク・共有可能）
   - カスケードフィルター（政策→施策→基本事業の階層連動）
   - 件数表示と0件選択肢の無効化

## 今後の拡張候補

1. **ページネーション**: 事業一覧の表示件数制限
2. **グラフ表示**: Rechartsを使用した財政データの可視化
3. **検索機能**: キーワードによる全文検索
4. **予算分析ページ**: 政策別・施策別の予算配分分析
5. **エクスポート機能**: フィルター結果のCSV/Excel出力
