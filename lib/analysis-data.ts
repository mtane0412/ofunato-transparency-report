/**
 * 予算分析用のデータ集計関数
 *
 * 事業データから予算分析ページに必要な集計データを生成します。
 */

import type {
  DepartmentBudget,
  PolicyYearlyChartDataPoint,
  Project,
  RevenueComposition,
  YearlyTotalBudget,
} from '@/types';
import { formatFiscalYear } from './utils';

/**
 * 年度別の総予算を集計する
 *
 * @param projects - 事業データ一覧
 * @returns 年度別総予算の配列（年度順ソート）
 */
export function aggregateYearlyTotalBudget(projects: Project[]): YearlyTotalBudget[] {
  // 年度ごとのgrandTotalを集計
  const yearlyBudgetMap = new Map<number, number>();

  projects.forEach((project) => {
    project.financials.forEach((financial) => {
      const currentBudget = yearlyBudgetMap.get(financial.year) || 0;
      yearlyBudgetMap.set(financial.year, currentBudget + financial.grandTotal);
    });
  });

  // 年度順にソートして返す
  return Array.from(yearlyBudgetMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, budget]) => ({
      year: formatFiscalYear(year),
      budget,
    }));
}

/**
 * 部署別の予算を集計する（最新年度のみ）
 *
 * @param projects - 事業データ一覧
 * @returns 部署別予算の配列（予算降順ソート）
 */
export function aggregateBudgetByDepartment(projects: Project[]): DepartmentBudget[] {
  // 部署名を正規化（全角スペース除去）して集計
  const departmentBudgetMap = new Map<string, { budget: number; count: number }>();

  projects.forEach((project) => {
    // 部署名の全角スペースを除去して正規化
    const normalizedDepartment = project.department.replace(/\s+/g, '');

    // 最新年度のgrandTotalを取得
    const latestFinancial = project.financials.find((f) => f.year === project.year);

    if (latestFinancial) {
      const existing = departmentBudgetMap.get(normalizedDepartment) || {
        budget: 0,
        count: 0,
      };
      departmentBudgetMap.set(normalizedDepartment, {
        budget: existing.budget + latestFinancial.grandTotal,
        count: existing.count + 1,
      });
    }
  });

  // 予算降順でソートして返す
  return Array.from(departmentBudgetMap.entries())
    .map(([name, { budget, count }]) => ({
      name,
      budget,
      count,
    }))
    .sort((a, b) => b.budget - a.budget);
}

/**
 * 財源構成を集計する（最新年度のみ）
 *
 * @param projects - 事業データ一覧
 * @returns 財源構成の配列（金額降順ソート）
 */
export function aggregateRevenueSourceTotal(projects: Project[]): RevenueComposition[] {
  let nationalSubsidy = 0;
  let prefecturalSubsidy = 0;
  let localBond = 0;
  let other = 0;
  let generalRevenue = 0;

  projects.forEach((project) => {
    // 最新年度の財源データを取得
    const latestFinancial = project.financials.find((f) => f.year === project.year);

    if (latestFinancial) {
      nationalSubsidy += latestFinancial.nationalSubsidy;
      prefecturalSubsidy += latestFinancial.prefecturalSubsidy;
      localBond += latestFinancial.localBond;
      other += latestFinancial.other;
      generalRevenue += latestFinancial.generalRevenue;
    }
  });

  // 金額降順でソートして返す
  const revenueData: RevenueComposition[] = [
    { name: '国庫支出金', value: nationalSubsidy },
    { name: '都道府県支出金', value: prefecturalSubsidy },
    { name: '地方債', value: localBond },
    { name: 'その他', value: other },
    { name: '一般財源', value: generalRevenue },
  ];

  return revenueData.sort((a, b) => b.value - a.value);
}

/**
 * 政策別・年度別の予算を集計する
 *
 * @param projects - 事業データ一覧
 * @returns Recharts LineChart用の政策別・年度別予算データと政策名一覧
 */
export function aggregateBudgetByPolicyAndYear(projects: Project[]): {
  data: PolicyYearlyChartDataPoint[];
  policyNames: string[];
} {
  // ステップ1: 各政策IDごとに名前の出現回数をカウント（表記揺れ対策）
  const policyNameCountMap = new Map<string, Map<string, number>>();
  projects.forEach((project) => {
    const policyId = project.policy.id;
    const policyName = project.policy.name;

    if (!policyNameCountMap.has(policyId)) {
      policyNameCountMap.set(policyId, new Map<string, number>());
    }
    const nameCountMap = policyNameCountMap.get(policyId);
    if (nameCountMap) {
      nameCountMap.set(policyName, (nameCountMap.get(policyName) || 0) + 1);
    }
  });

  // ステップ2: 各政策IDごとに最も使用頻度の高い名前を取得
  const policyMostFrequentNameMap = new Map<string, string>();
  policyNameCountMap.forEach((nameCountMap, policyId) => {
    let maxCount = 0;
    let mostFrequentName = '';
    nameCountMap.forEach((count, name) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentName = name;
      }
    });
    policyMostFrequentNameMap.set(policyId, mostFrequentName);
  });

  // ステップ3: 政策名一覧を取得（政策IDベースで重複排除、ID順ソート）
  const policyNames = Array.from(policyMostFrequentNameMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, name]) => name);

  // ステップ4: 年度×政策IDのクロス集計（統一名称を使用）
  const yearPolicyBudgetMap = new Map<number, Map<string, number>>();

  projects.forEach((project) => {
    project.financials.forEach((financial) => {
      const year = financial.year;
      const policyId = project.policy.id;
      const unifiedPolicyName = policyMostFrequentNameMap.get(policyId) || project.policy.name;

      if (!yearPolicyBudgetMap.has(year)) {
        yearPolicyBudgetMap.set(year, new Map<string, number>());
      }

      const policyBudgetMap = yearPolicyBudgetMap.get(year);
      if (policyBudgetMap) {
        const currentBudget = policyBudgetMap.get(unifiedPolicyName) || 0;
        policyBudgetMap.set(unifiedPolicyName, currentBudget + financial.grandTotal);
      }
    });
  });

  // ステップ5: Recharts用のデータ形式に変換（年度順ソート）
  const data: PolicyYearlyChartDataPoint[] = Array.from(yearPolicyBudgetMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, policyBudgetMap]) => {
      const dataPoint: PolicyYearlyChartDataPoint = {
        year: formatFiscalYear(year),
      };

      // 各政策の予算を追加
      policyNames.forEach((policyName) => {
        dataPoint[policyName] = policyBudgetMap.get(policyName) || 0;
      });

      return dataPoint;
    });

  return { data, policyNames };
}
