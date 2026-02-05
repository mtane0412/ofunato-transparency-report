/**
 * フッターコンポーネント
 *
 * サイト全体のフッターを表示します。
 * 免責事項を表示します。
 */

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-600">
          <p>
            本サイトは大船渡市のオープンデータをもとに市民が作成したものです。公式情報は大船渡市HPをご確認ください。
          </p>
        </div>
      </div>
    </footer>
  );
}
