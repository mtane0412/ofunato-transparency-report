/**
 * 評価グラフコンポーネント
 * 改革改善の方向性・今後の方向性を横棒グラフで表示
 */

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { EVALUATION_COLORS } from '@/lib/chart-constants';
import { ChartContainer } from './ChartContainer';

interface EvaluationChartProps {
  /** グラフタイトル */
  title: string;
  /** グラフ用データ（件数降順ソート済み） */
  data: Array<{ name: string; value: number }>;
  /** 説明文（オプション） */
  description?: string;
}

/**
 * 横棒グラフ用カスタムツールチップ
 * カテゴリ名と件数を表示
 */
function CustomEvaluationTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
      <p className="font-bold text-gray-900 mb-2">{data.name}</p>
      <p className="text-sm text-gray-700">
        件数: <span className="font-semibold">{data.value}件</span>
      </p>
    </div>
  );
}

/**
 * 評価グラフ
 * 件数降順でソートされた横棒グラフで表示（カテゴリ別色分け）
 */
export function EvaluationChart({ title, data, description }: EvaluationChartProps) {
  // 空データのフォールバック
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
        <p className="text-gray-500 text-center py-8">データがありません</p>
      </div>
    );
  }

  // グラフの高さを動的に計算（項目数 × 60px、最低250px）
  const chartHeight = Math.max(250, data.length * 60);

  return (
    <ChartContainer title={title} description={description} height={chartHeight}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 280, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={270} tick={{ fontSize: 13 }} />
        <Tooltip content={<CustomEvaluationTooltip />} />
        <Bar dataKey="value" name="件数">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={EVALUATION_COLORS[entry.name] || '#6b7280'} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
