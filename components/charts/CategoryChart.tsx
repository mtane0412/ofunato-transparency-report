/**
 * 事業区分別予算配分グラフコンポーネント
 * 円グラフで事業区分ごとの予算配分を表示
 */

'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAmountDisplay } from '@/contexts/AmountDisplayContext';
import { formatAmount } from '@/lib/utils';
import { toCategoryChartData } from '@/lib/chart-data';
import { CATEGORY_CHART_COLORS } from '@/lib/chart-constants';
import { ChartContainer } from './ChartContainer';
import type { CategoryStats } from '@/types';

interface CategoryChartProps {
  /** 事業区分別統計データ */
  categoryStats: CategoryStats[];
}

/**
 * 円グラフ用カスタムラベル
 * パーセンテージを表示
 */
function renderLabel(entry: { percent?: number }) {
  if (!entry.percent) return '';
  const percent = (entry.percent * 100).toFixed(1);
  return `${percent}%`;
}

/**
 * カスタムツールチップ
 * 事業区分、予算、事業数、パーセンテージを表示
 */
function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  const { mode } = useAmountDisplay();

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
      <p className="font-bold text-gray-900">{data.name}</p>
      <p className="text-sm text-gray-700">
        予算: <span className="font-semibold">{formatAmount(data.value, mode)}</span>
      </p>
      <p className="text-sm text-gray-700">
        事業数: <span className="font-semibold">{data.count}件</span>
      </p>
      <p className="text-sm text-gray-700">
        割合: <span className="font-semibold">{(payload[0].percent * 100).toFixed(1)}%</span>
      </p>
    </div>
  );
}

/**
 * 事業区分別予算配分グラフ
 * 円グラフで表示
 */
export default function CategoryChart({
  categoryStats,
}: CategoryChartProps) {
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
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={renderLabel}
            labelLine
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CATEGORY_CHART_COLORS[index % CATEGORY_CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
