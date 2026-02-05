/**
 * ユーティリティ関数
 */

/**
 * 数値を千円単位の通貨形式でフォーマット
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(value * 1000);
}

/**
 * 数値を千円単位でフォーマット（単位表記付き）
 */
export function formatThousandYen(value: number): string {
  return `${value.toLocaleString('ja-JP')}千円`;
}

/**
 * 数値をパーセント形式でフォーマット
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
