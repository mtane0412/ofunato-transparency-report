/**
 * FormattedAmount コンポーネントのテスト
 */

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { AmountDisplayProvider, useAmountDisplay } from '@/contexts/AmountDisplayContext';
import { FormattedAmount } from './FormattedAmount';

// テスト用のトグルコンポーネント（モード切り替え用）
function ModeToggle() {
  const { setMode } = useAmountDisplay();
  return (
    <>
      <button type="button" onClick={() => setMode('thousand')}>
        千円モード
      </button>
      <button type="button" onClick={() => setMode('japanese')}>
        日本語モード
      </button>
    </>
  );
}

describe('FormattedAmount', () => {
  beforeEach(() => {
    // 各テストの前にlocalStorageをクリア
    localStorage.clear();
  });
  it('日本語モードで金額を日本語表記で表示する', () => {
    render(
      <AmountDisplayProvider>
        <FormattedAmount amount={130005} />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('1億3,000万5,000円')).toBeInTheDocument();
  });

  it('千円モードで金額を千円表記で表示する', async () => {
    const user = userEvent.setup();

    render(
      <AmountDisplayProvider>
        <ModeToggle />
        <FormattedAmount amount={130005} />
      </AmountDisplayProvider>
    );

    // 初期状態（日本語モード）を確認
    expect(screen.getByText('1億3,000万5,000円')).toBeInTheDocument();

    // 千円モードに切り替え
    await user.click(screen.getByText('千円モード'));

    // 千円表記に変わることを確認
    expect(screen.getByText('130,005千円')).toBeInTheDocument();
  });

  it('0円を正しく表示する', () => {
    render(
      <AmountDisplayProvider>
        <FormattedAmount amount={0} />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('0円')).toBeInTheDocument();
  });

  it('負の値を正しく表示する', () => {
    render(
      <AmountDisplayProvider>
        <FormattedAmount amount={-3089} />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('-308万9,000円')).toBeInTheDocument();
  });

  it('モード切り替えに応じて表示が変わる', async () => {
    const user = userEvent.setup();

    render(
      <AmountDisplayProvider>
        <ModeToggle />
        <FormattedAmount amount={10000} />
      </AmountDisplayProvider>
    );

    // 初期状態（日本語モード）
    expect(screen.getByText('1,000万円')).toBeInTheDocument();

    // 千円モードに切り替え
    await user.click(screen.getByText('千円モード'));
    expect(screen.getByText('10,000千円')).toBeInTheDocument();

    // 日本語モードに戻す
    await user.click(screen.getByText('日本語モード'));
    expect(screen.getByText('1,000万円')).toBeInTheDocument();
  });

  it('複数のFormattedAmountが同じモードで表示される', async () => {
    const user = userEvent.setup();

    render(
      <AmountDisplayProvider>
        <ModeToggle />
        <div data-testid="amount1">
          <FormattedAmount amount={100000} />
        </div>
        <div data-testid="amount2">
          <FormattedAmount amount={3089} />
        </div>
        <div data-testid="amount3">
          <FormattedAmount amount={130005} />
        </div>
      </AmountDisplayProvider>
    );

    // 初期状態（日本語モード）
    expect(screen.getByTestId('amount1')).toHaveTextContent('1億円');
    expect(screen.getByTestId('amount2')).toHaveTextContent('308万9,000円');
    expect(screen.getByTestId('amount3')).toHaveTextContent('1億3,000万5,000円');

    // 千円モードに切り替え
    await user.click(screen.getByText('千円モード'));

    expect(screen.getByTestId('amount1')).toHaveTextContent('100,000千円');
    expect(screen.getByTestId('amount2')).toHaveTextContent('3,089千円');
    expect(screen.getByTestId('amount3')).toHaveTextContent('130,005千円');
  });
});
