/**
 * ProjectTableコンポーネント
 *
 * 事業一覧をテーブル形式で表示します。
 */

import Link from 'next/link';
import { normalizeEvaluationValue } from '@/lib/data';
import type { Project } from '@/types';

export interface ProjectTableProps {
  /** 表示する事業データの配列 */
  projects: Project[];
}

/**
 * 事業一覧テーブルコンポーネント
 */
export function ProjectTable({ projects }: ProjectTableProps) {
  // データが空の場合
  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">該当する事業が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="w-[20%] px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              事業名
            </th>
            <th
              scope="col"
              className="w-[13%] px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              政策
            </th>
            <th
              scope="col"
              className="w-[13%] px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              施策
            </th>
            <th
              scope="col"
              className="w-[13%] px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              基本事業
            </th>
            <th
              scope="col"
              className="w-[10%] px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              部署
            </th>
            <th
              scope="col"
              className="w-[9%] px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              事業区分
            </th>
            <th
              scope="col"
              className="w-[11%] px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              改革改善の方向性
            </th>
            <th
              scope="col"
              className="w-[11%] px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              今後の方向性
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="px-2 py-2 md:px-6 md:py-4">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {project.name}
                </Link>
              </td>
              <td className="px-2 py-2 md:px-6 md:py-4 text-sm text-gray-900">
                {project.policy.name}
              </td>
              <td className="px-2 py-2 md:px-6 md:py-4 text-sm text-gray-900">
                {project.measure.name}
              </td>
              <td className="px-2 py-2 md:px-6 md:py-4 text-sm text-gray-900">
                {project.basicProject.name}
              </td>
              <td className="px-2 py-2 md:px-6 md:py-4 text-sm text-gray-900">
                {project.department}
              </td>
              <td className="px-2 py-2 md:px-6 md:py-4 text-sm text-gray-900">
                {project.category}
              </td>
              <td className="px-2 py-2 md:px-6 md:py-4 text-sm text-gray-900">
                {normalizeEvaluationValue(project.evaluation.direction)}
              </td>
              <td className="px-2 py-2 md:px-6 md:py-4 text-sm text-gray-900">
                {normalizeEvaluationValue(project.evaluation.futureDirection)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
