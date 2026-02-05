/**
 * ProjectFilterコンポーネントのテスト
 *
 * フィルターパネルが正しく動作することを確認します。
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectFilter } from './ProjectFilter';
import type { FilterParams } from '@/lib/filter';

describe('ProjectFilter', () => {
  const mockOnFilterChange = vi.fn();
  const mockOnReset = vi.fn();

  const defaultProps = {
    filters: {} as FilterParams,
    onFilterChange: mockOnFilterChange,
    onReset: mockOnReset,
    policies: [
      { value: 'P1', label: '政策1', count: 10 },
      { value: 'P2', label: '政策2', count: 5 },
    ],
    measures: [
      { value: 'M1', label: '施策1', count: 8 },
      { value: 'M2', label: '施策2', count: 2 },
    ],
    basicProjects: [
      { value: 'BP1', label: '基本事業1', count: 6 },
      { value: 'BP2', label: '基本事業2', count: 4 },
    ],
    departments: [
      { value: '総務部', label: '総務部', count: 7 },
      { value: '企画部', label: '企画部', count: 3 },
    ],
    categories: [
      { value: '一般事業', label: '一般事業', count: 5 },
      { value: '重点事業', label: '重点事業', count: 5 },
    ],
  };

  it('すべてのフィルター項目が表示されること', () => {
    render(<ProjectFilter {...defaultProps} />);

    expect(screen.getByLabelText('政策')).toBeInTheDocument();
    expect(screen.getByLabelText('施策')).toBeInTheDocument();
    expect(screen.getByLabelText('基本事業')).toBeInTheDocument();
    expect(screen.getByLabelText('部署')).toBeInTheDocument();
    expect(screen.getByLabelText('事業区分')).toBeInTheDocument();
  });

  it('リセットボタンが表示されること', () => {
    render(<ProjectFilter {...defaultProps} />);

    expect(screen.getByRole('button', { name: /リセット/ })).toBeInTheDocument();
  });

  it('政策を選択したときonFilterChangeが呼ばれること', async () => {
    const user = userEvent.setup();
    render(<ProjectFilter {...defaultProps} />);

    const policySelect = screen.getByLabelText('政策');
    await user.selectOptions(policySelect, 'P1');

    expect(mockOnFilterChange).toHaveBeenCalledWith({ policy: 'P1' });
  });

  it('リセットボタンをクリックしたときonResetが呼ばれること', async () => {
    const user = userEvent.setup();
    render(<ProjectFilter {...defaultProps} />);

    const resetButton = screen.getByRole('button', { name: /リセット/ });
    await user.click(resetButton);

    expect(mockOnReset).toHaveBeenCalled();
  });

  it('選択された値が正しく反映されること', () => {
    const filtersWithValues: FilterParams = {
      policy: 'P1',
      department: '総務部',
    };

    render(<ProjectFilter {...defaultProps} filters={filtersWithValues} />);

    const policySelect = screen.getByLabelText('政策') as HTMLSelectElement;
    const departmentSelect = screen.getByLabelText('部署') as HTMLSelectElement;

    expect(policySelect.value).toBe('P1');
    expect(departmentSelect.value).toBe('総務部');
  });
});
