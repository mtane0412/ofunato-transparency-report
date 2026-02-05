/**
 * トップページ（概要ダッシュボード）
 *
 * 大船渡市の事務事業評価データの概要を表示します。
 * - 総事業数
 * - 総予算
 * - 政策別事業数
 * - 事業区分別事業数
 *
 * Server Componentとして実装されており、データ取得後にClient Componentに渡します。
 */

import { getDatasetStats } from '@/lib/data';
import { HomeContent } from '@/components/home/HomeContent';

export default function Home() {
  const stats = getDatasetStats();

  return <HomeContent stats={stats} />;
}
