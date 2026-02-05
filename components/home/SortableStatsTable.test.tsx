/**
 * SortableStatsTable コンポーネントのテスト
 * ソート可能な統計テーブルのテスト
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SortableStatsTable } from './SortableStatsTable';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';
import type { CategoryStats } from '@/types';

describe('SortableStatsTable', () => {
  const mockData: CategoryStats[] = [
    { name: '政策A', count: 10, budget: 5000000 },
    { name: '政策B', count: 20, budget: 3000000 },
    { name: '政策C', count: 5, budget: 8000000 },
  ];

  it('データが表示されること', () => {
    render(
      <AmountDisplayProvider>
        <SortableStatsTable data={mockData} />
      </AmountDisplayProvider>
    );

    // すべてのデータが表示されていること
    expect(screen.getByText('政策A')).toBeInTheDocument();
    expect(screen.getByText('政策B')).toBeInTheDocument();
    expect(screen.getByText('政策C')).toBeInTheDocument();
  });

  it('初期状態では予算降順でソートされていること', () => {
    render(
      <AmountDisplayProvider>
        <SortableStatsTable data={mockData} />
      </AmountDisplayProvider>
    );

    const rows = screen.getAllByRole('row');
    // ヘッダー行を除いた最初のデータ行
    expect(rows[1]).toHaveTextContent('政策C');
  });

  it('名称列をクリックすると名前でソートされること', () => {
    render(
      <AmountDisplayProvider>
        <SortableStatsTable data={mockData} />
      </AmountDisplayProvider>
    );

    const nameHeader = screen.getByText('名称');
    fireEvent.click(nameHeader);

    const rows = screen.getAllByRole('row');
    // 降順ソート（最初のクリックは降順）
    expect(rows[1]).toHaveTextContent('政策C');
  });

  it('事業数列をクリックすると件数でソートされること', () => {
    render(
      <AmountDisplayProvider>
        <SortableStatsTable data={mockData} />
      </AmountDisplayProvider>
    );

    const countHeader = screen.getByText('事業数');
    fireEvent.click(countHeader);

    const rows = screen.getAllByRole('row');
    // 降順ソート
    expect(rows[1]).toHaveTextContent('政策B');
  });
});
