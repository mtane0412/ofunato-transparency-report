/**
 * ヘッダーコンポーネント
 *
 * サイト全体のヘッダーを表示します。
 * タイトル、ナビゲーションリンク、金額表示切り替えトグルを含みます。
 */

'use client';

import Link from 'next/link';
import { AmountToggle } from '@/components/ui/AmountToggle';

export function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <Link href="/" className="text-lg md:text-xl font-bold hover:text-blue-100 truncate">
            大船渡市 事務事業評価データ（非公式）
          </Link>
          <div className="flex items-center justify-between">
            <nav className="flex gap-3 md:gap-6">
              <Link href="/" className="text-sm md:text-base hover:text-blue-100">
                ダッシュボード
              </Link>
              <Link href="/analysis" className="text-sm md:text-base hover:text-blue-100">
                予算分析
              </Link>
              <Link href="/projects" className="text-sm md:text-base hover:text-blue-100">
                事業一覧
              </Link>
            </nav>
            <AmountToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
