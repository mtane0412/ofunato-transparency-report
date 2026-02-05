/**
 * トータルコスト推移グラフコンポーネント
 * 年度別のトータルコストを棒グラフで表示
 */

'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { CustomTooltip } from './CustomTooltip';
import { useAmountDisplay } from '@/contexts/AmountDisplayContext';
import { formatAmountShort } from '@/lib/utils';
import { toGrandTotalChartData } from '@/lib/chart-data';
import type { YearlyFinancial } from '@/types';

/**
 * トータルコスト推移グラフのプロパティ
 */
interface YearlyFinancialChartProps {
  /** 財政データ配列 */
  financials: YearlyFinancial[];
}

/**
 * トータルコスト推移グラフ
 *
 * 年度別のトータルコストを棒グラフで表示します。
 * Y軸はformatAmountShort()で省略形表記、
 * ツールチップはformatAmount()でフルフォーマット表示します。
 */
export function YearlyFinancialChart({ financials }: YearlyFinancialChartProps) {
  const { mode } = useAmountDisplay();

  // データ変換（メモ化により不要な再計算を防ぐ）
  const chartData = useMemo(
    () => toGrandTotalChartData(financials),
    [financials]
  );

  // データが空の場合
  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">トータルコスト推移</h3>
        <p className="text-gray-500 text-center py-8">データがありません</p>
      </div>
    );
  }

  return (
    <ChartContainer title="トータルコスト推移" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={(value) => formatAmountShort(value, mode)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="トータルコスト" fill="#3b82f6" />
      </BarChart>
    </ChartContainer>
  );
}
