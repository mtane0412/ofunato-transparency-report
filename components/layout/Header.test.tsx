/**
 * Header コンポーネントのテスト
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';

describe('Header', () => {
  it('サイト名が正しく表示される', () => {
    render(
      <AmountDisplayProvider>
        <Header />
      </AmountDisplayProvider>
    );

    expect(
      screen.getByText('大船渡市 事務事業評価データ（非公式）')
    ).toBeInTheDocument();
  });

  it('サイト名がリンクになっている', () => {
    render(
      <AmountDisplayProvider>
        <Header />
      </AmountDisplayProvider>
    );

    const link = screen.getByRole('link', {
      name: '大船渡市 事務事業評価データ（非公式）',
    });
    expect(link).toHaveAttribute('href', '/');
  });

  it('ナビゲーションリンクが表示される', () => {
    render(
      <AmountDisplayProvider>
        <Header />
      </AmountDisplayProvider>
    );

    expect(
      screen.getByRole('link', { name: 'ダッシュボード' })
    ).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: '事業一覧' })).toHaveAttribute(
      'href',
      '/projects'
    );
  });

  it('AmountToggleコンポーネントが表示される', () => {
    render(
      <AmountDisplayProvider>
        <Header />
      </AmountDisplayProvider>
    );

    // AmountToggleのラベルが表示されることを確認
    expect(screen.getByLabelText('千円表記')).toBeInTheDocument();
  });
});
