# プロジェクト固有設定

## プロジェクト概要

大船渡市の事務事業評価シートを可視化したダッシュボードアプリケーションです。約407件の事務事業データをExcelファイルから読み込み、Next.jsで可視化します。

## 開発言語・フレームワーク

- **言語**: TypeScript
- **フレームワーク**: Next.js 16 (App Router)
- **スタイリング**: Tailwind CSS v4
- **デプロイ**: 静的サイト生成（SSG）

## 品質チェックコマンド

### Lint（Biome）

**⚠️ CRITICAL: Lintエラーゼロポリシー**

このプロジェクトでは**Biome**を使用しています（Next.js 16から`next lint`が廃止されたため）。

**すべてのコミット・PR作成前に、Lintエラーをゼロにすることが必須です。**

```bash
# Lintチェック（エラーがあれば失敗）
npm run lint

# 自動修正（safe fixes）
npm run lint:fix

# フォーマット実行
npm run format
```

**Biomeの特徴**:
- Linter + Formatter統合（ESLint + Prettier不要）
- 高速（Rustベース、ESLintより10-100倍高速）
- React/TypeScript/アクセシビリティルール有効化済み

**設定ファイル**: `biome.json`

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

---

## デジタル庁ダッシュボードガイドライン

**参考**: [デジタル庁ダッシュボードデザインガイドライン](https://www.digital.go.jp/)

このプロジェクトではデジタル庁が推奨するダッシュボード設計の原則に従っています。

### 1. グラフ選択の原則

**基本方針**: データの可視化目的に応じて適切なグラフを選択する

| 目的 | 推奨グラフ | 非推奨グラフ | 理由 |
|------|----------|------------|------|
| **構成要素同士の比較** | 棒グラフ（横/縦） | 円グラフ | 項目が多い場合、円グラフは読みにくい |
| **全体に対する割合** | 円グラフ（3〜5項目） | 棒グラフ | 項目が少なければ円グラフが直感的 |
| **時系列の推移** | 折れ線グラフ | 棒グラフ | トレンドの把握が容易 |
| **複数系列の比較** | 積み上げ棒グラフ | 複数の円グラフ | 一つのグラフで全体を把握できる |

**実装例**:
- 政策別予算配分（8項目）: 横棒グラフを採用（`PolicyBudgetChart.tsx`）
- 事業区分別予算配分（5項目）: 横棒グラフを採用（`CategoryChart.tsx`）

### 2. データの冗長性を避ける

**原則**: 同じ情報を複数の形式で重複表示しない

❌ **悪い例**: グラフとテキストリストの両方で同じデータを表示
```tsx
<PolicyBudgetChart data={stats.projectsByPolicy} />
<Card title="政策別事業数・予算">
  {/* グラフと同じデータをリスト形式で表示 */}
</Card>
```

✅ **良い例**: グラフのみで表示し、詳細はアコーディオンで提供
```tsx
<PolicyBudgetChart data={stats.projectsByPolicy} />
<Accordion>
  <SortableStatsTable data={stats.projectsByPolicy} />
</Accordion>
```

### 3. 情報の階層化

**原則**: 重要度に応じて情報を階層化する

```
概要（サマリー）
  ↓
主要な可視化（グラフ）
  ↓
詳細データ（テーブル・必要に応じて展開）
  ↓
アクション（事業一覧へ等）
```

**実装パターン**:
1. **サマリーカード**: 重要指標を2列で表示（総事業数、総予算、政策数、平均予算）
2. **グラフ**: データの比較・傾向を視覚化
3. **詳細テーブル**: アコーディオン形式で展開可能
4. **アクション**: 「事業一覧を見る」ボタン

### 4. インタラクティブ機能

**推奨**: ユーザーが自由にデータを探索できる機能を提供

**実装済み機能**:
- **ソート機能**: テーブルの列ヘッダーをクリックでソート（`SortableStatsTable.tsx`）
- **アコーディオン**: 詳細情報を必要に応じて展開/折りたたみ
- **金額表示モード切替**: 千円表記 ⇔ 日本語表記（`AmountDisplayContext`）
- **フィルター**: URLパラメータ方式でブックマーク・共有可能

### 5. アクセシビリティ

**必須事項**:
- 適切なHTMLタグを使用（`<table>`、`<th>`、`<td>`）
- ARIA属性の設定（`aria-label`、`aria-expanded`）
- キーボード操作対応
- カラーコントラスト比の確保

**実装例**:
```tsx
// ソート可能なテーブル
<table>
  <caption className="sr-only">政策別事業数・予算の詳細テーブル</caption>
  <thead>
    <tr>
      <th scope="col" onClick={handleSort}>
        名称 <SortIndicator />
      </th>
    </tr>
  </thead>
</table>

// アコーディオンボタン
<button aria-expanded={showDetails}>
  詳細を表示
</button>
```

### 6. レスポンシブデザイン

**原則**: モバイル・タブレット・デスクトップで最適な表示

**グリッドレイアウト**:
```tsx
// サマリーカード: モバイル1列、タブレット以上2列
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

// グラフ: 動的な高さ計算
const chartHeight = Math.max(400, data.length * 50);
```

### 7. パフォーマンス最適化

**推奨事項**:
- グラフの高さを動的に計算（項目数に応じて調整）
- 大量データの場合はページネーション
- useMemoで重い計算をメモ化

**実装例**:
```tsx
// 動的な高さ計算
const chartHeight = Math.max(400, chartData.length * 50);

// メモ化
const filteredProjects = useMemo(() => {
  return projects.filter(/* ... */);
}, [projects, filters]);
```

### 8. データ可視化のベストプラクティス

**グラフ設計**:
- **ソート**: 予算降順でソート（重要なデータが上に）
- **ツールチップ**: ホバー時に詳細情報を表示
- **レジェンド**: グラフの下部に配置
- **軸ラベル**: 金額は省略表記（`formatAmountShort`）
- **カラー**: 単色または一貫したカラーパレット

**実装パターン**:
```tsx
<BarChart data={chartData} layout="vertical">
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis type="number" tickFormatter={(value) => formatAmountShort(value, mode)} />
  <YAxis type="category" dataKey="name" width={240} />
  <Tooltip content={<CustomBarTooltip />} />
  <Bar dataKey="value" fill="#3b82f6" />
</BarChart>
```

---

## 参考リンク

- **デジタル庁ダッシュボードガイドライン**: https://www.digital.go.jp/
- **Recharts公式ドキュメント**: https://recharts.org/
- **WAI-ARIA**: https://www.w3.org/WAI/ARIA/
