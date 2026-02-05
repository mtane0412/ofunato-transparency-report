/**
 * ユーティリティ関数
 */

import type { AmountDisplayMode } from '@/types';

/**
 * 千円単位の数値を円に変換し、億・万・円の日本語表記でフォーマット
 * @param amountInThousand - 千円単位の金額
 * @returns 日本語表記の金額文字列（例: "1億3,000万5,000円"）
 */
export function formatJapaneseYen(amountInThousand: number): string {
  // 千円単位を円に変換
  const amountInYen = amountInThousand * 1000;

  // 符号を保持
  const isNegative = amountInYen < 0;
  const absoluteAmount = Math.abs(amountInYen);

  // 0の場合
  if (absoluteAmount === 0) {
    return '0円';
  }

  // 億・万・円に分解
  const oku = Math.floor(absoluteAmount / 100000000);
  const man = Math.floor((absoluteAmount % 100000000) / 10000);
  const yen = absoluteAmount % 10000;

  const parts: string[] = [];

  // 億の部分
  if (oku > 0) {
    parts.push(`${oku.toLocaleString('ja-JP')}億`);
  }

  // 万の部分
  if (man > 0) {
    parts.push(`${man.toLocaleString('ja-JP')}万`);
  }

  // 円の部分（0でない場合のみ）
  if (yen > 0) {
    parts.push(`${yen.toLocaleString('ja-JP')}円`);
  } else if (parts.length > 0) {
    // 億または万で終わる場合は「円」を付与
    parts.push('円');
  }

  const result = parts.join('');
  return isNegative ? `-${result}` : result;
}

/**
 * 金額を指定されたモードでフォーマット
 * @param amountInThousand - 千円単位の金額
 * @param mode - 表示モード（'thousand' or 'japanese'）
 * @returns フォーマットされた金額文字列
 */
export function formatAmount(
  amountInThousand: number,
  mode: AmountDisplayMode
): string {
  if (mode === 'thousand') {
    return `${amountInThousand.toLocaleString('ja-JP')}千円`;
  }
  return formatJapaneseYen(amountInThousand);
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

/**
 * グラフY軸用の省略形金額フォーマット
 * @param amountInThousand - 千円単位の金額
 * @param mode - 表示モード（'thousand' or 'japanese'）
 * @returns 省略形の金額文字列
 *
 * thousandモード: カンマ区切りの千円表記（例: "1,000千円"）
 * japaneseモード:
 *   - 1万円未満: 千円単位（例: "5千円"）
 *   - 1万円〜1億円未満: 万円単位、小数点1桁（例: "1.3万"）
 *   - 1億円以上: 億円単位、小数点1桁（例: "1.3億"）
 */
export function formatAmountShort(
  amountInThousand: number,
  mode: AmountDisplayMode
): string {
  if (mode === 'thousand') {
    // thousandモードはカンマ区切りの千円表記
    return `${amountInThousand.toLocaleString('ja-JP')}千円`;
  }

  // japaneseモードは省略表記
  const isNegative = amountInThousand < 0;
  const absoluteAmount = Math.abs(amountInThousand);

  if (absoluteAmount === 0) {
    return '0円';
  }

  // 1万円未満（千円単位で10未満）は千円表記
  if (absoluteAmount < 10) {
    const result = `${absoluteAmount}千円`;
    return isNegative ? `-${result}` : result;
  }

  // 1億円未満（千円単位で100,000未満）は万円単位
  if (absoluteAmount < 100000) {
    const manValue = absoluteAmount / 10;
    const formatted = manValue.toLocaleString('ja-JP', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
    const result = `${formatted}万`;
    return isNegative ? `-${result}` : result;
  }

  // 1億円以上は億円単位
  const okuValue = absoluteAmount / 100000;
  const formatted = okuValue.toLocaleString('ja-JP', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  const result = `${formatted}億`;
  return isNegative ? `-${result}` : result;
}

/**
 * 指標ラベルをフォーマットする
 *
 * @param label - 指標ラベル（名称と単位を含む）
 * @param defaultLabel - デフォルトラベル
 * @returns フォーマットされたラベル文字列
 *
 * - 名称と単位の両方がある場合: "名称（単位）"
 * - 名称のみの場合: "名称"
 * - 単位のみの場合: "デフォルトラベル（単位）"
 * - 両方とも空またはlabelがundefined/nullの場合: "デフォルトラベル"
 */
export function formatIndicatorLabel(
  label: { name?: string; unit?: string } | undefined | null,
  defaultLabel: string
): string {
  // labelがundefined/nullの場合は空のオブジェクトとして扱う
  const { name = '', unit = '' } = label || {};

  if (name && unit) {
    return `${name}（${unit}）`;
  }
  if (name) {
    return name;
  }
  if (unit) {
    return `${defaultLabel}（${unit}）`;
  }
  return defaultLabel;
}
