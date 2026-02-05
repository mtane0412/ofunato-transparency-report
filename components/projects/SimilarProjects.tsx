/**
 * 類似事業表示コンポーネント
 *
 * 事業詳細ページの最下部に、類似度の高い事業を表示します。
 */

import React from 'react';
import Link from 'next/link';
import type { SimilarProjectDisplay } from '@/types/similarity';
import { FormattedAmount } from '../ui/FormattedAmount';

export type SimilarProjectsProps = {
  /** 類似事業のリスト */
  projects: SimilarProjectDisplay[];
};

/**
 * 類似事業表示コンポーネント
 */
export function SimilarProjects({
  projects,
}: SimilarProjectsProps): React.ReactElement | null {
  // 類似事業がない場合は何も表示しない
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4">類似している事業</h2>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* ヘッダー: 事業名と類似度スコア */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-lg font-semibold text-blue-700 hover:underline">
                {project.name}
              </h3>
              <span className="shrink-0 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                {Math.round(project.score * 100)}%
              </span>
            </div>

            {/* 政策・施策情報 */}
            <p className="text-sm text-gray-600 mb-2">
              {project.policyName} &gt; {project.measureName}
            </p>

            {/* 部署名と予算 */}
            <div className="flex items-center gap-4 text-sm text-gray-700">
              <span>{project.department}</span>
              <span className="text-gray-400">|</span>
              <span>
                <FormattedAmount amount={project.totalCost} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
