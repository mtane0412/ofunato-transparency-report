/**
 * ヘッダーコンポーネント
 *
 * サイト全体のヘッダーを表示します。
 * タイトルとナビゲーションリンクを含みます。
 */

import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold hover:text-blue-100">
            大船渡市 事務事業評価シート
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="hover:text-blue-100">
              概要
            </Link>
            <Link href="/projects" className="hover:text-blue-100">
              事業一覧
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
