/**
 * PolicyBudgetChart コンポーネントのテスト
 * 政策別予算配分を横棒グラフで表示するコンポーネントのスモークテスト
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PolicyBudgetChart from './PolicyBudgetChart';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';
import type { CategoryStats } from '@/types';

describe('PolicyBudgetChart', () => {
  it('政策別予算データをレンダリングできること', () => {
    const policyStats: CategoryStats[] = [
      { name: '政策A', count: 10, budget: 5000000 },
      { name: '政策B', count: 20, budget: 3000000 },
    ];

    render(
      <AmountDisplayProvider>
        <PolicyBudgetChart policyStats={policyStats} />
      </AmountDisplayProvider>
    );

    // グラフタイトルが表示されること
    expect(screen.getByText('政策別予算配分')).toBeInTheDocument();
  });

  it('空データの場合はフォールバックメッセージを表示すること', () => {
    render(
      <AmountDisplayProvider>
        <PolicyBudgetChart policyStats={[]} />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('データがありません')).toBeInTheDocument();
  });
});
