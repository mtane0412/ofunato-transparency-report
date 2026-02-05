/**
 * 事業一覧・検索ページ
 *
 * すべての事務事業をテーブル形式で表示します。
 * フィルター機能により、政策・施策・基本事業・部署・事業区分で絞り込みが可能です。
 */

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useMemo, Suspense } from 'react';
import {
  getAllProjects,
  getAllPolicies,
  getAllMeasures,
  getAllBasicProjects,
  getAllDepartments,
  getAllCategories,
} from '@/lib/data';
import {
  filterProjects,
  getAvailableMeasures,
  getAvailableBasicProjects,
  type FilterParams,
} from '@/lib/filter';
import { ProjectFilter } from '@/components/projects/ProjectFilter';
import { ProjectTable } from '@/components/projects/ProjectTable';

/**
 * フィルター機能付き事業一覧コンポーネント
 */
function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLパラメータからフィルター状態を取得
  const filters: FilterParams = useMemo(
    () => ({
      policy: searchParams.get('policy') || undefined,
      measure: searchParams.get('measure') || undefined,
      basicProject: searchParams.get('basicProject') || undefined,
      department: searchParams.get('department') || undefined,
      category: searchParams.get('category') || undefined,
    }),
    [searchParams]
  );

  // 全データを取得
  const allProjects = useMemo(() => getAllProjects(), []);

  // フィルタリング後のデータ
  const filteredProjects = useMemo(
    () => filterProjects(allProjects, filters),
    [allProjects, filters]
  );

  // 選択肢データの取得
  const policies = useMemo(() => getAllPolicies(), []);
  const allMeasures = useMemo(() => getAllMeasures(), []);
  const allBasicProjects = useMemo(() => getAllBasicProjects(), []);
  const departments = useMemo(() => getAllDepartments(), []);
  const categories = useMemo(() => getAllCategories(), []);

  // カスケードフィルターの選択肢を取得
  const availableMeasures = useMemo(
    () => getAvailableMeasures(allProjects, filters.policy),
    [allProjects, filters.policy]
  );

  const availableBasicProjects = useMemo(
    () => getAvailableBasicProjects(allProjects, filters.measure),
    [allProjects, filters.measure]
  );

  // フィルター変更ハンドラ
  const handleFilterChange = useCallback(
    (newFilters: Partial<FilterParams>) => {
      const params = new URLSearchParams(searchParams.toString());

      // 新しいフィルター値を設定
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // カスケードフィルターのリセット処理
      // 政策を変更した場合、施策と基本事業をリセット
      if ('policy' in newFilters) {
        params.delete('measure');
        params.delete('basicProject');
      }
      // 施策を変更した場合、基本事業をリセット
      if ('measure' in newFilters) {
        params.delete('basicProject');
      }

      router.push(`/projects?${params.toString()}`);
    },
    [searchParams, router]
  );

  // フィルターリセットハンドラ
  const handleReset = useCallback(() => {
    router.push('/projects');
  }, [router]);

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">事業一覧</h1>
        <p className="mt-2 text-gray-600">
          全{allProjects.length}件中、{filteredProjects.length}
          件の事務事業を表示しています。
        </p>
      </div>

      {/* フィルターパネル */}
      <ProjectFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        policies={policies}
        measures={filters.policy ? availableMeasures : allMeasures}
        basicProjects={filters.measure ? availableBasicProjects : allBasicProjects}
        departments={departments}
        categories={categories}
      />

      {/* 事業一覧テーブル */}
      <ProjectTable projects={filteredProjects} />
    </div>
  );
}

/**
 * 事業一覧ページ（Suspenseでラップ）
 */
export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">読み込み中...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
