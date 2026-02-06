/**
 * グラフのY軸幅をウィンドウ幅に応じて動的に計算するカスタムフック
 *
 * モバイル端末での表示を最適化するため、画面幅に応じてY軸の幅を調整します。
 * - デスクトップ（640px以上）: 指定された幅をそのまま使用
 * - モバイル（640px未満）: 指定された幅の40%に縮小
 *
 * @param desktopWidth - デスクトップ環境で使用するY軸の幅（ピクセル）
 * @returns yAxisWidth - 現在の画面幅に応じた適切なY軸幅
 * @returns fontSize - 現在の画面幅に応じた適切なフォントサイズ
 */

import { useCallback, useEffect, useState } from 'react';

// モバイルとデスクトップの境界値（Tailwindの`sm`ブレークポイント）
const MOBILE_BREAKPOINT = 640;

// モバイル時のY軸幅の縮小率
const MOBILE_SCALE = 0.4;

// フォントサイズ
const DESKTOP_FONT_SIZE = 12;
const MOBILE_FONT_SIZE = 10;

export function useChartYAxisWidth(desktopWidth: number) {
  // ウィンドウ幅に基づいてY軸幅を計算
  const calculateWidth = useCallback(() => {
    // サーバーサイドレンダリング時はデスクトップ幅を返す
    if (typeof window === 'undefined') {
      return desktopWidth;
    }

    // 640px未満の場合は40%に縮小
    return window.innerWidth < MOBILE_BREAKPOINT
      ? Math.round(desktopWidth * MOBILE_SCALE)
      : desktopWidth;
  }, [desktopWidth]);

  // フォントサイズを計算
  const calculateFontSize = useCallback(() => {
    if (typeof window === 'undefined') {
      return DESKTOP_FONT_SIZE;
    }

    return window.innerWidth < MOBILE_BREAKPOINT
      ? MOBILE_FONT_SIZE
      : DESKTOP_FONT_SIZE;
  }, []);

  // SSR/クライアント間のハイドレーションミスマッチを防ぐため、初期値は常にデスクトップ値で固定
  const [yAxisWidth, setYAxisWidth] = useState(desktopWidth);
  const [fontSize, setFontSize] = useState(DESKTOP_FONT_SIZE);

  useEffect(() => {
    // リサイズイベントをハンドル
    const handleResize = () => {
      setYAxisWidth(calculateWidth());
      setFontSize(calculateFontSize());
    };

    // ハイドレーション後、クライアント側の実際の値に更新
    handleResize();

    // イベントリスナーを登録
    window.addEventListener('resize', handleResize);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateWidth, calculateFontSize]);

  return { yAxisWidth, fontSize };
}
