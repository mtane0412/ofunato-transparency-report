/**
 * 金額表示形式切り替えトグルコンポーネント
 *
 * ヘッダーに配置する金額表示モードの切り替えトグルです。
 * - OFF: 億・万・円（日本語モード）
 * - ON: 千円（千円モード）
 */

'use client';

import { useAmountDisplay } from '@/contexts/AmountDisplayContext';

/**
 * AmountToggle コンポーネント
 *
 * 金額表示モードを切り替えるトグルスイッチを提供します。
 * チェックボックスベースのシンプルなトグルスイッチです。
 */
export function AmountToggle() {
  const { mode, setMode } = useAmountDisplay();

  const handleToggle = () => {
    setMode(mode === 'thousand' ? 'japanese' : 'thousand');
  };

  return (
    <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
      <span>千円表記</span>
      <div className="relative">
        <input
          type="checkbox"
          checked={mode === 'thousand'}
          onChange={handleToggle}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors"></div>
        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
      </div>
    </label>
  );
}
