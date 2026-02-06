/**
 * カードコンポーネント
 *
 * 情報をカード形式で表示するUIコンポーネントです。
 */

import type { ReactNode } from 'react';

interface CardProps {
  /** カードのタイトル */
  title?: string;
  /** カードの内容 */
  children: ReactNode;
  /** 追加のクラス名 */
  className?: string;
}

/**
 * カードコンポーネント
 */
export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 md:p-6 ${className}`}>
      {title && (
        <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}
