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
