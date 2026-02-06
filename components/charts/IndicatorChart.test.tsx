/**
 * IndicatorChart コンポーネントのテスト
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';
import type { YearlyIndicator } from '@/types';
import { IndicatorChart } from './IndicatorChart';

describe('IndicatorChart', () => {
  const mockIndicators: YearlyIndicator[] = [
    {
      year: 4,
      activity: [100, 200, null],
      target: [300, null, null],
      outcome: [null, null, null],
    },
    {
      year: 5,
      activity: [150, 250, null],
      target: [350, null, null],
      outcome: [null, null, null],
    },
    {
      year: 6,
      activity: [200, 300, null],
      target: [400, null, null],
      outcome: [null, null, null],
    },
  ];

  it('グラフタイトルが表示される', () => {
    render(
      <AmountDisplayProvider>
        <IndicatorChart
          indicators={mockIndicators}
          category="activity"
          index={0}
          label="活動指標ア"
        />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('活動指標ア')).toBeInTheDocument();
  });

  it('ResponsiveContainerが存在する', () => {
    const { container } = render(
      <AmountDisplayProvider>
        <IndicatorChart
          indicators={mockIndicators}
          category="activity"
          index={0}
          label="活動指標ア"
        />
      </AmountDisplayProvider>
    );

    const responsiveContainer = container.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();
  });

  it('空データの場合はメッセージを表示する', () => {
    render(
      <AmountDisplayProvider>
        <IndicatorChart indicators={[]} category="activity" index={0} label="活動指標ア" />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('データがありません')).toBeInTheDocument();
  });

  it('全てnullの場合はメッセージを表示する', () => {
    const allNullIndicators: YearlyIndicator[] = [
      {
        year: 4,
        activity: [null, null, null],
        target: [null, null, null],
        outcome: [null, null, null],
      },
    ];

    render(
      <AmountDisplayProvider>
        <IndicatorChart
          indicators={allNullIndicators}
          category="activity"
          index={0}
          label="活動指標ア"
        />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('データがありません')).toBeInTheDocument();
  });
});
