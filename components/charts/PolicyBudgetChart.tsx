/**
 * 政策別予算配分グラフコンポーネント
 * 円グラフで政策ごとの予算配分を表示
 */

'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAmountDisplay } from '@/contexts/AmountDisplayContext';
import { formatAmount } from '@/lib/utils';
import { toPolicyBudgetChartData } from '@/lib/chart-data';
import { POLICY_BUDGET_COLORS } from '@/lib/chart-constants';
import { ChartContainer } from './ChartContainer';
import type { CategoryStats } from '@/types';

interface PolicyBudgetChartProps {
  /** 政策別統計データ */
  policyStats: CategoryStats[];
}

/**
 * 円グラフ用カスタムラベル（内側配置）
 * パーセンテージを円の内側に表示（3%未満は非表示）
 */
function renderLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

  if (!percent || percent < 0.03) return null; // 3%未満は非表示

  const RADIAN = Math.PI / 180;
  // 円の中心寄り（内側）に配置
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="14"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
}

/**
 * カスタムツールチップ
 * 政策名、予算、事業数、パーセンテージを表示
 */
function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  const { mode } = useAmountDisplay();

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;
  const percent = payload[0].percent;

  return (
    <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
      <p className="font-bold text-gray-900">{data.name}</p>
      <p className="text-sm text-gray-700">
        予算: <span className="font-semibold">{formatAmount(data.value, mode)}</span>
      </p>
      <p className="text-sm text-gray-700">
        事業数: <span className="font-semibold">{data.count}件</span>
      </p>
      {percent !== undefined && (
        <p className="text-sm text-gray-700">
          割合: <span className="font-semibold">{(percent * 100).toFixed(1)}%</span>
        </p>
      )}
    </div>
  );
}

/**
 * 政策別予算配分グラフ
 * 予算降順でソートされた円グラフで表示
 */
export default function PolicyBudgetChart({
  policyStats,
}: PolicyBudgetChartProps) {
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
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={140}
            label={renderLabel}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={POLICY_BUDGET_COLORS[index % POLICY_BUDGET_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={100}
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
