/**
 * 政策別・年度別予算推移グラフコンポーネント
 * 複数系列折れ線グラフで政策ごとの予算推移を表示
 */

'use client';

import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useAmountDisplay } from '@/contexts/AmountDisplayContext';
import { POLICY_COLORS } from '@/lib/chart-constants';
import { formatAmount, formatAmountShort } from '@/lib/utils';
import type { PolicyYearlyChartDataPoint } from '@/types';
import { ChartContainer } from './ChartContainer';

interface PolicyBudgetTrendChartProps {
  /** 政策別・年度別予算推移データ */
  data: PolicyYearlyChartDataPoint[];
  /** 政策名一覧 */
  policyNames: string[];
}

/**
 * LineChart用カスタムツールチップ
 * 年度と各政策の予算を表示
 */
function CustomLineTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  const { mode } = useAmountDisplay();

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
      <p className="font-bold text-gray-900 mb-2">{data.year}年度</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm text-gray-700">
          <span style={{ color: entry.color }}>{entry.name}</span>:{' '}
          <span className="font-semibold">{formatAmount(entry.value as number, mode)}</span>
        </p>
      ))}
    </div>
  );
}

/**
 * 政策別・年度別予算推移グラフ
 * 複数系列折れ線グラフで各政策の予算推移を表示
 */
export default function PolicyBudgetTrendChart({ data, policyNames }: PolicyBudgetTrendChartProps) {
  const { mode } = useAmountDisplay();

  // 空データのフォールバック
  if (data.length === 0 || policyNames.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">政策別・年度別予算推移</h3>
        <p className="text-gray-500 text-center py-8">データがありません</p>
      </div>
    );
  }

  return (
    <ChartContainer title="政策別・年度別予算推移" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={(value) => formatAmountShort(value, mode)} />
        <Tooltip content={<CustomLineTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        {policyNames.map((policyName, index) => (
          <Line
            key={policyName}
            type="monotone"
            dataKey={policyName}
            stroke={POLICY_COLORS[index % POLICY_COLORS.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
