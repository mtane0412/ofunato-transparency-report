/**
 * グラフ共通コンテナコンポーネント
 * ResponsiveContainerとCardでグラフをラップする
 */

'use client';

import { ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';

/**
 * グラフコンテナのプロパティ
 */
interface ChartContainerProps {
  /** グラフタイトル */
  title: string;
  /** 説明文（オプション） */
  description?: string;
  /** グラフの高さ（px） */
  height?: number;
  /** 子要素（Rechartsのグラフコンポーネント） */
  children: React.ReactNode;
}

/**
 * グラフコンテナコンポーネント
 *
 * ResponsiveContainerとCardでグラフをラップし、
 * 一貫したスタイルとレスポンシブ対応を提供します。
 */
export function ChartContainer({
  title,
  description,
  height = 300,
  children,
}: ChartContainerProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </Card>
  );
}
