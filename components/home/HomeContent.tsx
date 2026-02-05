/**
 * ホームページコンテンツ（Client Component）
 *
 * 大船渡市の事務事業評価データの概要を表示するClient Componentです。
 * FormattedAmountコンポーネント（Context依存）を使用するため、Client Componentとして実装されています。
 *
 * @param {DatasetStats} stats - データセットの統計情報
 */

'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { FormattedAmount } from '@/components/ui/FormattedAmount';
import type { DatasetStats } from '@/types';

interface HomeContentProps {
  stats: DatasetStats;
}

export function HomeContent({ stats }: HomeContentProps) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      {/* 政策別事業数 */}
      <Card title="政策別事業数">
        <div className="space-y-2">
          {stats.projectsByPolicy.map((item: { name: string; count: number }) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
            >
              <span className="text-gray-800">{item.name}</span>
              <span className="font-bold text-blue-600">{item.count}件</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 事業区分別事業数 */}
      <Card title="事業区分別事業数">
        <div className="space-y-2">
          {stats.projectsByCategory.map((item: { name: string; count: number }) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
            >
              <span className="text-gray-800">{item.name}</span>
              <span className="font-bold text-green-600">{item.count}件</span>
            </div>
          ))}
        </div>
      </Card>

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
