/**
 * ホームページコンテンツ（Client Component）
 *
 * 大船渡市の事務事業評価データの概要を表示するClient Componentです。
 * FormattedAmountコンポーネント（Context依存）を使用するため、Client Componentとして実装されています。
 *
 * @param {DatasetStats} stats - データセットの統計情報
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { FormattedAmount } from '@/components/ui/FormattedAmount';
import PolicyBudgetChart from '@/components/charts/PolicyBudgetChart';
import CategoryChart from '@/components/charts/CategoryChart';
import { SortableStatsTable } from './SortableStatsTable';
import type { DatasetStats } from '@/types';

interface HomeContentProps {
  stats: DatasetStats;
}

export function HomeContent({ stats }: HomeContentProps) {
  const [showPolicyDetails, setShowPolicyDetails] = useState(false);
  const [showCategoryDetails, setShowCategoryDetails] = useState(false);

  return (
    <div className="space-y-8">
      {/* ページタイトル */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          事務事業評価データ 概要ダッシュボード
        </h1>
        <p className="mt-2 text-gray-600">
          大船渡市の事務事業評価データの概要を表示しています。
        </p>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="総事業数">
          <div className="text-4xl font-bold text-blue-600">
            {stats.totalProjects.toLocaleString()}
          </div>
          <div className="mt-2 text-sm text-gray-600">件の事務事業</div>
        </Card>

        <Card title="総予算（最新年度）">
          <div className="text-4xl font-bold text-green-600">
            <FormattedAmount amount={stats.totalBudget} />
          </div>
          <div className="mt-2 text-sm text-gray-600">トータルコスト合計</div>
        </Card>

        <Card title="政策数">
          <div className="text-4xl font-bold text-purple-600">
            {stats.policyCount.toLocaleString()}
          </div>
          <div className="mt-2 text-sm text-gray-600">政策項目</div>
        </Card>

        <Card title="平均事業予算">
          <div className="text-4xl font-bold text-orange-600">
            <FormattedAmount amount={stats.averageBudget} />
          </div>
          <div className="mt-2 text-sm text-gray-600">1事業あたり</div>
        </Card>
      </div>

      {/* 政策別予算配分グラフ */}
      <div className="space-y-4">
        <PolicyBudgetChart policyStats={stats.projectsByPolicy} />

        {/* 詳細テーブル（アコーディオン） */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <button
            onClick={() => setShowPolicyDetails(!showPolicyDetails)}
            className="w-full flex items-center justify-between text-left font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            aria-expanded={showPolicyDetails}
          >
            <span>詳細を表示</span>
            <span className="text-2xl">{showPolicyDetails ? '−' : '+'}</span>
          </button>

          {showPolicyDetails && (
            <div className="mt-4 border-t pt-4">
              <SortableStatsTable
                data={stats.projectsByPolicy}
                caption="政策別事業数・予算の詳細テーブル"
              />
            </div>
          )}
        </div>
      </div>

      {/* 事業区分別予算配分グラフ */}
      <div className="space-y-4">
        <CategoryChart categoryStats={stats.projectsByCategory} />

        {/* 詳細テーブル（アコーディオン） */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <button
            onClick={() => setShowCategoryDetails(!showCategoryDetails)}
            className="w-full flex items-center justify-between text-left font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            aria-expanded={showCategoryDetails}
          >
            <span>詳細を表示</span>
            <span className="text-2xl">{showCategoryDetails ? '−' : '+'}</span>
          </button>

          {showCategoryDetails && (
            <div className="mt-4 border-t pt-4">
              <SortableStatsTable
                data={stats.projectsByCategory}
                caption="事業区分別事業数・予算の詳細テーブル"
              />
            </div>
          )}
        </div>
      </div>

      {/* 事業一覧へのリンク */}
      <div className="text-center">
        <Link
          href="/projects"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          事業一覧を見る
        </Link>
      </div>

      {/* データ更新日時 */}
      <div className="text-center text-sm text-gray-500">
        データ生成日時: {new Date(stats.generatedAt).toLocaleString('ja-JP')}
      </div>
    </div>
  );
}
