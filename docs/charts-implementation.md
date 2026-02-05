# グラフ機能実装計画

## 概要

Recharts（v3.7.0）を使用して、事業詳細ページ・トップページ・新規予算分析ページにグラフを追加します。

## 実装フェーズ

### Phase 1: 共通基盤 + 事業詳細ページ（4グラフ）✅ 完了

#### 実装内容

**共通基盤:**
- `lib/chart-data.ts` - グラフ用データ変換関数
  - `formatFiscalYear()` - 年度フォーマット（5 → "R5"）
  - `toGrandTotalChartData()` - トータルコスト推移用
  - `toRevenueSourceChartData()` - 財源構成用
  - `toCostBreakdownChartData()` - 事業費vs人件費用
  - `toIndicatorChartData()` - 指標データ用
  - `hasValidIndicatorData()` - 指標データ存在判定
- `lib/chart-constants.ts` - カラーパレット定数
- `lib/utils.ts` - `formatAmountShort()` 追加（Y軸用）

**共通コンポーネント:**
- `components/charts/ChartContainer.tsx` - ResponsiveContainer + Card ラッパー
- `components/charts/CustomTooltip.tsx` - AmountDisplayContext連動ツールチップ

**事業詳細ページのグラフ（4種）:**

| グラフ | コンポーネント | 種類 | データソース |
|---|---|---|---|
| トータルコスト推移 | `YearlyFinancialChart.tsx` | BarChart | `project.financials` |
| 財源構成 | `RevenueSourceChart.tsx` | Stacked BarChart | `project.financials` |
| 事業費vs人件費 | `CostBreakdownChart.tsx` | Stacked BarChart | `project.financials` |
| 指標推移 | `IndicatorChart.tsx` | LineChart | `project.indicators` |

**統合先:** `components/projects/ProjectDetailContent.tsx`
- 財政データカードの下にグラフセクションを追加
- `hasValidIndicatorData()`で有効データがある指標のみ表示
- `formatIndicatorLabel()`で名称・単位を適切に表示

#### アーキテクチャ方針

**SSG対応:**
- グラフコンポーネントは全て `'use client'` で実装
- Server Componentでデータ取得 → propsでClient Componentに渡す

**AmountDisplayContext連携:**
- ツールチップ: `useAmountDisplay()` + `formatAmount()` でフルフォーマット表示
- Y軸: `formatAmountShort()` で省略表記（japaneseモード時は「1.3億」「3,000万」）
- thousandモード時はY軸も `formatAmount()` をそのまま使用

**レスポンシブ対応:**
- `ResponsiveContainer` width=100%
- 棒グラフ高さ: 300px、折れ線: 250px
- 凡例はグラフ下部配置

**テスト方針:**
- データ変換関数: 純粋関数の単体テスト
- グラフコンポーネント: スモークテスト（レンダリングエラーなし + 空データフォールバック）

#### 実装結果

- 型チェック: ✅ 成功
- テスト: ✅ 135個すべて成功
- ビルド: ✅ 411ページ生成成功

---

### Phase 2: トップページのグラフ化（未実装）

#### 計画内容

**データアクセス層の拡張:**
- `lib/chart-data.ts` に追加:
  - `aggregateBudgetByPolicy(projects)` - 政策別予算合計
  - `aggregateBudgetByCategory(projects)` - 事業区分別予算合計
- `types/index.ts` の `DatasetStats` 型を拡張（予算合計フィールド追加）
- `lib/data.ts` の `getDatasetStats()` を拡張

**新規コンポーネント:**
- `components/charts/PolicyBudgetChart.tsx` - 政策別予算配分（横棒グラフ）
- `components/charts/CategoryChart.tsx` - 事業区分別の棒グラフ

**統合先:** `components/home/HomeContent.tsx`
- 政策別事業数セクションにグラフを追加（テキストリストも併存）
- 事業区分別セクションにグラフを追加

---

### Phase 3: 予算分析ページ（未実装）

#### 計画内容

**新規ページ:**
- `app/analysis/page.tsx` - Server Component（データ取得）
- `components/analysis/AnalysisContent.tsx` - Client Component

**グラフ:**
- 政策別・年度別の予算推移（複数系列の折れ線グラフ）
- 部署別予算配分（横棒グラフ）
- 全体の財源構成（PieChart / ドーナツチャート）
- 年度別総予算推移（BarChart）

**データアクセス層:**
- `aggregateBudgetByPolicyAndYear(projects)` - 政策×年度クロス集計
- `aggregateBudgetByDepartment(projects)` - 部署別集計
- `aggregateRevenueSourceTotal(projects)` - 全体財源構成集計
- `aggregateYearlyTotalBudget(projects)` - 年度別総予算

**ナビゲーション:** `components/layout/Header.tsx` に「予算分析」リンク追加

---

## 検証方法

1. `npm test` - 全テスト通過
2. `npm run type-check` - 型エラーなし
3. `npm run build` - SSGビルド成功
4. `npm run dev` で以下を目視確認:
   - 事業詳細ページに4種のグラフが表示される
   - 金額トグル切り替えでグラフのツールチップ・Y軸表記が連動する
   - モバイル幅でレイアウトが崩れない

---

## 技術的な学び

### Excelデータ構造の理解

- JavaScriptの配列インデックスは0始まり
- Excel列名との対応: `row[52]` = BB列, `row[53]` = BC列
- 指標ラベルはBB列から開始（活動指標ア名称）

### 指標ラベル表示ロジック

名称・単位の組み合わせパターンを適切にハンドリング：
- 名称と単位の両方: `"名称（単位）"`
- 名称のみ: `"名称"`
- 単位のみ: `"デフォルトラベル（単位）"`
- 両方とも空: `"デフォルトラベル"`

### データ変換とテスト

- データ変換後の即座検証: `npm run convert-data && cat data/projects.json | jq ...`
- Excelデータの即座確認: `npx tsx -e "import XLSX from 'xlsx'; ..."`
