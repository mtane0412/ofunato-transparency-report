/**
 * 指標推移グラフコンポーネント
 * 年度別の指標実績値を折れ線グラフで表示
 */

'use client';

import { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { INDICATOR_COLORS } from '@/lib/chart-constants';
import { toIndicatorChartData } from '@/lib/chart-data';
import type { YearlyIndicator } from '@/types';
import { ChartContainer } from './ChartContainer';

/**
 * 指標推移グラフのプロパティ
 */
interface IndicatorChartProps {
  /** 指標データ配列 */
  indicators: YearlyIndicator[];
  /** カテゴリ（'activity', 'target', 'outcome'） */
  category: keyof Pick<YearlyIndicator, 'activity' | 'target' | 'outcome'>;
  /** インデックス（0, 1, 2） */
  index: number;
  /** グラフラベル（例: "活動指標ア"） */
  label: string;
}

/**
 * 指標推移グラフ
 *
 * 年度別の指標実績値を折れ線グラフで表示します。
 * 指標データは金額ではないため、formatAmountは使用しません。
 */
export function IndicatorChart({ indicators, category, index, label }: IndicatorChartProps) {
  // データ変換（メモ化により不要な再計算を防ぐ）
  const chartData = useMemo(
    () => toIndicatorChartData(indicators, category, index),
    [indicators, category, index]
  );

  // データが空の場合（nullのみの場合も含む）
  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{label}</h3>
        <p className="text-gray-500 text-center py-8">データがありません</p>
      </div>
    );
  }

  return (
    <ChartContainer title={label} height={250}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="実績値"
          stroke={INDICATOR_COLORS.実績値}
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
