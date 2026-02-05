/**
 * Selectコンポーネントのテスト
 *
 * セレクトボックスコンポーネントが正しく動作することを確認します。
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
});
