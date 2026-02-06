/**
 * CostBreakdownChart コンポーネントのテスト
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';
import type { YearlyFinancial } from '@/types';
import { CostBreakdownChart } from './CostBreakdownChart';

describe('CostBreakdownChart', () => {
  const mockFinancials: YearlyFinancial[] = [
    {
      year: 4,
      nationalSubsidy: 100000,
      prefecturalSubsidy: 50000,
      localBond: 30000,
      other: 20000,
      generalRevenue: 300000,
      totalCost: 400000,
      personnelCount: 5,
      workHours: 1000,
      personnelCost: 100000,
      grandTotal: 500000,
    },
    {
      year: 5,
      nationalSubsidy: 120000,
      prefecturalSubsidy: 60000,
      localBond: 40000,
      other: 30000,
      generalRevenue: 350000,
      totalCost: 450000,
      personnelCount: 6,
      workHours: 1200,
      personnelCost: 150000,
      grandTotal: 600000,
    },
  ];

  it('グラフタイトルが表示される', () => {
    render(
      <AmountDisplayProvider>
        <CostBreakdownChart financials={mockFinancials} />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('事業費・人件費の内訳')).toBeInTheDocument();
  });

  it('ResponsiveContainerが存在する', () => {
    const { container } = render(
      <AmountDisplayProvider>
        <CostBreakdownChart financials={mockFinancials} />
      </AmountDisplayProvider>
    );

    const responsiveContainer = container.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();
  });

  it('空データの場合はメッセージを表示する', () => {
    render(
      <AmountDisplayProvider>
        <CostBreakdownChart financials={[]} />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('データがありません')).toBeInTheDocument();
  });
});
