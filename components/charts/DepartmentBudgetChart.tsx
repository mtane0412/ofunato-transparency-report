/**
 * 部署別予算配分グラフコンポーネント
 * 横棒グラフで部署ごとの予算配分を表示（top20 + すべて表示機能）
 */

'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAmountDisplay } from '@/contexts/AmountDisplayContext';
import { formatAmount, formatAmountShort } from '@/lib/utils';
import { ChartContainer } from './ChartContainer';
import { useChartYAxisWidth } from '@/hooks/useChartYAxisWidth';
import type { DepartmentBudget } from '@/types';

interface DepartmentBudgetChartProps {
  /** 部署別予算データ */
  departmentBudgets: DepartmentBudget[];
}

/**
 * 横棒グラフ用カスタムツールチップ
 * 部署名、予算、事業数を表示
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
        予算: <span className="font-semibold">{formatAmount(data.budget, mode)}</span>
      </p>
      <p className="text-sm text-gray-700">
        事業数: <span className="font-semibold">{data.count}件</span>
      </p>
    </div>
  );
}

/**
 * 部署別予算配分グラフ
 * 予算降順でソートされた横棒グラフで表示
 * 20件以上ある場合はtop20表示 + 「すべて表示」ボタン
 */
export default function DepartmentBudgetChart({
  departmentBudgets,
}: DepartmentBudgetChartProps) {
  const { mode } = useAmountDisplay();
  const { yAxisWidth, fontSize } = useChartYAxisWidth(240);
  const [showAll, setShowAll] = useState(false);

  // 空データのフォールバック
  if (departmentBudgets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">部署別予算配分</h3>
        <p className="text-gray-500 text-center py-8">データがありません</p>
      </div>
    );
  }

  // 表示するデータ（top20 or すべて）
  const displayedData = showAll ? departmentBudgets : departmentBudgets.slice(0, 20);

  // グラフの高さを動的に計算（項目数 × 40px、最低400px）
  const chartHeight = Math.max(400, displayedData.length * 40);

  return (
    <div className="space-y-4">
      <ChartContainer
        title="部署別予算配分"
        height={chartHeight}
        description={
          departmentBudgets.length > 20 && !showAll
            ? `上位20部署を表示中（全${departmentBudgets.length}部署）`
            : undefined
        }
      >
        <BarChart
          data={displayedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickFormatter={(value) => formatAmountShort(value, mode)}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={yAxisWidth}
            tick={{ fontSize }}
          />
          <Tooltip content={<CustomBarTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="budget" fill="#3b82f6" name="予算" />
        </BarChart>
      </ChartContainer>

      {/* すべて表示ボタン */}
      {departmentBudgets.length > 20 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showAll ? '上位20部署のみ表示' : 'すべて表示'}
          </button>
        </div>
      )}
    </div>
  );
}
