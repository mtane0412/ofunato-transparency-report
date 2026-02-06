/**
 * CategoryChart コンポーネントのテスト
 * 事業区分別予算配分を横棒グラフで表示するコンポーネントのスモークテスト
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';
import type { CategoryStats } from '@/types';
import CategoryChart from './CategoryChart';

describe('CategoryChart', () => {
  it('事業区分別予算データをレンダリングできること', () => {
    const categoryStats: CategoryStats[] = [
      { name: '経常', count: 100, budget: 10000000 },
      { name: '政策', count: 50, budget: 5000000 },
    ];

    render(
      <AmountDisplayProvider>
        <CategoryChart categoryStats={categoryStats} />
      </AmountDisplayProvider>
    );

    // グラフタイトルが表示されること
    expect(screen.getByText('事業区分別予算配分')).toBeInTheDocument();
  });

  it('空データの場合はフォールバックメッセージを表示すること', () => {
    render(
      <AmountDisplayProvider>
        <CategoryChart categoryStats={[]} />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('データがありません')).toBeInTheDocument();
  });
});
