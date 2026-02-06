/**
 * RevenueCompositionChart コンポーネントのテスト
 * 財源構成をドーナツチャートで表示するコンポーネントのスモークテスト
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';
import type { RevenueComposition } from '@/types';
import RevenueCompositionChart from './RevenueCompositionChart';

describe('RevenueCompositionChart', () => {
  it('財源構成データをレンダリングできること', () => {
    const revenueData: RevenueComposition[] = [
      { name: '国庫支出金', value: 2300000 },
      { name: '一般財源', value: 1360000 },
      { name: '地方債', value: 1200000 },
      { name: '都道府県支出金', value: 1100000 },
      { name: 'その他', value: 440000 },
    ];

    render(
      <AmountDisplayProvider>
        <RevenueCompositionChart data={revenueData} />
      </AmountDisplayProvider>
    );

    // グラフタイトルが表示されること
    expect(screen.getByText('全体の財源構成')).toBeInTheDocument();
  });

  it('空データの場合はフォールバックメッセージを表示すること', () => {
    render(
      <AmountDisplayProvider>
        <RevenueCompositionChart data={[]} />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('データがありません')).toBeInTheDocument();
  });
});
