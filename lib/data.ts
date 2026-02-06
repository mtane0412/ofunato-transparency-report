/**
 * データアクセスライブラリ
 *
 * JSONファイルから事務事業データを読み込む関数を提供します。
 */

import projectsData from '@/data/projects.json';
import type {
  DatasetStats,
  EvaluationBreakdown,
  EvaluationCategoryCount,
  Project,
  ProjectDataset,
} from '@/types';

/**
 * 評価値を正規化する
 * 不正データ（数字のみ）を「その他・未設定」に変換
 *
 * @param value - 評価値
 * @returns 正規化された評価値
 */
export function normalizeEvaluationValue(value: string): string {
  return /^[0-9]+$/.test(value) || value === '' ? 'その他・未設定' : value;
}

/**
 * 評価フィールドを集計する
 *
 * @param projects - 事業データ一覧
 * @param fieldName - 集計対象フィールド名（'direction' または 'futureDirection'）
 * @returns カテゴリ別件数の配列（名前順ソート）
 */
function aggregateEvaluationField(
  projects: Project[],
  fieldName: 'direction' | 'futureDirection'
): EvaluationCategoryCount[] {
  const countMap = new Map<string, number>();

  projects.forEach((project) => {
    const value = project.evaluation[fieldName];
    const normalizedValue = normalizeEvaluationValue(value);
    countMap.set(normalizedValue, (countMap.get(normalizedValue) || 0) + 1);
  });

  // 名前順ソート（先頭の数字「１」「２」「３」で自然順）
  return Array.from(countMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * 全事業データを取得
 */
export function getAllProjects(): Project[] {
  const dataset = projectsData as ProjectDataset;
  return dataset.projects;
}

/**
 * IDで事業データを取得
 */
export function getProjectById(id: string): Project | undefined {
  const projects = getAllProjects();
  return projects.find((project) => project.id === id);
}

/**
 * 政策体系の一覧を取得（重複を除く）
 */
export function getAllPolicies(): Array<{ id: string; name: string }> {
  const projects = getAllProjects();
  const policyMap = new Map<string, string>();

  projects.forEach((project) => {
    policyMap.set(project.policy.id, project.policy.name);
  });

  return Array.from(policyMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * 施策の一覧を取得（重複を除く）
 */
export function getAllMeasures(): Array<{ id: string; name: string }> {
  const projects = getAllProjects();
  const measureMap = new Map<string, string>();

  projects.forEach((project) => {
    measureMap.set(project.measure.id, project.measure.name);
  });

  return Array.from(measureMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * 基本事業の一覧を取得（重複を除く）
 */
export function getAllBasicProjects(): Array<{ id: string; name: string }> {
  const projects = getAllProjects();
  const basicProjectMap = new Map<string, string>();

  projects.forEach((project) => {
    basicProjectMap.set(project.basicProject.id, project.basicProject.name);
  });

  return Array.from(basicProjectMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * 部署の一覧を取得（重複を除く）
 */
export function getAllDepartments(): string[] {
  const projects = getAllProjects();
  const departments = new Set<string>();

  projects.forEach((project) => {
    if (project.department) {
      departments.add(project.department);
    }
  });

  return Array.from(departments).sort((a, b) => a.localeCompare(b));
}

/**
 * 事業区分の一覧を取得（重複を除く）
 */
export function getAllCategories(): string[] {
  const projects = getAllProjects();
  const categories = new Set<string>();

  projects.forEach((project) => {
    if (project.category) {
      categories.add(project.category);
    }
  });

  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

/**
 * 改革改善の方向性の一覧を取得（重複を除く、正規化済み）
 */
export function getAllDirections(): string[] {
  const projects = getAllProjects();
  const directions = new Set<string>();

  projects.forEach((project) => {
    const normalized = normalizeEvaluationValue(project.evaluation.direction);
    if (normalized) {
      directions.add(normalized);
    }
  });

  return Array.from(directions).sort((a, b) => a.localeCompare(b));
}

/**
 * 今後の方向性の一覧を取得（重複を除く、正規化済み）
 */
export function getAllFutureDirections(): string[] {
  const projects = getAllProjects();
  const futureDirections = new Set<string>();

  projects.forEach((project) => {
    const normalized = normalizeEvaluationValue(project.evaluation.futureDirection);
    if (normalized) {
      futureDirections.add(normalized);
    }
  });

  return Array.from(futureDirections).sort((a, b) => a.localeCompare(b));
}

/**
 * データセット全体の統計情報を取得
 */
export function getDatasetStats(): DatasetStats {
  const projects = getAllProjects();
  const dataset = projectsData as ProjectDataset;

  // 総予算を計算（最新年度のトータルコストを合計）
  const totalBudget = projects.reduce((sum, project) => {
    // 年度が最新のものを選択
    const latestFinancial = project.financials.find((f) => f.year === project.year);
    return sum + (latestFinancial?.grandTotal || 0);
  }, 0);

  // 政策別事業数・予算を集計（policy.idベースでグルーピング）
  // ステップ1: 各政策IDごとに名前の出現回数をカウント
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

  // ステップ3: 政策別の事業数・予算・方向性内訳を集計
  const projectsByPolicyMap = new Map<
    string,
    {
      id: string;
      name: string;
      count: number;
      budget: number;
      directionBreakdown: EvaluationBreakdown;
      futureDirectionBreakdown: EvaluationBreakdown;
    }
  >();
  projects.forEach((project) => {
    const policyId = project.policy.id;
    const mostFrequentName = policyMostFrequentNameMap.get(policyId) || project.policy.name;
    const existing = projectsByPolicyMap.get(policyId) || {
      id: policyId,
      name: mostFrequentName,
      count: 0,
      budget: 0,
      directionBreakdown: {},
      futureDirectionBreakdown: {},
    };

    // 最新年度の予算を取得
    const latestFinancial = project.financials.find((f) => f.year === project.year);

    // 方向性内訳を更新
    const direction = normalizeEvaluationValue(project.evaluation.direction);
    const futureDirection = normalizeEvaluationValue(project.evaluation.futureDirection);
    const newDirectionBreakdown = { ...existing.directionBreakdown };
    const newFutureDirectionBreakdown = { ...existing.futureDirectionBreakdown };
    newDirectionBreakdown[direction] = (newDirectionBreakdown[direction] || 0) + 1;
    newFutureDirectionBreakdown[futureDirection] =
      (newFutureDirectionBreakdown[futureDirection] || 0) + 1;

    projectsByPolicyMap.set(policyId, {
      ...existing,
      count: existing.count + 1,
      budget: existing.budget + (latestFinancial?.grandTotal || 0),
      directionBreakdown: newDirectionBreakdown,
      futureDirectionBreakdown: newFutureDirectionBreakdown,
    });
  });

  // 事業区分別事業数・予算・方向性内訳を集計
  const projectsByCategoryMap = new Map<
    string,
    {
      name: string;
      count: number;
      budget: number;
      directionBreakdown: EvaluationBreakdown;
      futureDirectionBreakdown: EvaluationBreakdown;
    }
  >();
  projects.forEach((project) => {
    const category = project.category;
    const existing = projectsByCategoryMap.get(category) || {
      name: category,
      count: 0,
      budget: 0,
      directionBreakdown: {},
      futureDirectionBreakdown: {},
    };

    // 最新年度の予算を取得
    const latestFinancial = project.financials.find((f) => f.year === project.year);

    // 方向性内訳を更新
    const direction = normalizeEvaluationValue(project.evaluation.direction);
    const futureDirection = normalizeEvaluationValue(project.evaluation.futureDirection);
    const newDirectionBreakdown = { ...existing.directionBreakdown };
    const newFutureDirectionBreakdown = { ...existing.futureDirectionBreakdown };
    newDirectionBreakdown[direction] = (newDirectionBreakdown[direction] || 0) + 1;
    newFutureDirectionBreakdown[futureDirection] =
      (newFutureDirectionBreakdown[futureDirection] || 0) + 1;

    projectsByCategoryMap.set(category, {
      ...existing,
      count: existing.count + 1,
      budget: existing.budget + (latestFinancial?.grandTotal || 0),
      directionBreakdown: newDirectionBreakdown,
      futureDirectionBreakdown: newFutureDirectionBreakdown,
    });
  });

  // 政策別データをID順にソート
  const projectsByPolicy = Array.from(projectsByPolicyMap.values())
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(({ name, count, budget, directionBreakdown, futureDirectionBreakdown }) => ({
      name,
      count,
      budget,
      directionBreakdown,
      futureDirectionBreakdown,
    }));

  // 事業区分別データ
  const projectsByCategory = Array.from(projectsByCategoryMap.values()).map(
    ({ name, count, budget, directionBreakdown, futureDirectionBreakdown }) => ({
      name,
      count,
      budget,
      directionBreakdown,
      futureDirectionBreakdown,
    })
  );

  // 追加指標の計算
  const policyCount = projectsByPolicyMap.size;
  const categoryCount = projectsByCategoryMap.size;
  const averageBudget = Math.round(totalBudget / dataset.totalCount);

  // 評価情報の集計
  const directionCounts = aggregateEvaluationField(projects, 'direction');
  const futureDirectionCounts = aggregateEvaluationField(projects, 'futureDirection');

  return {
    totalProjects: dataset.totalCount,
    totalBudget,
    generatedAt: dataset.generatedAt,
    projectsByPolicy,
    projectsByCategory,
    policyCount,
    categoryCount,
    averageBudget,
    evaluationStats: {
      directionCounts,
      futureDirectionCounts,
    },
  };
}
