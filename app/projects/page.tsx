/**
 * 事業一覧・検索ページ
 *
 * すべての事務事業をテーブル形式で表示します。
 * フィルター機能により、政策・部署・事業区分で絞り込みが可能です。
 */

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { getAllProjects } from '@/lib/data';
import { formatThousandYen } from '@/lib/utils';

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">事業一覧</h1>
        <p className="mt-2 text-gray-600">
          全{projects.length}件の事務事業を表示しています。
        </p>
      </div>

      {/* 事業一覧テーブル */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  事業名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  政策
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  部署
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  事業区分
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  予算（最新年度）
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => {
                // 最新年度の財政データを取得
                const latestFinancial = project.financials.find(
                  (f) => f.year === project.year
                );

                return (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {project.policy.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {project.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {project.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {latestFinancial
                        ? formatThousandYen(latestFinancial.grandTotal)
                        : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ページネーションの注記 */}
      <div className="text-center text-sm text-gray-500">
        ※ 現在はすべての事業を表示しています。フィルターとページネーションは今後実装予定です。
      </div>
    </div>
  );
}
