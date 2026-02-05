/**
 * ProjectFilterコンポーネント
 *
 * 事業一覧のフィルターパネルを提供します。
 */

import { Select, type SelectOption } from '@/components/ui/Select';
import type { FilterParams } from '@/lib/filter';

export interface ProjectFilterProps {
  /** 現在のフィルター状態 */
  filters: FilterParams;
  /** フィルター変更時のコールバック */
  onFilterChange: (filters: Partial<FilterParams>) => void;
  /** リセット時のコールバック */
  onReset: () => void;
  /** 政策の選択肢（件数付き） */
  policies: SelectOption[];
  /** 施策の選択肢（件数付き） */
  measures: SelectOption[];
  /** 基本事業の選択肢（件数付き） */
  basicProjects: SelectOption[];
  /** 部署の選択肢（件数付き） */
  departments: SelectOption[];
  /** 事業区分の選択肢（件数付き） */
  categories: SelectOption[];
}

/**
 * フィルターパネルコンポーネント
 */
export function ProjectFilter({
  filters,
  onFilterChange,
  onReset,
  policies,
  measures,
  basicProjects,
  departments,
  categories,
}: ProjectFilterProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">フィルター</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          リセット
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* 政策フィルター */}
        <Select
          id="policy-filter"
          label="政策"
          options={policies}
          value={filters.policy || ''}
          onChange={(value) => onFilterChange({ policy: value })}
        />

        {/* 施策フィルター */}
        <Select
          id="measure-filter"
          label="施策"
          options={measures}
          value={filters.measure || ''}
          onChange={(value) => onFilterChange({ measure: value })}
          disabled={measures.length === 0}
        />

        {/* 基本事業フィルター */}
        <Select
          id="basic-project-filter"
          label="基本事業"
          options={basicProjects}
          value={filters.basicProject || ''}
          onChange={(value) => onFilterChange({ basicProject: value })}
          disabled={basicProjects.length === 0}
        />

        {/* 部署フィルター */}
        <Select
          id="department-filter"
          label="部署"
          options={departments}
          value={filters.department || ''}
          onChange={(value) => onFilterChange({ department: value })}
        />

        {/* 事業区分フィルター */}
        <Select
          id="category-filter"
          label="事業区分"
          options={categories}
          value={filters.category || ''}
          onChange={(value) => onFilterChange({ category: value })}
        />
      </div>
    </div>
  );
}
