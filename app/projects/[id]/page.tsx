/**
 * 事業詳細ページ
 *
 * 個別の事務事業の詳細情報を表示します。
 * - 基本情報
 * - 事業概要
 * - 財政データ（6年分）
 * - 指標データ
 * - 評価情報
 */

import { notFound } from 'next/navigation';
import { getProjectById, getAllProjects } from '@/lib/data';
import { getSimilarProjects } from '@/lib/similarity';
import { ProjectDetailContent } from '@/components/projects/ProjectDetailContent';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * 静的パスを生成（SSG用）
 */
export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    id: project.id,
  }));
}

/**
 * 事業詳細ページ
 */
export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  // 事業が見つからない場合は404
  if (!project) {
    notFound();
  }

  // 類似事業を取得
  const similarProjects = getSimilarProjects(id, 5);

  return (
    <ProjectDetailContent project={project} similarProjects={similarProjects} />
  );
}
