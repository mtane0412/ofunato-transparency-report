/**
 * 財源構成グラフコンポーネント
 * ドーナツチャートで財源の内訳を表示
 */

'use client';

import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { useAmountDisplay } from '@/contexts/AmountDisplayContext';
import { REVENUE_PIE_COLORS } from '@/lib/chart-constants';
import { formatAmount, formatPercent } from '@/lib/utils';
import type { RechartsTooltipPayload, RevenueComposition } from '@/types';
import { ChartContainer } from './ChartContainer';

interface RevenueCompositionChartProps {
  /** 財源構成データ */
  data: RevenueComposition[];
}

/**
 * PieChart用カスタムラベル
 * パーセンテージを円グラフ上に表示
 */
function CustomPieLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}) {
  // 必須パラメータのチェック
  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    innerRadius === undefined ||
    outerRadius === undefined ||
    percent === undefined
  ) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // 5%未満の場合はラベルを表示しない（視認性向上）
  if (percent < 0.05) {
    return null;
  }

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize="14"
      fontWeight="bold"
    >
      {formatPercent(percent * 100)}
    </text>
  );
}

/**
 * PieChart用カスタムツールチップ
 * 財源名、金額、割合を表示
 */
function CustomPieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: RechartsTooltipPayload<number>[];
}) {
  const { mode } = useAmountDisplay();

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0];
  const total = data.payload?.totalValue as number | undefined; // 合計値（親から渡される）
  const value = data.value ?? 0;
  const percent = total && total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
      <p className="font-bold text-gray-900 mb-2">{data.name}</p>
      <p className="text-sm text-gray-700">
        金額: <span className="font-semibold">{formatAmount(value, mode)}</span>
      </p>
      <p className="text-sm text-gray-700">
        割合: <span className="font-semibold">{formatPercent(percent)}</span>
      </p>
    </div>
  );
}

/**
 * 財源構成グラフ
 * ドーナツチャートで財源の内訳を表示
 */
export default function RevenueCompositionChart({ data }: RevenueCompositionChartProps) {
  // 空データのフォールバック
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">全体の財源構成</h3>
        <p className="text-gray-500 text-center py-8">データがありません</p>
      </div>
    );
  }

  // 合計値を計算
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  // 各データポイントにtotalValueを追加（ツールチップで使用）
  const chartData = data.map((item) => ({
    ...item,
    totalValue,
  }));

  return (
    <ChartContainer title="全体の財源構成" height={350}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          label={CustomPieLabel}
          labelLine={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={REVENUE_PIE_COLORS[index % REVENUE_PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomPieTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
      </PieChart>
    </ChartContainer>
  );
}
