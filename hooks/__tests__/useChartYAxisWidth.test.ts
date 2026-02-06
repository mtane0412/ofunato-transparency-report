/**
 * useChartYAxisWidth カスタムフックのテスト
 *
 * このフックはウィンドウ幅に応じてグラフのY軸幅を動的に計算します。
 * - デスクトップ（640px以上）: 指定された幅をそのまま使用
 * - モバイル（640px未満）: 指定された幅の40%に縮小
 */

import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useChartYAxisWidth } from '../useChartYAxisWidth';

describe('useChartYAxisWidth', () => {
  // オリジナルのwindow.innerWidthを保存
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    // リサイズイベントリスナーをモック化
    vi.stubGlobal('addEventListener', vi.fn());
    vi.stubGlobal('removeEventListener', vi.fn());
  });

  afterEach(() => {
    // window.innerWidthを元に戻す
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.unstubAllGlobals();
  });

  it('デスクトップ幅（640px以上）では指定された幅をそのまま返す', () => {
    // 準備: デスクトップサイズに設定
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // 実行
    const { result } = renderHook(() => useChartYAxisWidth(280));

    // 検証: 指定された幅（280）がそのまま返される
    expect(result.current.yAxisWidth).toBe(280);
    expect(result.current.fontSize).toBe(12);
  });

  it('モバイル幅（640px未満）では指定された幅の40%を返す', () => {
    // 準備: モバイルサイズに設定
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    // 実行
    const { result } = renderHook(() => useChartYAxisWidth(280));

    // 検証: 280 * 0.4 = 112
    expect(result.current.yAxisWidth).toBe(112);
    expect(result.current.fontSize).toBe(10);
  });

  it('境界値: 640pxではデスクトップとして扱う', () => {
    // 準備: 境界値（640px）に設定
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640,
    });

    // 実行
    const { result } = renderHook(() => useChartYAxisWidth(280));

    // 検証: 640px以上なので指定された幅をそのまま返す
    expect(result.current.yAxisWidth).toBe(280);
    expect(result.current.fontSize).toBe(12);
  });

  it('境界値: 639pxではモバイルとして扱う', () => {
    // 準備: 境界値-1（639px）に設定
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 639,
    });

    // 実行
    const { result } = renderHook(() => useChartYAxisWidth(240));

    // 検証: 640px未満なので40%に縮小（240 * 0.4 = 96）
    expect(result.current.yAxisWidth).toBe(96);
    expect(result.current.fontSize).toBe(10);
  });

  it('異なるdesktopWidth値でも正しく計算される', () => {
    // 準備: デスクトップサイズに設定
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // 実行: 異なる幅（150）を指定
    const { result } = renderHook(() => useChartYAxisWidth(150));

    // 検証: 指定された幅（150）がそのまま返される
    expect(result.current.yAxisWidth).toBe(150);
    expect(result.current.fontSize).toBe(12);
  });

  it('モバイル幅で異なるdesktopWidth値でも正しく40%が計算される', () => {
    // 準備: モバイルサイズに設定
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320,
    });

    // 実行: 異なる幅（120）を指定
    const { result } = renderHook(() => useChartYAxisWidth(120));

    // 検証: 120 * 0.4 = 48
    expect(result.current.yAxisWidth).toBe(48);
    expect(result.current.fontSize).toBe(10);
  });
});
