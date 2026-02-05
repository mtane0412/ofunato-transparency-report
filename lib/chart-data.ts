/**
 * グラフ用のデータ変換関数
 * RawプロジェクトデータをRechartsで使用できる形式に変換
 */

import type { YearlyFinancial, YearlyIndicator, CategoryStats, EvaluationCategoryCount } from '@/types';

/**
 * 年度数値を和暦文字列に変換
 * @param year - 年度（例: 5）
 * @returns 和暦文字列（例: "R5"）
 */
export function formatFiscalYear(year: number): string {
  return `R${year}`;
}

/**
 * 財政データからトータルコスト推移用のグラフデータに変換
 * @param financials - 財政データ配列
 * @returns グラフ用データ配列（year, トータルコスト）
 */
export function toGrandTotalChartData(
  financials: YearlyFinancial[]
): Array<{ year: string; トータルコスト: number }> {
  return financials.map((fiscal) => ({
    year: formatFiscalYear(fiscal.year),
    トータルコスト: fiscal.grandTotal ?? 0,
  }));
}

/**
 * 財政データから財源構成用のグラフデータに変換
 * @param financials - 財政データ配列
 * @returns グラフ用データ配列（year, 国庫支出金, 県支出金, 地方債, その他, 一般財源）
 */
export function toRevenueSourceChartData(
  financials: YearlyFinancial[]
): Array<{
  year: string;
  国庫支出金: number;
  県支出金: number;
  地方債: number;
  その他: number;
  一般財源: number;
}> {
  return financials.map((fiscal) => ({
    year: formatFiscalYear(fiscal.year),
    国庫支出金: fiscal.nationalSubsidy ?? 0,
    県支出金: fiscal.prefecturalSubsidy ?? 0,
    地方債: fiscal.localBond ?? 0,
    その他: fiscal.other ?? 0,
    一般財源: fiscal.generalRevenue ?? 0,
  }));
}

/**
 * 財政データからコスト内訳用のグラフデータに変換
 * @param financials - 財政データ配列
 * @returns グラフ用データ配列（year, 事業費, 人件費）
 */
export function toCostBreakdownChartData(
  financials: YearlyFinancial[]
): Array<{ year: string; 事業費: number; 人件費: number }> {
  return financials.map((fiscal) => ({
    year: formatFiscalYear(fiscal.year),
    事業費: fiscal.totalCost ?? 0,
    人件費: fiscal.personnelCost ?? 0,
  }));
}

/**
 * 指標データから指定カテゴリ・インデックスのグラフデータに変換
 * @param indicators - 指標データ配列
 * @param category - カテゴリ（'activity', 'target', 'outcome'）
 * @param index - インデックス（0, 1, 2）
 * @returns グラフ用データ配列（year, 実績値）
 *
 * nullの値は除外される（グラフに表示しない）
 */
export function toIndicatorChartData(
  indicators: YearlyIndicator[],
  category: keyof Pick<YearlyIndicator, 'activity' | 'target' | 'outcome'>,
  index: number
): Array<{ year: string; 実績値: number }> {
  return indicators
    .map((indicator) => {
      const categoryData = indicator[category];
      const value = Array.isArray(categoryData) ? categoryData[index] : null;

      if (value === null || value === undefined) {
        return null;
      }

      return {
        year: formatFiscalYear(indicator.year),
        実績値: value,
      };
    })
    .filter((item): item is { year: string; 実績値: number } => item !== null);
}

/**
 * 指定カテゴリ・インデックスに有効なデータが存在するか判定
 * @param indicators - 指標データ配列
 * @param category - カテゴリ（'activity', 'target', 'outcome'）
 * @param index - インデックス（0, 1, 2）
 * @returns 有効なデータが1つ以上存在する場合はtrue
 */
export function hasValidIndicatorData(
  indicators: YearlyIndicator[],
  category: keyof Pick<YearlyIndicator, 'activity' | 'target' | 'outcome'>,
  index: number
): boolean {
  return toIndicatorChartData(indicators, category, index).length > 0;
}

/**
 * CategoryStats配列を政策別予算グラフ用データに変換（横棒グラフ用）
 * @param policyStats - 政策別統計データ配列
 * @returns グラフ用データ配列（name, value, count）、予算降順ソート
 */
export function toPolicyBudgetChartData(
  policyStats: CategoryStats[]
): Array<{ name: string; value: number; count: number }> {
  return policyStats
    .map((stats) => ({
      name: stats.name,
      value: stats.budget,
      count: stats.count,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * CategoryStats配列を事業区分別グラフ用データに変換（横棒グラフ用）
 * @param categoryStats - 事業区分別統計データ配列
 * @returns グラフ用データ配列（name, value, count）、予算降順ソート
 */
export function toCategoryChartData(
  categoryStats: CategoryStats[]
): Array<{ name: string; value: number; count: number }> {
  return categoryStats
    .map((stats) => ({
      name: stats.name,
      value: stats.budget,
      count: stats.count,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * EvaluationCategoryCount配列を評価グラフ用データに変換（横棒グラフ用）
 * @param evaluationCounts - 評価カテゴリ別件数データ配列
 * @returns グラフ用データ配列（name, value）、件数降順ソート
 */
export function toEvaluationChartData(
  evaluationCounts: EvaluationCategoryCount[]
): Array<{ name: string; value: number }> {
  return evaluationCounts
    .map((evaluation) => ({
      name: evaluation.name,
      value: evaluation.count,
    }))
    .sort((a, b) => b.value - a.value);
}
