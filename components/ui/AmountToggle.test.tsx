/**
 * AmountToggle コンポーネントのテスト
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { AmountToggle } from './AmountToggle';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';

describe('AmountToggle', () => {
  beforeEach(() => {
    // 各テストの前にlocalStorageをクリア
    localStorage.clear();
  });

  it('トグルスイッチが表示される', () => {
    render(
      <AmountDisplayProvider>
        <AmountToggle />
      </AmountDisplayProvider>
    );

    expect(screen.getByLabelText('千円表記')).toBeInTheDocument();
  });

  it('初期状態では日本語モード（チェックOFF）である', () => {
    render(
      <AmountDisplayProvider>
        <AmountToggle />
      </AmountDisplayProvider>
    );

    const checkbox = screen.getByRole('checkbox', { name: '千円表記' });
    expect(checkbox).not.toBeChecked();
  });

  it('トグルをクリックすると千円モードに切り替わる', async () => {
    const user = userEvent.setup();

    render(
      <AmountDisplayProvider>
        <AmountToggle />
      </AmountDisplayProvider>
    );

    const checkbox = screen.getByRole('checkbox', { name: '千円表記' });
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('再度クリックすると日本語モードに戻る', async () => {
    const user = userEvent.setup();

    // localStorageに千円モードを保存（事前条件）
    localStorage.setItem('amountDisplayMode', 'thousand');

    render(
      <AmountDisplayProvider>
        <AmountToggle />
      </AmountDisplayProvider>
    );

    const checkbox = screen.getByRole('checkbox', { name: '千円表記' });

    // 初期状態は千円モード（チェックON）
    expect(checkbox).toBeChecked();

    // クリックして日本語モードに戻す
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('トグル切り替えが連続して動作する', async () => {
    const user = userEvent.setup();

    render(
      <AmountDisplayProvider>
        <AmountToggle />
      </AmountDisplayProvider>
    );

    const checkbox = screen.getByRole('checkbox', { name: '千円表記' });

    // 初期状態: 日本語モード（チェックOFF）
    expect(checkbox).not.toBeChecked();

    // 千円モードに切り替え
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    // 日本語モードに戻す
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();

    // 再度千円モードに切り替え
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('アクセシビリティ属性が正しく設定されている', () => {
    render(
      <AmountDisplayProvider>
        <AmountToggle />
      </AmountDisplayProvider>
    );

    const checkbox = screen.getByRole('checkbox', { name: '千円表記' });
    expect(checkbox).toBeInTheDocument();
  });
});
