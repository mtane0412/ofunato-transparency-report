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
      { id: 'P1', name: '政策1' },
      { id: 'P2', name: '政策2' },
    ],
    measures: [
      { id: 'M1', name: '施策1' },
      { id: 'M2', name: '施策2' },
    ],
    basicProjects: [
      { id: 'BP1', name: '基本事業1' },
      { id: 'BP2', name: '基本事業2' },
    ],
    departments: ['総務部', '企画部'],
    categories: ['一般事業', '重点事業'],
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
