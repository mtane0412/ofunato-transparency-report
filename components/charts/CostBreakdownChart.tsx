/**
 * コスト内訳グラフコンポーネント
 * 年度別の事業費・人件費を積み上げ棒グラフで表示
 */

'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { useAmountDisplay } from '@/contexts/AmountDisplayContext';
import { COST_BREAKDOWN_COLORS } from '@/lib/chart-constants';
import { toCostBreakdownChartData } from '@/lib/chart-data';
import { formatAmountShort } from '@/lib/utils';
import type { YearlyFinancial } from '@/types';
import { ChartContainer } from './ChartContainer';
import { CustomTooltip } from './CustomTooltip';

/**
 * コスト内訳グラフのプロパティ
 */
interface CostBreakdownChartProps {
  /** 財政データ配列 */
  financials: YearlyFinancial[];
}

/**
 * コスト内訳グラフ
 *
 * 年度別のコスト内訳（事業費、人件費）を
 * 積み上げ棒グラフで表示します。
 */
export function CostBreakdownChart({ financials }: CostBreakdownChartProps) {
  const { mode } = useAmountDisplay();

  // データ変換（メモ化により不要な再計算を防ぐ）
  const chartData = useMemo(() => toCostBreakdownChartData(financials), [financials]);

  // データが空の場合
  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">事業費・人件費の内訳</h3>
        <p className="text-gray-500 text-center py-8">データがありません</p>
      </div>
    );
  }

  return (
    <ChartContainer title="事業費・人件費の内訳" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={(value) => formatAmountShort(value, mode)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="事業費" stackId="a" fill={COST_BREAKDOWN_COLORS.事業費} />
        <Bar dataKey="人件費" stackId="a" fill={COST_BREAKDOWN_COLORS.人件費} />
      </BarChart>
    </ChartContainer>
  );
}
