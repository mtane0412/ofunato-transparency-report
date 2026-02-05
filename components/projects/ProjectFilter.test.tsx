/**
 * ProjectFilterコンポーネントのテスト
 *
 * フィルターパネルが正しく動作することを確認します。
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectFilter } from './ProjectFilter';
import type { FilterParams } from '@/lib/filter';

describe('ProjectFilter', () => {
  const mockOnFilterChange = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    // 各テスト前にモックをクリア
    mockOnFilterChange.mockClear();
    mockOnReset.mockClear();
  });

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
    directions: [
      { value: '現状維持', label: '現状維持', count: 4 },
      { value: '改革・改善', label: '改革・改善', count: 6 },
    ],
    futureDirections: [
      { value: '拡充', label: '拡充', count: 3 },
      { value: '縮小', label: '縮小', count: 7 },
    ],
  };

  it('キーワード検索入力フィールドが表示されること', () => {
    render(<ProjectFilter {...defaultProps} />);

    const searchInput = screen.getByLabelText('キーワード検索');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', '事業名で検索...（Enterで適用 / 削除は自動反映）');
  });

  it('すべてのフィルター項目が表示されること', () => {
    render(<ProjectFilter {...defaultProps} />);

    expect(screen.getByLabelText('政策')).toBeInTheDocument();
    expect(screen.getByLabelText('施策')).toBeInTheDocument();
    expect(screen.getByLabelText('基本事業')).toBeInTheDocument();
    expect(screen.getByLabelText('部署')).toBeInTheDocument();
    expect(screen.getByLabelText('事業区分')).toBeInTheDocument();
    expect(screen.getByLabelText('改革改善の方向性')).toBeInTheDocument();
    expect(screen.getByLabelText('今後の方向性')).toBeInTheDocument();
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

  it('改革改善の方向性を選択したときonFilterChangeが呼ばれること', async () => {
    const user = userEvent.setup();
    render(<ProjectFilter {...defaultProps} />);

    const directionSelect = screen.getByLabelText('改革改善の方向性');
    await user.selectOptions(directionSelect, '現状維持');

    expect(mockOnFilterChange).toHaveBeenCalledWith({ direction: '現状維持' });
  });

  it('今後の方向性を選択したときonFilterChangeが呼ばれること', async () => {
    const user = userEvent.setup();
    render(<ProjectFilter {...defaultProps} />);

    const futureDirectionSelect = screen.getByLabelText('今後の方向性');
    await user.selectOptions(futureDirectionSelect, '拡充');

    expect(mockOnFilterChange).toHaveBeenCalledWith({ futureDirection: '拡充' });
  });

  it('キーワードを入力してEnterを押したときonFilterChangeが呼ばれること', async () => {
    const user = userEvent.setup();
    render(<ProjectFilter {...defaultProps} />);

    const searchInput = screen.getByLabelText('キーワード検索') as HTMLInputElement;

    // キーワードを入力
    await user.type(searchInput, 'テスト事業');

    // Enterキーを押す前はまだ呼ばれていない
    expect(mockOnFilterChange).not.toHaveBeenCalled();

    // Enterキーを押す
    await user.keyboard('{Enter}');

    // onFilterChangeが呼ばれる
    expect(mockOnFilterChange).toHaveBeenCalledWith({ q: 'テスト事業' });
  });

  it('既存のキーワードが入力フィールドに反映されること', () => {
    const filtersWithKeyword: FilterParams = {
      q: '検索キーワード',
    };

    render(<ProjectFilter {...defaultProps} filters={filtersWithKeyword} />);

    const searchInput = screen.getByLabelText('キーワード検索') as HTMLInputElement;
    expect(searchInput.value).toBe('検索キーワード');
  });

  it('文字を削除したとき即座にonFilterChangeが呼ばれること', async () => {
    const user = userEvent.setup();
    const filtersWithKeyword: FilterParams = {
      q: 'テスト事業',
    };

    render(<ProjectFilter {...defaultProps} filters={filtersWithKeyword} />);

    const searchInput = screen.getByLabelText('キーワード検索') as HTMLInputElement;

    // 末尾の1文字を削除（Backspace）
    await user.click(searchInput);
    await user.keyboard('{Backspace}');

    // 文字削除時は即座にonFilterChangeが呼ばれる
    expect(mockOnFilterChange).toHaveBeenCalledWith({ q: 'テスト事' });
  });

  it('文字を追加したときはEnterを押すまでonFilterChangeが呼ばれないこと', async () => {
    const user = userEvent.setup();
    const filtersWithKeyword: FilterParams = {
      q: 'テスト',
    };

    render(<ProjectFilter {...defaultProps} filters={filtersWithKeyword} />);

    const searchInput = screen.getByLabelText('キーワード検索') as HTMLInputElement;

    // 末尾に文字を追加
    await user.click(searchInput);
    await user.keyboard('事業');

    // 文字追加時は即座には呼ばれない
    expect(mockOnFilterChange).not.toHaveBeenCalled();

    // Enterキーを押す
    await user.keyboard('{Enter}');

    // Enterキー押下後にonFilterChangeが呼ばれる
    expect(mockOnFilterChange).toHaveBeenCalledWith({ q: 'テスト事業' });
  });
});
