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

  it('トグルボタンが表示される', () => {
    render(
      <AmountDisplayProvider>
        <AmountToggle />
      </AmountDisplayProvider>
    );

    expect(screen.getByLabelText('金額表示形式')).toBeInTheDocument();
    expect(screen.getByText('億・万・円')).toBeInTheDocument();
    expect(screen.getByText('千円')).toBeInTheDocument();
  });

  it('初期状態では日本語モード（億・万・円）が選択されている', () => {
    render(
      <AmountDisplayProvider>
        <AmountToggle />
      </AmountDisplayProvider>
    );

    const japaneseButton = screen.getByText('億・万・円');
    expect(japaneseButton).toHaveAttribute('aria-checked', 'true');
  });

  it('千円ボタンをクリックすると千円モードに切り替わる', async () => {
    const user = userEvent.setup();

    render(
      <AmountDisplayProvider>
        <AmountToggle />
      </AmountDisplayProvider>
    );

    const thousandButton = screen.getByText('千円');
    await user.click(thousandButton);

    expect(thousandButton).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('億・万・円')).toHaveAttribute(
      'aria-checked',
      'false'
    );
  });

  it('日本語ボタンをクリックすると日本語モードに切り替わる', async () => {
    const user = userEvent.setup();

    // localStorageに千円モードを保存（事前条件）
    localStorage.setItem('amountDisplayMode', 'thousand');

    render(
      <AmountDisplayProvider>
        <AmountToggle />
      </AmountDisplayProvider>
    );

    const japaneseButton = screen.getByText('億・万・円');
    await user.click(japaneseButton);

    expect(japaneseButton).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('千円')).toHaveAttribute('aria-checked', 'false');
  });

  it('トグル切り替えが連続して動作する', async () => {
    const user = userEvent.setup();

    render(
      <AmountDisplayProvider>
        <AmountToggle />
      </AmountDisplayProvider>
    );

    const japaneseButton = screen.getByText('億・万・円');
    const thousandButton = screen.getByText('千円');

    // 初期状態: 日本語モード
    expect(japaneseButton).toHaveAttribute('aria-checked', 'true');

    // 千円モードに切り替え
    await user.click(thousandButton);
    expect(thousandButton).toHaveAttribute('aria-checked', 'true');

    // 日本語モードに戻す
    await user.click(japaneseButton);
    expect(japaneseButton).toHaveAttribute('aria-checked', 'true');

    // 再度千円モードに切り替え
    await user.click(thousandButton);
    expect(thousandButton).toHaveAttribute('aria-checked', 'true');
  });

  it('アクセシビリティ属性が正しく設定されている', () => {
    render(
      <AmountDisplayProvider>
        <AmountToggle />
      </AmountDisplayProvider>
    );

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toHaveAttribute('aria-label', '金額表示形式');

    const japaneseButton = screen.getByText('億・万・円');
    const thousandButton = screen.getByText('千円');

    expect(japaneseButton).toHaveAttribute('role', 'radio');
    expect(thousandButton).toHaveAttribute('role', 'radio');
  });
});
