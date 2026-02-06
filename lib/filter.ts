/**
 * フィルタリングロジック
 *
 * 事業データのフィルタリング機能とカスケード選択肢の取得機能を提供します。
 */

import { normalizeEvaluationValue } from '@/lib/data';
import type { Project } from '@/types';

/**
 * フィルターパラメータ
 */
export interface FilterParams {
  /** キーワード検索（事業名の部分一致） */
  q?: string;
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
  /** 改革改善の方向性 */
  direction?: string;
  /** 今後の方向性 */
  futureDirection?: string;
}

/**
 * 事業データをフィルタリングする
 *
 * @param projects - フィルタリング対象の事業データ配列
 * @param params - フィルターパラメータ
 * @returns フィルタリング後の事業データ配列
 */
export function filterProjects(projects: Project[], params: FilterParams): Project[] {
  return projects.filter((project) => {
    // キーワード検索（事業名の部分一致、大文字小文字区別なし）
    if (params.q && !project.name.toLowerCase().includes(params.q.toLowerCase())) {
      return false;
    }

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

    // 改革改善の方向性でフィルタリング（正規化後の値で比較）
    if (
      params.direction &&
      normalizeEvaluationValue(project.evaluation.direction) !== params.direction
    ) {
      return false;
    }

    // 今後の方向性でフィルタリング（正規化後の値で比較）
    if (
      params.futureDirection &&
      normalizeEvaluationValue(project.evaluation.futureDirection) !== params.futureDirection
    ) {
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

/**
 * フィルターオプションの件数情報
 */
export interface FilterOptionCounts {
  /** 政策ごとの件数 */
  policies: Map<string, number>;
  /** 施策ごとの件数 */
  measures: Map<string, number>;
  /** 基本事業ごとの件数 */
  basicProjects: Map<string, number>;
  /** 部署ごとの件数 */
  departments: Map<string, number>;
  /** 事業区分ごとの件数 */
  categories: Map<string, number>;
  /** 改革改善の方向性ごとの件数 */
  directions: Map<string, number>;
  /** 今後の方向性ごとの件数 */
  futureDirections: Map<string, number>;
}

/**
 * フィルターオプションごとの件数を取得
 *
 * 現在のフィルター条件に基づいて、各選択肢に該当する事業数をカウントします。
 * これにより、0件の選択肢を無効化したり、件数をラベルに表示できます。
 *
 * @param projects - 対象の事業データ配列
 * @param currentFilters - 現在適用中のフィルター条件
 * @returns 各フィルターオプションの件数
 */
export function getFilterOptionCounts(
  projects: Project[],
  currentFilters: FilterParams
): FilterOptionCounts {
  const counts: FilterOptionCounts = {
    policies: new Map(),
    measures: new Map(),
    basicProjects: new Map(),
    departments: new Map(),
    categories: new Map(),
    directions: new Map(),
    futureDirections: new Map(),
  };

  // 現在のフィルター条件から各フィルターを除外したものを作成
  const { policy: _p, ...filtersWithoutPolicy } = currentFilters;
  const { measure: _m, ...filtersWithoutMeasure } = currentFilters;
  const { basicProject: _bp, ...filtersWithoutBasicProject } = currentFilters;
  const { department: _d, ...filtersWithoutDepartment } = currentFilters;
  const { category: _c, ...filtersWithoutCategory } = currentFilters;
  const { direction: _dir, ...filtersWithoutDirection } = currentFilters;
  const { futureDirection: _fdir, ...filtersWithoutFutureDirection } = currentFilters;

  // 各選択肢について、その選択肢を適用した場合の件数をカウント
  projects.forEach((project) => {
    // 政策の件数（政策以外のフィルターを適用）
    if (filterProjects([project], filtersWithoutPolicy).length > 0) {
      counts.policies.set(project.policy.id, (counts.policies.get(project.policy.id) || 0) + 1);
    }

    // 施策の件数（施策以外のフィルターを適用）
    if (filterProjects([project], filtersWithoutMeasure).length > 0) {
      counts.measures.set(project.measure.id, (counts.measures.get(project.measure.id) || 0) + 1);
    }

    // 基本事業の件数（基本事業以外のフィルターを適用）
    if (filterProjects([project], filtersWithoutBasicProject).length > 0) {
      counts.basicProjects.set(
        project.basicProject.id,
        (counts.basicProjects.get(project.basicProject.id) || 0) + 1
      );
    }

    // 部署の件数（部署以外のフィルターを適用）
    if (filterProjects([project], filtersWithoutDepartment).length > 0) {
      counts.departments.set(
        project.department,
        (counts.departments.get(project.department) || 0) + 1
      );
    }

    // 事業区分の件数（事業区分以外のフィルターを適用）
    if (filterProjects([project], filtersWithoutCategory).length > 0) {
      counts.categories.set(project.category, (counts.categories.get(project.category) || 0) + 1);
    }

    // 改革改善の方向性の件数（方向性以外のフィルターを適用）
    if (filterProjects([project], filtersWithoutDirection).length > 0) {
      const normalizedDirection = normalizeEvaluationValue(project.evaluation.direction);
      counts.directions.set(
        normalizedDirection,
        (counts.directions.get(normalizedDirection) || 0) + 1
      );
    }

    // 今後の方向性の件数（今後の方向性以外のフィルターを適用）
    if (filterProjects([project], filtersWithoutFutureDirection).length > 0) {
      const normalizedFutureDirection = normalizeEvaluationValue(
        project.evaluation.futureDirection
      );
      counts.futureDirections.set(
        normalizedFutureDirection,
        (counts.futureDirections.get(normalizedFutureDirection) || 0) + 1
      );
    }
  });

  return counts;
}
