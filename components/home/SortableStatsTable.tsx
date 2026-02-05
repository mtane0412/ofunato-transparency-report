/**
 * ソート可能な統計テーブルコンポーネント
 * 政策別・事業区分別の詳細データをソート可能なテーブルで表示
 */

'use client';

import { useState } from 'react';
import { FormattedAmount } from '@/components/ui/FormattedAmount';
import type { CategoryStats } from '@/types';

type SortKey = 'name' | 'count' | 'budget';
type SortOrder = 'asc' | 'desc';

interface SortableStatsTableProps {
  /** 統計データ */
  data: CategoryStats[];
  /** テーブルのキャプション */
  caption?: string;
}

/**
 * ソート可能な統計テーブル
 * 名前・件数・予算でソート可能
 */
export function SortableStatsTable({
  data,
  caption,
}: SortableStatsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('budget');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // ソート処理
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // 同じキーをクリックした場合は昇順/降順を切り替え
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 異なるキーをクリックした場合は新しいキーで降順
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  // データをソート
  const sortedData = [...data].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    if (sortKey === 'name') {
      aValue = a.name;
      bValue = b.name;
    } else if (sortKey === 'count') {
      aValue = a.count;
      bValue = b.count;
    } else {
      aValue = a.budget;
      bValue = b.budget;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortOrder === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  // ソートインジケーター
  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) {
      return <span className="text-gray-400 ml-1">↕</span>;
    }
    return (
      <span className="text-blue-600 ml-1">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        {caption && (
          <caption className="sr-only">{caption}</caption>
        )}
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('name')}
            >
              名称
              <SortIndicator column="name" />
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('count')}
            >
              事業数
              <SortIndicator column="count" />
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('budget')}
            >
              予算
              <SortIndicator column="budget" />
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((item) => (
            <tr key={item.name} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600 font-medium">
                {item.count.toLocaleString()}件
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                <FormattedAmount amount={item.budget} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
