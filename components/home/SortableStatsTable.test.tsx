/**
 * SortableStatsTable コンポーネントのテスト
 * ソート可能な統計テーブルのテスト
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SortableStatsTable } from './SortableStatsTable';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';
import type { CategoryStats, CategoryStatsWithEvaluation } from '@/types';

describe('SortableStatsTable', () => {
  const mockData: CategoryStats[] = [
    { name: '政策A', count: 10, budget: 5000000 },
    { name: '政策B', count: 20, budget: 3000000 },
    { name: '政策C', count: 5, budget: 8000000 },
  ];

  const mockDataWithEvaluation: CategoryStatsWithEvaluation[] = [
    {
      name: '政策A',
      count: 10,
      budget: 5000000,
      directionBreakdown: { '１　現状維持': 7, '２　改革改善': 3 },
      futureDirectionBreakdown: { '１　現状維持': 6, '２　改革改善': 4 },
    },
    {
      name: '政策B',
      count: 20,
      budget: 3000000,
      directionBreakdown: { '１　現状維持': 15, '２　改革改善': 4, '３　終了・廃止': 1 },
      futureDirectionBreakdown: { '１　現状維持': 14, '２　改革改善': 5, '３　終了・廃止': 1 },
    },
    {
      name: '政策C',
      count: 5,
      budget: 8000000,
      directionBreakdown: { '２　改革改善': 5 },
      futureDirectionBreakdown: { '２　改革改善': 5 },
    },
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

  it('showEvaluation=trueで「改革改善の方向性」「今後の方向性」列が表示されること', () => {
    render(
      <AmountDisplayProvider>
        <SortableStatsTable data={mockDataWithEvaluation} showEvaluation={true} />
      </AmountDisplayProvider>
    );

    // ヘッダーに評価列が表示されること
    expect(screen.getByText('改革改善の方向性')).toBeInTheDocument();
    expect(screen.getByText('今後の方向性')).toBeInTheDocument();
  });

  it('showEvaluationなし（デフォルト）では評価列が表示されないこと', () => {
    render(
      <AmountDisplayProvider>
        <SortableStatsTable data={mockData} />
      </AmountDisplayProvider>
    );

    // 評価列のヘッダーが表示されないこと
    expect(screen.queryByText('改革改善の方向性')).not.toBeInTheDocument();
    expect(screen.queryByText('今後の方向性')).not.toBeInTheDocument();
  });

  it('評価内訳バッジが正しく表示されること', () => {
    render(
      <AmountDisplayProvider>
        <SortableStatsTable data={mockDataWithEvaluation} showEvaluation={true} />
      </AmountDisplayProvider>
    );

    // 「政策A」の改革改善の方向性（現状維持7件、改革改善3件）
    expect(screen.getByText('現状維持 7')).toBeInTheDocument();
    expect(screen.getByText('改革改善 3')).toBeInTheDocument();

    // 「政策B」の終了・廃止（複数列に出現するためallByTextを使用）
    const endBadges = screen.getAllByText('終了 1');
    expect(endBadges.length).toBeGreaterThan(0);
  });
});
