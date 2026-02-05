/**
 * CustomTooltip コンポーネントのテスト
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CustomTooltip } from './CustomTooltip';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';

describe('CustomTooltip', () => {
  it('activeがfalseの場合は何も表示しない', () => {
    const { container } = render(
      <AmountDisplayProvider>
        <CustomTooltip active={false} payload={[]} label="R5" />
      </AmountDisplayProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('payloadが空の場合は何も表示しない', () => {
    const { container } = render(
      <AmountDisplayProvider>
        <CustomTooltip active={true} payload={[]} label="R5" />
      </AmountDisplayProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('ラベルとデータが表示される', () => {
    const payload = [
      { name: 'トータルコスト', value: 1000000, color: '#3b82f6' },
    ];

    render(
      <AmountDisplayProvider>
        <CustomTooltip active={true} payload={payload} label="R5" />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('R5')).toBeInTheDocument();
    expect(screen.getByText('トータルコスト:')).toBeInTheDocument();
    expect(screen.getByText('10億円')).toBeInTheDocument();
  });

  it('複数のデータ項目が表示される', () => {
    const payload = [
      { name: '事業費', value: 500000, color: '#3b82f6' },
      { name: '人件費', value: 200000, color: '#f59e0b' },
    ];

    render(
      <AmountDisplayProvider>
        <CustomTooltip active={true} payload={payload} label="R5" />
      </AmountDisplayProvider>
    );

    expect(screen.getByText('事業費:')).toBeInTheDocument();
    expect(screen.getByText('5億円')).toBeInTheDocument();
    expect(screen.getByText('人件費:')).toBeInTheDocument();
    expect(screen.getByText('2億円')).toBeInTheDocument();
  });

  it('カラーインジケーターが表示される', () => {
    const payload = [
      { name: 'トータルコスト', value: 1000000, color: '#3b82f6' },
    ];

    const { container } = render(
      <AmountDisplayProvider>
        <CustomTooltip active={true} payload={payload} label="R5" />
      </AmountDisplayProvider>
    );

    const colorIndicator = container.querySelector(
      '[style*="background-color"]'
    );
    expect(colorIndicator).toBeInTheDocument();
  });
});
