/**
 * 政策別予算配分グラフコンポーネント
 * 横棒グラフで政策ごとの予算配分を表示
 */

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAmountDisplay } from '@/contexts/AmountDisplayContext';
import { formatAmount, formatAmountShort } from '@/lib/utils';
import { toPolicyBudgetChartData } from '@/lib/chart-data';
import { ChartContainer } from './ChartContainer';
import type { CategoryStats } from '@/types';

interface PolicyBudgetChartProps {
  /** 政策別統計データ */
  policyStats: CategoryStats[];
}

/**
 * 横棒グラフ用カスタムツールチップ
 * 政策名、予算、事業数を表示
 */
function CustomBarTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  const { mode } = useAmountDisplay();

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
      <p className="font-bold text-gray-900 mb-2">{data.name}</p>
      <p className="text-sm text-gray-700">
        予算: <span className="font-semibold">{formatAmount(data.value, mode)}</span>
      </p>
      <p className="text-sm text-gray-700">
        事業数: <span className="font-semibold">{data.count}件</span>
      </p>
    </div>
  );
}

/**
 * 政策別予算配分グラフ
 * 予算降順でソートされた横棒グラフで表示
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

  // グラフの高さを動的に計算（項目数 × 50px、最低400px）
  const chartHeight = Math.max(400, chartData.length * 50);

  return (
    <ChartContainer title="政策別予算配分" height={chartHeight}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 250, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          tickFormatter={(value) => formatAmountShort(value, mode)}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={240}
          tick={{ fontSize: 13 }}
        />
        <Tooltip content={<CustomBarTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        <Bar dataKey="value" fill="#3b82f6" name="予算" />
      </BarChart>
    </ChartContainer>
  );
}
