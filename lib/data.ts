/**
 * データアクセスライブラリ
 *
 * JSONファイルから事務事業データを読み込む関数を提供します。
 */

import type { Project, ProjectDataset } from '@/types';
import projectsData from '@/data/projects.json';

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

  return Array.from(departments).sort();
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

  return Array.from(categories).sort();
}

/**
 * データセット全体の統計情報を取得
 */
export function getDatasetStats() {
  const projects = getAllProjects();
  const dataset = projectsData as ProjectDataset;

  // 総予算を計算（最新年度のトータルコストを合計）
  const totalBudget = projects.reduce((sum, project) => {
    // 年度が最新のものを選択
    const latestFinancial = project.financials.find(
      (f) => f.year === project.year
    );
    return sum + (latestFinancial?.grandTotal || 0);
  }, 0);

  // 政策別事業数を集計
  const projectsByPolicy = new Map<string, number>();
  projects.forEach((project) => {
    const count = projectsByPolicy.get(project.policy.name) || 0;
    projectsByPolicy.set(project.policy.name, count + 1);
  });

  // 事業区分別事業数を集計
  const projectsByCategory = new Map<string, number>();
  projects.forEach((project) => {
    const count = projectsByCategory.get(project.category) || 0;
    projectsByCategory.set(project.category, count + 1);
  });

  return {
    totalProjects: dataset.totalCount,
    totalBudget,
    generatedAt: dataset.generatedAt,
    projectsByPolicy: Array.from(projectsByPolicy.entries()).map(
      ([name, count]) => ({ name, count })
    ),
    projectsByCategory: Array.from(projectsByCategory.entries()).map(
      ([name, count]) => ({ name, count })
    ),
  };
}
