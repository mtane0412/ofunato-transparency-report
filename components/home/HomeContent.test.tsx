/**
 * HomeContent コンポーネントのテスト
 * トップページコンテンツの統合テスト
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeContent } from './HomeContent';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';
import type { DatasetStats } from '@/types';

describe('HomeContent', () => {
  const mockStats: DatasetStats = {
    totalProjects: 407,
    totalBudget: 50000000,
    generatedAt: '2024-01-01T00:00:00Z',
    projectsByPolicy: [
      {
        name: '政策A',
        count: 10,
        budget: 5000000,
        directionBreakdown: { '１　現状維持': 7, '２　改革改善（縮小・統合含む）': 3 },
        futureDirectionBreakdown: { '１　現状維持': 6, '２　改革改善（縮小・統合含む）': 4 },
      },
      {
        name: '政策B',
        count: 20,
        budget: 3000000,
        directionBreakdown: { '１　現状維持': 15, '２　改革改善（縮小・統合含む）': 5 },
        futureDirectionBreakdown: { '１　現状維持': 14, '２　改革改善（縮小・統合含む）': 6 },
      },
    ],
    projectsByCategory: [
      {
        name: '経常',
        count: 100,
        budget: 10000000,
        directionBreakdown: { '１　現状維持': 70, '２　改革改善（縮小・統合含む）': 30 },
        futureDirectionBreakdown: { '１　現状維持': 65, '２　改革改善（縮小・統合含む）': 35 },
      },
      {
        name: '政策',
        count: 50,
        budget: 5000000,
        directionBreakdown: { '１　現状維持': 30, '２　改革改善（縮小・統合含む）': 20 },
        futureDirectionBreakdown: { '１　現状維持': 28, '２　改革改善（縮小・統合含む）': 22 },
      },
    ],
    policyCount: 8,
    categoryCount: 5,
    averageBudget: 122850,
    evaluationStats: {
      directionCounts: [
        { name: '１　現状維持', count: 225 },
        { name: '２　改革改善（縮小・統合含む）', count: 168 },
        { name: '３　終了・廃止・休止', count: 13 },
        { name: 'その他・未設定', count: 1 },
      ],
      futureDirectionCounts: [
        { name: '１　現状維持', count: 207 },
        { name: '２　改革改善（縮小・統合含む）', count: 185 },
        { name: '３　終了・廃止・休止', count: 15 },
      ],
    },
  };

  it('基本的なコンテンツが表示されること', () => {
    render(
      <AmountDisplayProvider>
        <HomeContent stats={mockStats} />
      </AmountDisplayProvider>
    );

    // サマリーカードが表示されること
    expect(screen.getByText('407')).toBeInTheDocument();

    // グラフが表示されること
    expect(screen.getByText('政策別予算配分')).toBeInTheDocument();
    expect(screen.getByText('事業区分別予算配分')).toBeInTheDocument();
  });

  it('詳細テーブルが初期状態では非表示であること', () => {
    render(
      <AmountDisplayProvider>
        <HomeContent stats={mockStats} />
      </AmountDisplayProvider>
    );

    // 詳細を表示ボタンが存在すること
    expect(screen.getAllByText('詳細を表示').length).toBeGreaterThan(0);
  });
});
