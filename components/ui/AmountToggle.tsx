/**
 * 金額表示形式切り替えトグルコンポーネント
 *
 * ヘッダーに配置する金額表示モードの切り替えトグルです。
 * - 億・万・円（日本語モード）
 * - 千円（千円モード）
 */

'use client';

import { useAmountDisplay } from '@/contexts/AmountDisplayContext';

/**
 * AmountToggle コンポーネント
 *
 * 金額表示モードを切り替えるトグルボタンを提供します。
 * アクセシビリティ対応として、role="radiogroup" と role="radio" を使用しています。
 */
export function AmountToggle() {
  const { mode, setMode } = useAmountDisplay();

  return (
    <div
      className="flex items-center gap-1 rounded-md bg-gray-100 p-1"
      role="radiogroup"
      aria-label="金額表示形式"
    >
      {/* 日本語モードボタン */}
      <button
        type="button"
        role="radio"
        aria-checked={mode === 'japanese'}
        onClick={() => setMode('japanese')}
        className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
          mode === 'japanese'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        億・万・円
      </button>

      {/* 千円モードボタン */}
      <button
        type="button"
        role="radio"
        aria-checked={mode === 'thousand'}
        onClick={() => setMode('thousand')}
        className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
          mode === 'thousand'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        千円
      </button>
    </div>
  );
}
