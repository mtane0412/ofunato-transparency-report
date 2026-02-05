/**
 * ProjectFilterコンポーネント
 *
 * 事業一覧のフィルターパネルを提供します。
 */

'use client';

import { useState, useEffect } from 'react';
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
  /** 改革改善の方向性の選択肢（件数付き） */
  directions: SelectOption[];
  /** 今後の方向性の選択肢（件数付き） */
  futureDirections: SelectOption[];
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
  directions,
  futureDirections,
}: ProjectFilterProps) {
  // キーワード検索のローカル状態（Enter押下時に反映）
  const [localKeyword, setLocalKeyword] = useState(filters.q || '');
  // IME変換中かどうかを追跡（日本語入力対応）
  const [isComposing, setIsComposing] = useState(false);

  // filtersのqが外部から変更された場合、ローカル状態も同期する（リセット時など）
  useEffect(() => {
    setLocalKeyword(filters.q || '');
  }, [filters.q]);

  // キーワード入力変更ハンドラ
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const oldValue = localKeyword;

    setLocalKeyword(newValue);

    // IME変換中は処理をスキップ（日本語入力のバグ防止）
    if (isComposing) {
      return;
    }

    // 文字が削除された場合（入力値が短くなった場合）は即座に反映
    if (newValue.length < oldValue.length) {
      onFilterChange({ q: newValue || undefined });
    }
  };

  // Enterキー押下時にフィルターを適用
  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      onFilterChange({ q: localKeyword || undefined });
    }
  };

  // IME変換開始
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // IME変換終了
  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

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

      {/* キーワード検索 */}
      <div className="mb-4">
        <label htmlFor="keyword-search" className="mb-1 block text-sm font-medium text-gray-700">
          キーワード検索
        </label>
        <input
          id="keyword-search"
          type="text"
          value={localKeyword}
          onChange={handleKeywordChange}
          onKeyDown={handleKeywordKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder="事業名で検索...（Enterで適用 / 削除は自動反映）"
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
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

        {/* 改革改善の方向性フィルター */}
        <Select
          id="direction-filter"
          label="改革改善の方向性"
          options={directions}
          value={filters.direction || ''}
          onChange={(value) => onFilterChange({ direction: value })}
        />

        {/* 今後の方向性フィルター */}
        <Select
          id="future-direction-filter"
          label="今後の方向性"
          options={futureDirections}
          value={filters.futureDirection || ''}
          onChange={(value) => onFilterChange({ futureDirection: value })}
        />
      </div>
    </div>
  );
}
