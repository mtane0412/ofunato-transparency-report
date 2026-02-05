/**
 * フッターコンポーネント
 *
 * サイト全体のフッターを表示します。
 * 著作権表示とデータ更新日を含みます。
 */

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-600">
          <p>&copy; {currentYear} 大船渡市. All rights reserved.</p>
          <p className="mt-1">
            このサイトは大船渡市の事務事業評価シートを可視化したものです。
          </p>
        </div>
      </div>
    </footer>
  );
}
