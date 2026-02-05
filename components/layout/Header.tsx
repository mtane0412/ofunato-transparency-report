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
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold hover:text-blue-100">
            大船渡市 事務事業評価データ（非公式）
          </Link>
          <div className="flex items-center gap-6">
            <nav className="flex gap-6">
              <Link href="/" className="hover:text-blue-100">
                ダッシュボード
              </Link>
              <Link href="/projects" className="hover:text-blue-100">
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
