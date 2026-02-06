/**
 * 予算分析ページのメインコンテンツ
 *
 * Client Componentとして実装し、金額表示モードのコンテキストを使用します。
 */

'use client';

import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAmountDisplay } from '@/contexts/AmountDisplayContext';
import { formatAmount, formatAmountShort } from '@/lib/utils';
import { toYearlyTotalBudgetChartData } from '@/lib/chart-data';
import { ChartContainer } from '@/components/charts/ChartContainer';
import PolicyBudgetTrendChart from '@/components/charts/PolicyBudgetTrendChart';
import RevenueCompositionChart from '@/components/charts/RevenueCompositionChart';
import DepartmentBudgetChart from '@/components/charts/DepartmentBudgetChart';
import type {
  YearlyTotalBudget,
  PolicyYearlyChartDataPoint,
  RevenueComposition,
  DepartmentBudget,
} from '@/types';

interface AnalysisContentProps {
  /** 年度別総予算データ */
  yearlyTotalBudget: YearlyTotalBudget[];
  /** 政策別・年度別予算推移データ */
  policyYearlyData: PolicyYearlyChartDataPoint[];
  /** 政策名一覧 */
  policyNames: string[];
  /** 財源構成データ */
  revenueComposition: RevenueComposition[];
  /** 部署別予算データ */
  departmentBudgets: DepartmentBudget[];
  /** 総事業数 */
  totalProjects: number;
}

/**
 * 年度別総予算推移グラフ用カスタムツールチップ
 */
function YearlyTotalBudgetTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  const { mode } = useAmountDisplay();

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
      <p className="font-bold text-gray-900 mb-2">{data.year}年度</p>
      <p className="text-sm text-gray-700">
        総予算: <span className="font-semibold">{formatAmount(data.budget, mode)}</span>
      </p>
    </div>
  );
}

/**
 * 予算分析ページのメインコンテンツ
 */
export function AnalysisContent({
  yearlyTotalBudget,
  policyYearlyData,
  policyNames,
  revenueComposition,
  departmentBudgets,
  totalProjects,
}: AnalysisContentProps) {
  const { mode } = useAmountDisplay();

  // 年度別総予算グラフ用データに変換
  const yearlyTotalChartData = toYearlyTotalBudgetChartData(yearlyTotalBudget);

  return (
    <div>
      {/* ページタイトル */}
      <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-8">予算分析</h1>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">分析対象事業数</h2>
          <p className="text-xl md:text-3xl font-bold text-blue-600">{totalProjects}件</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">分析対象年度</h2>
          <p className="text-xl md:text-3xl font-bold text-blue-600">R2〜R7</p>
        </div>
      </div>

      {/* 年度別総予算推移（BarChart） */}
      <div className="mb-8">
        <ChartContainer title="年度別総予算推移" height={300}>
          <BarChart
            data={yearlyTotalChartData}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => formatAmountShort(value, mode)} />
            <Tooltip content={<YearlyTotalBudgetTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="budget" fill="#3b82f6" name="総予算" />
          </BarChart>
        </ChartContainer>
      </div>

      {/* 政策別・年度別予算推移（LineChart） */}
      <div className="mb-8">
        <PolicyBudgetTrendChart data={policyYearlyData} policyNames={policyNames} />
      </div>

      {/* 全体の財源構成（PieChart） */}
      <div className="mb-8">
        <RevenueCompositionChart data={revenueComposition} />
      </div>

      {/* 部署別予算配分（横棒グラフ） */}
      <div className="mb-8">
        <DepartmentBudgetChart departmentBudgets={departmentBudgets} />
      </div>

      {/* 事業一覧へのリンク */}
      <div className="text-center">
        <Link
          href="/projects"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          事業一覧を見る
        </Link>
      </div>
    </div>
  );
}
