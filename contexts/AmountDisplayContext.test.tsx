/**
 * AmountDisplayContext のテスト
 */

import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AmountDisplayProvider, useAmountDisplay } from './AmountDisplayContext';

// テスト用コンポーネント
function TestComponent() {
  const { mode, setMode } = useAmountDisplay();

  return (
    <div>
      <div data-testid="current-mode">{mode}</div>
      <button type="button" onClick={() => setMode('thousand')}>
        千円表記
      </button>
      <button type="button" onClick={() => setMode('japanese')}>
        日本語表記
      </button>
    </div>
  );
}

describe('AmountDisplayContext', () => {
  // localStorageのモック
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    // localStorageをモックに置き換え
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it('初期状態はjapaneseモードである', () => {
    render(
      <AmountDisplayProvider>
        <TestComponent />
      </AmountDisplayProvider>
    );

    expect(screen.getByTestId('current-mode')).toHaveTextContent('japanese');
  });

  it('千円表記に切り替えられる', async () => {
    const user = userEvent.setup();

    render(
      <AmountDisplayProvider>
        <TestComponent />
      </AmountDisplayProvider>
    );

    // 初期状態を確認
    expect(screen.getByTestId('current-mode')).toHaveTextContent('japanese');

    // 千円表記ボタンをクリック
    await user.click(screen.getByText('千円表記'));

    // モードが変更されたことを確認
    expect(screen.getByTestId('current-mode')).toHaveTextContent('thousand');
  });

  it('日本語表記に切り替えられる', async () => {
    const user = userEvent.setup();

    // localStorageに千円表記を保存（事前条件）
    localStorageMock.setItem('amountDisplayMode', 'thousand');

    render(
      <AmountDisplayProvider>
        <TestComponent />
      </AmountDisplayProvider>
    );

    // useEffect後、localStorageから復元されるまで待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // 千円表記に復元されていることを確認
    expect(screen.getByTestId('current-mode')).toHaveTextContent('thousand');

    // 日本語表記ボタンをクリック
    await user.click(screen.getByText('日本語表記'));

    // モードが変更されたことを確認
    expect(screen.getByTestId('current-mode')).toHaveTextContent('japanese');
  });

  it('モード変更時にlocalStorageに保存される', async () => {
    const user = userEvent.setup();
    const setItemSpy = vi.spyOn(localStorageMock, 'setItem');

    render(
      <AmountDisplayProvider>
        <TestComponent />
      </AmountDisplayProvider>
    );

    // 千円表記に変更
    await user.click(screen.getByText('千円表記'));

    // localStorageに保存されたことを確認
    expect(setItemSpy).toHaveBeenCalledWith('amountDisplayMode', 'thousand');

    // 日本語表記に変更
    await user.click(screen.getByText('日本語表記'));

    // localStorageに保存されたことを確認
    expect(setItemSpy).toHaveBeenCalledWith('amountDisplayMode', 'japanese');
  });

  it('初回レンダリング時にlocalStorageから復元される', async () => {
    // localStorageに千円表記を保存
    localStorageMock.setItem('amountDisplayMode', 'thousand');

    render(
      <AmountDisplayProvider>
        <TestComponent />
      </AmountDisplayProvider>
    );

    // useEffect後、localStorageから復元される
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId('current-mode')).toHaveTextContent('thousand');
  });

  it('localStorageに不正な値がある場合はjapaneseにフォールバックする', async () => {
    // localStorageに不正な値を保存
    localStorageMock.setItem('amountDisplayMode', 'invalid');

    render(
      <AmountDisplayProvider>
        <TestComponent />
      </AmountDisplayProvider>
    );

    // useEffect後もjapaneseのまま
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId('current-mode')).toHaveTextContent('japanese');
  });

  it('useAmountDisplayをProvider外で使用するとエラーになる', () => {
    // コンソールエラーを抑制
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAmountDisplay must be used within AmountDisplayProvider');

    consoleErrorSpy.mockRestore();
  });
});
