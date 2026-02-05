/**
 * 事業区分別予算配分グラフコンポーネント
 * 縦棒グラフで事業区分ごとの予算配分を表示
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
import { toCategoryChartData } from '@/lib/chart-data';
import { CATEGORY_CHART_COLORS } from '@/lib/chart-constants';
import { ChartContainer } from './ChartContainer';
import { CustomTooltip } from './CustomTooltip';
import type { CategoryStats } from '@/types';

interface CategoryChartProps {
  /** 事業区分別統計データ */
  categoryStats: CategoryStats[];
}

/**
 * 事業区分別予算配分グラフ
 * 縦棒グラフで表示
 */
export default function CategoryChart({
  categoryStats,
}: CategoryChartProps) {
  const { mode } = useAmountDisplay();

  // 空データのフォールバック
  if (categoryStats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">事業区分別予算配分</h3>
        <p className="text-gray-500 text-center py-8">データがありません</p>
      </div>
    );
  }

  // グラフ用データに変換
  const chartData = toCategoryChartData(categoryStats);

  return (
    <ChartContainer title="事業区分別予算配分">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="事業区分" />
          <YAxis tickFormatter={(value) => formatAmountShort(value, mode)} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="予算" fill={CATEGORY_CHART_COLORS.予算} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
