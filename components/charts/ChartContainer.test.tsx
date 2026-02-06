/**
 * ChartContainer コンポーネントのテスト
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChartContainer } from './ChartContainer';

describe('ChartContainer', () => {
  it('タイトルが表示される', () => {
    render(
      <ChartContainer title="テストグラフ">
        <div>グラフ内容</div>
      </ChartContainer>
    );

    expect(screen.getByText('テストグラフ')).toBeInTheDocument();
  });

  it('ResponsiveContainerが存在する', () => {
    const { container } = render(
      <ChartContainer title="テストグラフ">
        <div data-testid="chart-content">グラフ内容</div>
      </ChartContainer>
    );

    // ResponsiveContainerが存在することを確認
    const responsiveContainer = container.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();
  });

  it('高さを指定できる', () => {
    const { container } = render(
      <ChartContainer title="テストグラフ" height={400}>
        <div>グラフ内容</div>
      </ChartContainer>
    );

    // ResponsiveContainerは高さをstyle属性で設定する
    const responsiveContainer = container.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();
  });

  it('デフォルトの高さは300px', () => {
    const { container } = render(
      <ChartContainer title="テストグラフ">
        <div>グラフ内容</div>
      </ChartContainer>
    );

    const responsiveContainer = container.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();
  });
});
