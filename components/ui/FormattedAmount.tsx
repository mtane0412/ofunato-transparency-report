/**
 * 金額表示コンポーネント
 *
 * AmountDisplayContext の表示モードに応じて、金額を適切な形式でフォーマットして表示します。
 * - 'japanese'モード: 億・万・円の日本語表記（例: "1億3,000万5,000円"）
 * - 'thousand'モード: 千円表記（例: "130,005千円"）
 */

'use client';

import { useAmountDisplay } from '@/contexts/AmountDisplayContext';
import { formatAmount } from '@/lib/utils';

/**
 * FormattedAmount のプロパティ
 */
interface FormattedAmountProps {
  /** 千円単位の金額 */
  amount: number;
}

/**
 * FormattedAmount コンポーネント
 *
 * Context の表示モードに応じて金額をフォーマットして表示します。
 *
 * @example
 * ```tsx
 * <FormattedAmount amount={130005} />
 * // 日本語モード: "1億3,000万5,000円"
 * // 千円モード: "130,005千円"
 * ```
 */
export function FormattedAmount({ amount }: FormattedAmountProps) {
  const { mode } = useAmountDisplay();
  return <>{formatAmount(amount, mode)}</>;
}
