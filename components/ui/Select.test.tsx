/**
 * Selectコンポーネントのテスト
 *
 * セレクトボックスコンポーネントが正しく動作することを確認します。
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

describe('Select', () => {
  const mockOptions = [
    { value: 'opt1', label: 'オプション1' },
    { value: 'opt2', label: 'オプション2' },
    { value: 'opt3', label: 'オプション3' },
  ];

  it('セレクトボックスがレンダリングされること', () => {
    render(
      <Select
        id="test-select"
        label="テストセレクト"
        options={mockOptions}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('テストセレクト')).toBeInTheDocument();
  });

  it('プレースホルダーが表示されること', () => {
    render(
      <Select
        id="test-select"
        label="テストセレクト"
        options={mockOptions}
        value=""
        onChange={() => {}}
        placeholder="選択してください"
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    // プレースホルダーはoption要素として存在
    expect(screen.getByText('選択してください')).toBeInTheDocument();
  });

  it('オプションが正しく表示されること', () => {
    render(
      <Select
        id="test-select"
        label="テストセレクト"
        options={mockOptions}
        value=""
        onChange={() => {}}
      />
    );

    mockOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('選択された値が反映されること', () => {
    render(
      <Select
        id="test-select"
        label="テストセレクト"
        options={mockOptions}
        value="opt2"
        onChange={() => {}}
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('opt2');
  });

  it('値を変更したときonChangeが呼ばれること', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Select
        id="test-select"
        label="テストセレクト"
        options={mockOptions}
        value=""
        onChange={handleChange}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'opt1');

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('opt1');
  });

  it('disabledプロパティが正しく動作すること', () => {
    render(
      <Select
        id="test-select"
        label="テストセレクト"
        options={mockOptions}
        value=""
        onChange={() => {}}
        disabled
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('件数が指定された場合、ラベルに件数が表示されること', () => {
    const optionsWithCounts = [
      { value: 'opt1', label: 'オプション1', count: 10 },
      { value: 'opt2', label: 'オプション2', count: 5 },
      { value: 'opt3', label: 'オプション3', count: 0 },
    ];

    render(
      <Select
        id="test-select"
        label="テストセレクト"
        options={optionsWithCounts}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText('オプション1 (10件)')).toBeInTheDocument();
    expect(screen.getByText('オプション2 (5件)')).toBeInTheDocument();
    expect(screen.getByText('オプション3 (0件)')).toBeInTheDocument();
  });

  it('件数が0の選択肢は無効化されること', () => {
    const optionsWithCounts = [
      { value: 'opt1', label: 'オプション1', count: 10 },
      { value: 'opt2', label: 'オプション2', count: 0 },
    ];

    render(
      <Select
        id="test-select"
        label="テストセレクト"
        options={optionsWithCounts}
        value=""
        onChange={() => {}}
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    const option1 = select.querySelector('option[value="opt1"]') as HTMLOptionElement;
    const option2 = select.querySelector('option[value="opt2"]') as HTMLOptionElement;

    expect(option1.disabled).toBe(false);
    expect(option2.disabled).toBe(true);
  });
});
