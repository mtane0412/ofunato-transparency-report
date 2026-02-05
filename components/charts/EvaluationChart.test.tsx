/**
 * EvaluationChart コンポーネントのテスト
 * 評価グラフコンポーネントの単体テスト
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EvaluationChart } from './EvaluationChart';

describe('EvaluationChart', () => {
  const mockData = [
    { name: '１　現状維持', value: 225 },
    { name: '２　改革改善（縮小・統合含む）', value: 168 },
    { name: '３　終了・廃止・休止', value: 13 },
    { name: 'その他・未設定', value: 1 },
  ];

  it('タイトルが表示されること', () => {
    render(<EvaluationChart title="改革改善の方向性" data={mockData} />);

    expect(screen.getByText('改革改善の方向性')).toBeInTheDocument();
  });

  it('空データ時に「データがありません」が表示されること', () => {
    render(<EvaluationChart title="改革改善の方向性" data={[]} />);

    expect(screen.getByText('データがありません')).toBeInTheDocument();
  });

  it('説明文が表示されること', () => {
    render(
      <EvaluationChart
        title="改革改善の方向性"
        data={mockData}
        description="テスト説明文"
      />
    );

    expect(screen.getByText('テスト説明文')).toBeInTheDocument();
  });
});
