/**
 * ProjectTableコンポーネント
 *
 * 事業一覧をテーブル形式で表示します。
 */

import Link from 'next/link';
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
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              事業名
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              政策
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              施策
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              基本事業
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              部署
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              事業区分
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {project.name}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{project.policy.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{project.measure.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{project.basicProject.name}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {project.department}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {project.category}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
