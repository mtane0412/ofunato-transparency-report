/**
 * グラフ用のカラーパレット定数
 * Rechartsで使用する色の定義を集約
 */

/**
 * 財源構成グラフ用のカラーパレット
 * 国庫支出金、県支出金、地方債、その他、一般財源の5色
 */
export const REVENUE_SOURCE_COLORS = {
  国庫支出金: '#3b82f6', // blue-500
  県支出金: '#8b5cf6', // violet-500
  地方債: '#f59e0b', // amber-500
  その他: '#6b7280', // gray-500
  一般財源: '#10b981', // emerald-500
} as const;

/**
 * コスト内訳グラフ用のカラーパレット
 * 事業費、人件費の2色
 */
export const COST_BREAKDOWN_COLORS = {
  事業費: '#3b82f6', // blue-500
  人件費: '#f59e0b', // amber-500
} as const;

/**
 * 指標グラフ用のカラー
 * 実績値の折れ線グラフで使用
 */
export const INDICATOR_COLORS = {
  実績値: '#3b82f6', // blue-500
} as const;

/**
 * 評価グラフ用のカラーパレット
 * 改革改善の方向性・今後の方向性の4カテゴリ
 */
export const EVALUATION_COLORS: Record<string, string> = {
  '１　現状維持': '#3b82f6', // blue-500
  '２　改革改善（縮小・統合含む）': '#f59e0b', // amber-500
  '３　終了・廃止・休止': '#ef4444', // red-500
  'その他・未設定': '#9ca3af', // gray-400
} as const;

/**
 * 政策別予算推移グラフ用のカラーパレット（8政策対応）
 * LineChart用の8色
 */
export const POLICY_COLORS: string[] = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#6b7280', // gray-500
];

/**
 * 財源構成PieChart用のカラーパレット（5色）
 * REVENUE_SOURCE_COLORSと同じ色を配列形式で提供
 */
export const REVENUE_PIE_COLORS: string[] = [
  '#3b82f6', // 国庫支出金 (blue-500)
  '#8b5cf6', // 県支出金 (violet-500)
  '#f59e0b', // 地方債 (amber-500)
  '#6b7280', // その他 (gray-500)
  '#10b981', // 一般財源 (emerald-500)
];
