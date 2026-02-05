/**
 * フィルタリングロジック
 *
 * 事業データのフィルタリング機能とカスケード選択肢の取得機能を提供します。
 */

import type { Project } from '@/types';

/**
 * フィルターパラメータ
 */
export interface FilterParams {
  /** 政策ID */
  policy?: string;
  /** 施策ID */
  measure?: string;
  /** 基本事業ID */
  basicProject?: string;
  /** 部署名 */
  department?: string;
  /** 事業区分 */
  category?: string;
}

/**
 * 事業データをフィルタリングする
 *
 * @param projects - フィルタリング対象の事業データ配列
 * @param params - フィルターパラメータ
 * @returns フィルタリング後の事業データ配列
 */
export function filterProjects(
  projects: Project[],
  params: FilterParams
): Project[] {
  return projects.filter((project) => {
    // 政策でフィルタリング
    if (params.policy && project.policy.id !== params.policy) {
      return false;
    }

    // 施策でフィルタリング
    if (params.measure && project.measure.id !== params.measure) {
      return false;
    }

    // 基本事業でフィルタリング
    if (params.basicProject && project.basicProject.id !== params.basicProject) {
      return false;
    }

    // 部署でフィルタリング
    if (params.department && project.department !== params.department) {
      return false;
    }

    // 事業区分でフィルタリング
    if (params.category && project.category !== params.category) {
      return false;
    }

    return true;
  });
}

/**
 * 利用可能な施策の一覧を取得（政策でフィルタリング）
 *
 * @param projects - 対象の事業データ配列
 * @param policyId - 政策ID（指定した場合、その政策に属する施策のみを返す）
 * @returns 施策の一覧（重複除去、ID順ソート）
 */
export function getAvailableMeasures(
  projects: Project[],
  policyId?: string
): Array<{ id: string; name: string }> {
  // 政策でフィルタリング
  const filteredProjects = policyId
    ? projects.filter((project) => project.policy.id === policyId)
    : projects;

  // 施策を重複除去してマップ化
  const measureMap = new Map<string, string>();
  filteredProjects.forEach((project) => {
    measureMap.set(project.measure.id, project.measure.name);
  });

  // ID順でソート
  return Array.from(measureMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * 利用可能な基本事業の一覧を取得（施策でフィルタリング）
 *
 * @param projects - 対象の事業データ配列
 * @param measureId - 施策ID（指定した場合、その施策に属する基本事業のみを返す）
 * @returns 基本事業の一覧（重複除去、ID順ソート）
 */
export function getAvailableBasicProjects(
  projects: Project[],
  measureId?: string
): Array<{ id: string; name: string }> {
  // 施策でフィルタリング
  const filteredProjects = measureId
    ? projects.filter((project) => project.measure.id === measureId)
    : projects;

  // 基本事業を重複除去してマップ化
  const basicProjectMap = new Map<string, string>();
  filteredProjects.forEach((project) => {
    basicProjectMap.set(project.basicProject.id, project.basicProject.name);
  });

  // ID順でソート
  return Array.from(basicProjectMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.id.localeCompare(b.id));
}
