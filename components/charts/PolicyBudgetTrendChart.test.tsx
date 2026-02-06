/**
 * PolicyBudgetTrendChart コンポーネントのテスト
 * 政策別・年度別予算推移を複数系列折れ線グラフで表示するコンポーネントのスモークテスト
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';
import type { PolicyYearlyChartDataPoint } from '@/types';
import PolicyBudgetTrendChart from './PolicyBudgetTrendChart';

describe('PolicyBudgetTrendChart', () => {
  it('政策別・年度別予算推移データをレンダリングできること', () => {
    const data: PolicyYearlyChartDataPoint[] = [
      { year: 'R2', 政策1: 4300000, 政策2: 1400000 },
      { year: 'R3', 政策1: 5000000, 政策2: 1600000 },
      { year: 'R7', 政策1: 6800000, 政策2: 2400000 },
    ];
    const policyNames = ['政策1', '政策2'];

    render(
      <AmountDisplayProvider>
        <PolicyBudgetTrendChart data={data} policyNames={policyNames} />
      </AmountDisplayProvider>
    );

    // グラフタイトルが表示されること
    expect(screen.getByText('政策別・年度別予算推移')).toBeInTheDocument();
  });

  it('空データの場合はフォールバックメッセージを表示すること', () => {
    render(
      <AmountDisplayProvider>
        <PolicyBudgetTrendChart data={[]} policyNames={[]} />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('データがありません')).toBeInTheDocument();
  });
});
