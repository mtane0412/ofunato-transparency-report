/**
 * 財源構成グラフコンポーネント
 * 年度別の財源構成を積み上げ棒グラフで表示
 */

'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { useAmountDisplay } from '@/contexts/AmountDisplayContext';
import { REVENUE_SOURCE_COLORS } from '@/lib/chart-constants';
import { toRevenueSourceChartData } from '@/lib/chart-data';
import { formatAmountShort } from '@/lib/utils';
import type { YearlyFinancial } from '@/types';
import { ChartContainer } from './ChartContainer';
import { CustomTooltip } from './CustomTooltip';

/**
 * 財源構成グラフのプロパティ
 */
interface RevenueSourceChartProps {
  /** 財政データ配列 */
  financials: YearlyFinancial[];
}

/**
 * 財源構成グラフ
 *
 * 年度別の財源構成（国庫支出金、県支出金、地方債、その他、一般財源）を
 * 積み上げ棒グラフで表示します。
 */
export function RevenueSourceChart({ financials }: RevenueSourceChartProps) {
  const { mode } = useAmountDisplay();

  // データ変換（メモ化により不要な再計算を防ぐ）
  const chartData = useMemo(() => toRevenueSourceChartData(financials), [financials]);

  // データが空の場合
  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">財源構成</h3>
        <p className="text-gray-500 text-center py-8">データがありません</p>
      </div>
    );
  }

  return (
    <ChartContainer title="財源構成" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={(value) => formatAmountShort(value, mode)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="国庫支出金" stackId="a" fill={REVENUE_SOURCE_COLORS.国庫支出金} />
        <Bar dataKey="県支出金" stackId="a" fill={REVENUE_SOURCE_COLORS.県支出金} />
        <Bar dataKey="地方債" stackId="a" fill={REVENUE_SOURCE_COLORS.地方債} />
        <Bar dataKey="その他" stackId="a" fill={REVENUE_SOURCE_COLORS.その他} />
        <Bar dataKey="一般財源" stackId="a" fill={REVENUE_SOURCE_COLORS.一般財源} />
      </BarChart>
    </ChartContainer>
  );
}
