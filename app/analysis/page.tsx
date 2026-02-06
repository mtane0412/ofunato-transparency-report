/**
 * 予算分析ページ
 *
 * 大船渡市の事務事業評価データの予算分析を表示します。
 * - 年度別総予算推移
 * - 政策別・年度別予算推移
 * - 全体の財源構成
 * - 部署別予算配分
 *
 * Server Componentとして実装されており、データ取得後にClient Componentに渡します。
 */

import { AnalysisContent } from '@/components/analysis/AnalysisContent';
import {
  aggregateBudgetByDepartment,
  aggregateBudgetByPolicyAndYear,
  aggregateRevenueSourceTotal,
  aggregateYearlyTotalBudget,
} from '@/lib/analysis-data';
import { getAllProjects } from '@/lib/data';

export default function AnalysisPage() {
  // 全プロジェクトを取得
  const projects = getAllProjects();

  // 4種類のデータを集計
  const yearlyTotalBudget = aggregateYearlyTotalBudget(projects);
  const { data: policyYearlyData, policyNames } = aggregateBudgetByPolicyAndYear(projects);
  const revenueComposition = aggregateRevenueSourceTotal(projects);
  const departmentBudgets = aggregateBudgetByDepartment(projects);

  return (
    <AnalysisContent
      yearlyTotalBudget={yearlyTotalBudget}
      policyYearlyData={policyYearlyData}
      policyNames={policyNames}
      revenueComposition={revenueComposition}
      departmentBudgets={departmentBudgets}
      totalProjects={projects.length}
    />
  );
}
