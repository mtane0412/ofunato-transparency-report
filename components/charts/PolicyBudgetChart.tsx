/**
 * 政策別予算配分グラフコンポーネント
 * 横棒グラフで政策ごとの予算配分を表示
 */

'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAmountDisplay } from '@/contexts/AmountDisplayContext';
import { formatAmountShort } from '@/lib/utils';
import { toPolicyBudgetChartData } from '@/lib/chart-data';
import { POLICY_BUDGET_COLORS } from '@/lib/chart-constants';
import { ChartContainer } from './ChartContainer';
import { CustomTooltip } from './CustomTooltip';
import type { CategoryStats } from '@/types';

interface PolicyBudgetChartProps {
  /** 政策別統計データ */
  policyStats: CategoryStats[];
}

/**
 * 政策別予算配分グラフ
 * 予算降順の横棒グラフで表示
 */
export default function PolicyBudgetChart({
  policyStats,
}: PolicyBudgetChartProps) {
  const { mode } = useAmountDisplay();

  // 空データのフォールバック
  if (policyStats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">政策別予算配分</h3>
        <p className="text-gray-500 text-center py-8">データがありません</p>
      </div>
    );
  }

  // グラフ用データに変換（予算降順ソート）
  const chartData = toPolicyBudgetChartData(policyStats);

  return (
    <ChartContainer title="政策別予算配分">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 220, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickFormatter={(value) => formatAmountShort(value, mode)}
          />
          <YAxis type="category" dataKey="政策名" width={220} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="予算" fill={POLICY_BUDGET_COLORS.予算} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
