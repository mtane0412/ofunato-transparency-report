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
      { name: '政策A', count: 10, budget: 5000000 },
      { name: '政策B', count: 20, budget: 3000000 },
    ],
    projectsByCategory: [
      { name: '経常', count: 100, budget: 10000000 },
      { name: '政策', count: 50, budget: 5000000 },
    ],
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
});
