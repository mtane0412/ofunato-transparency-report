/**
 * グラフ用カスタムツールチップコンポーネント
 * AmountDisplayContextと連動して金額表示を切り替える
 */

'use client';

import { useAmountDisplay } from '@/contexts/AmountDisplayContext';
import { formatAmount } from '@/lib/utils';

/**
 * ツールチップのペイロード型定義
 */
interface TooltipPayload {
  /** データキー */
  dataKey?: string | number;
  /** データキー（日本語ラベル） */
  name: string;
  /** 値 */
  value: number;
  /** カラー */
  color?: string;
  /** ペイロード（元データ） */
  payload?: Record<string, unknown>;
}

/**
 * カスタムツールチップのプロパティ
 */
interface CustomTooltipProps {
  /** アクティブかどうか */
  active?: boolean;
  /** ペイロードデータ */
  payload?: TooltipPayload[];
  /** ラベル（年度など） */
  label?: string;
}

/**
 * カスタムツールチップコンポーネント
 *
 * useAmountDisplay()と連動して、金額を適切な形式で表示します。
 * Rechartsのtooltipプロパティに渡して使用します。
 */
export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  const { mode } = useAmountDisplay();

  // ツールチップが非表示、またはデータがない場合は何も表示しない
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-300 rounded shadow-lg p-3">
      {/* ラベル（年度など） */}
      {label && <p className="font-semibold mb-2">{label}</p>}

      {/* 各データ項目 */}
      {payload.map((entry, index) => (
        <div
          key={entry.dataKey?.toString() || entry.name?.toString() || `item-${index}`}
          className="flex items-center gap-2 text-sm"
        >
          {/* カラーインジケーター */}
          {entry.color && (
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
          )}
          {/* ラベルと値 */}
          <span className="text-gray-700">{entry.name}:</span>
          <span className="font-medium">{formatAmount(entry.value, mode)}</span>
        </div>
      ))}
    </div>
  );
}
