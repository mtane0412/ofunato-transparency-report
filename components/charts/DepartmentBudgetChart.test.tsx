/**
 * DepartmentBudgetChart コンポーネントのテスト
 * 部署別予算配分を横棒グラフで表示するコンポーネントのスモークテスト
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';
import type { DepartmentBudget } from '@/types';
import DepartmentBudgetChart from './DepartmentBudgetChart';

describe('DepartmentBudgetChart', () => {
  it('部署別予算データをレンダリングできること', () => {
    const departmentBudgets: DepartmentBudget[] = [
      { name: '総務部総務課', budget: 6800000, count: 2 },
      { name: '保健福祉部こども家庭センター', budget: 2400000, count: 1 },
    ];

    render(
      <AmountDisplayProvider>
        <DepartmentBudgetChart departmentBudgets={departmentBudgets} />
      </AmountDisplayProvider>
    );

    // グラフタイトルが表示されること
    expect(screen.getByText('部署別予算配分')).toBeInTheDocument();
  });

  it('空データの場合はフォールバックメッセージを表示すること', () => {
    render(
      <AmountDisplayProvider>
        <DepartmentBudgetChart departmentBudgets={[]} />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('データがありません')).toBeInTheDocument();
  });

  it('20件以上のデータがある場合、初期表示はtop20で「すべて表示」ボタンが表示されること', () => {
    // 25部署のダミーデータを生成
    const departmentBudgets: DepartmentBudget[] = Array.from({ length: 25 }, (_, i) => ({
      name: `部署${i + 1}`,
      budget: (25 - i) * 100000, // 予算降順
      count: i + 1,
    }));

    render(
      <AmountDisplayProvider>
        <DepartmentBudgetChart departmentBudgets={departmentBudgets} />
      </AmountDisplayProvider>
    );

    // 「すべて表示」ボタンが表示されること
    expect(screen.getByRole('button', { name: /すべて表示/ })).toBeInTheDocument();
  });
});
