/**
 * ProjectTableコンポーネントのテスト
 *
 * 事業一覧テーブルが正しく表示されることを確認します。
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectTable } from './ProjectTable';
import type { Project } from '@/types';

// テスト用のモックデータ
const mockProjects: Project[] = [
  {
    id: '001',
    name: '事業A',
    year: 2024,
    createdAt: '2024-01-01',
    policy: { id: 'P1', name: '政策1' },
    measure: { id: 'M1', name: '施策1' },
    basicProject: { id: 'BP1', name: '基本事業1' },
    department: '総務部',
    manager: '課長A',
    section: '総務課',
    contact: '担当者A',
    category: '一般事業',
    period: { type: '継続' },
    overview: '概要A',
    target: '対象A',
    intent: '意図A',
    result: '結果A',
    legalBasis: '',
    financials: [],
    indicators: [],
    indicatorLabels: {
      activity: [
        { name: '', unit: '' },
        { name: '', unit: '' },
        { name: '', unit: '' },
      ],
      target: [
        { name: '', unit: '' },
        { name: '', unit: '' },
        { name: '', unit: '' },
      ],
      outcome: [
        { name: '', unit: '' },
        { name: '', unit: '' },
        { name: '', unit: '' },
      ],
    },
    evaluation: {
      direction: '改革方向A',
      futureDirection: '今後の方向性A',
      comments: [],
    },
  },
  {
    id: '002',
    name: '事業B',
    year: 2024,
    createdAt: '2024-01-02',
    policy: { id: 'P1', name: '政策1' },
    measure: { id: 'M2', name: '施策2' },
    basicProject: { id: 'BP2', name: '基本事業2' },
    department: '企画部',
    manager: '課長B',
    section: '企画課',
    contact: '担当者B',
    category: '重点事業',
    period: { type: '継続' },
    overview: '概要B',
    target: '対象B',
    intent: '意図B',
    result: '結果B',
    legalBasis: '',
    financials: [],
    indicators: [],
    indicatorLabels: {
      activity: [
        { name: '', unit: '' },
        { name: '', unit: '' },
        { name: '', unit: '' },
      ],
      target: [
        { name: '', unit: '' },
        { name: '', unit: '' },
        { name: '', unit: '' },
      ],
      outcome: [
        { name: '', unit: '' },
        { name: '', unit: '' },
        { name: '', unit: '' },
      ],
    },
    evaluation: {
      direction: '改革方向B',
      futureDirection: '今後の方向性B',
      comments: [],
    },
  },
];

describe('ProjectTable', () => {
  it('事業データが正しく表示されること', () => {
    render(<ProjectTable projects={mockProjects} />);

    // テーブルヘッダーが表示されること
    expect(screen.getByText('事業名')).toBeInTheDocument();
    expect(screen.getByText('政策')).toBeInTheDocument();
    expect(screen.getByText('施策')).toBeInTheDocument();
    expect(screen.getByText('基本事業')).toBeInTheDocument();
    expect(screen.getByText('部署')).toBeInTheDocument();
    expect(screen.getByText('事業区分')).toBeInTheDocument();

    // 事業データが表示されること
    expect(screen.getByText('事業A')).toBeInTheDocument();
    expect(screen.getByText('事業B')).toBeInTheDocument();
    expect(screen.getByText('総務部')).toBeInTheDocument();
    expect(screen.getByText('企画部')).toBeInTheDocument();
  });

  it('データが空の場合、メッセージが表示されること', () => {
    render(<ProjectTable projects={[]} />);

    expect(screen.getByText('該当する事業が見つかりませんでした。')).toBeInTheDocument();
  });

  it('詳細リンクが正しく設定されていること', () => {
    render(<ProjectTable projects={mockProjects} />);

    const links = screen.getAllByRole('link', { name: /事業[AB]/ });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/projects/001');
    expect(links[1]).toHaveAttribute('href', '/projects/002');
  });
});
