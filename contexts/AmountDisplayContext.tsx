/**
 * 金額表示モードを管理するContext
 *
 * このContextは、アプリケーション全体で金額の表示形式（千円表記 or 日本語表記）を
 * 統一的に管理します。ユーザーの選択はlocalStorageに永続化されます。
 *
 * SSGハイドレーション対策:
 * - サーバーとクライアントで初期状態を一致させるため、Provider初期値は常に'japanese'
 * - useEffect内でlocalStorageから復元し、状態を更新
 */

'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { AmountDisplayMode } from '@/types';

/**
 * Context の値の型定義
 */
interface AmountDisplayContextValue {
  /** 現在の表示モード */
  mode: AmountDisplayMode;
  /** 表示モードを変更する関数 */
  setMode: (mode: AmountDisplayMode) => void;
}

/**
 * AmountDisplayContext
 */
const AmountDisplayContext = createContext<
  AmountDisplayContextValue | undefined
>(undefined);

/**
 * AmountDisplayProvider のプロパティ
 */
interface AmountDisplayProviderProps {
  children: ReactNode;
}

/**
 * localStorageのキー
 */
const STORAGE_KEY = 'amountDisplayMode';

/**
 * AmountDisplayProvider
 *
 * 金額表示モードを管理するProvider。
 * localStorageへの永続化とSSGハイドレーション対策を実装しています。
 */
export function AmountDisplayProvider({
  children,
}: AmountDisplayProviderProps) {
  // SSGハイドレーション対策: 初期値は常に'japanese'
  const [mode, setMode] = useState<AmountDisplayMode>('japanese');

  // クライアントサイドでlocalStorageから復元
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'thousand' || stored === 'japanese') {
      setMode(stored);
    }
  }, []);

  // モード変更時にlocalStorageに保存
  const handleSetMode = (newMode: AmountDisplayMode) => {
    setMode(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  };

  return (
    <AmountDisplayContext.Provider value={{ mode, setMode: handleSetMode }}>
      {children}
    </AmountDisplayContext.Provider>
  );
}

/**
 * useAmountDisplay フック
 *
 * 金額表示モードにアクセスするためのフック。
 * AmountDisplayProvider 内で使用する必要があります。
 *
 * @throws {Error} Provider外で使用した場合
 * @returns {AmountDisplayContextValue} 現在のモードと変更関数
 */
export function useAmountDisplay(): AmountDisplayContextValue {
  const context = useContext(AmountDisplayContext);
  if (context === undefined) {
    throw new Error(
      'useAmountDisplay must be used within AmountDisplayProvider'
    );
  }
  return context;
}
