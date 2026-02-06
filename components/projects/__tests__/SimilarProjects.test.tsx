/**
 * 類似事業表示コンポーネントのテスト
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';
import type { SimilarProjectDisplay } from '@/types/similarity';
import { SimilarProjects } from '../SimilarProjects';

/**
 * テスト用のラッパーコンポーネント
 */
function renderWithProviders(ui: React.ReactElement) {
  return render(<AmountDisplayProvider>{ui}</AmountDisplayProvider>);
}

describe('SimilarProjects', () => {
  const mockSimilarProjects: SimilarProjectDisplay[] = [
    {
      id: 'P001',
      name: '道路維持管理事業',
      score: 0.85,
      policyName: '安全・安心なまちづくり',
      measureName: '道路整備',
      department: '建設部',
      totalCost: 50000,
    },
    {
      id: 'P002',
      name: '橋梁維持管理事業',
      score: 0.75,
      policyName: '安全・安心なまちづくり',
      measureName: '道路整備',
      department: '建設部',
      totalCost: 45000,
    },
    {
      id: 'P003',
      name: '公園維持管理事業',
      score: 0.65,
      policyName: '安全・安心なまちづくり',
      measureName: '公園整備',
      department: '建設部',
      totalCost: 30000,
    },
  ];

  it('類似事業が表示される', () => {
    renderWithProviders(<SimilarProjects projects={mockSimilarProjects} />);

    expect(screen.getByText('類似している事業')).toBeInTheDocument();
    expect(screen.getByText('道路維持管理事業')).toBeInTheDocument();
    expect(screen.getByText('橋梁維持管理事業')).toBeInTheDocument();
    expect(screen.getByText('公園維持管理事業')).toBeInTheDocument();
  });

  it('類似度スコアがパーセント表示される', () => {
    renderWithProviders(<SimilarProjects projects={mockSimilarProjects} />);

    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('政策・施策情報が表示される', () => {
    renderWithProviders(<SimilarProjects projects={mockSimilarProjects} />);

    // 政策名 > 施策名 の形式で表示される（複数回出現するためgetAllByTextを使用）
    const roadMaintenance = screen.getAllByText('安全・安心なまちづくり > 道路整備');
    expect(roadMaintenance.length).toBeGreaterThan(0);

    const parkMaintenance = screen.getByText('安全・安心なまちづくり > 公園整備');
    expect(parkMaintenance).toBeInTheDocument();
  });

  it('部署名が表示される', () => {
    renderWithProviders(<SimilarProjects projects={mockSimilarProjects} />);

    const departments = screen.getAllByText('建設部');
    expect(departments.length).toBeGreaterThan(0);
  });

  it('事業詳細へのリンクが正しく設定される', () => {
    renderWithProviders(<SimilarProjects projects={mockSimilarProjects} />);

    const link1 = screen.getByText('道路維持管理事業').closest('a') as HTMLAnchorElement;
    expect(link1.href).toContain('/projects/P001');

    const link2 = screen.getByText('橋梁維持管理事業').closest('a') as HTMLAnchorElement;
    expect(link2.href).toContain('/projects/P002');
  });

  it('類似事業がない場合、何も表示されない', () => {
    const { container } = renderWithProviders(<SimilarProjects projects={[]} />);

    expect(container.textContent).toBe('');
  });

  it('類似事業が1件のみの場合も正常に表示される', () => {
    const singleProject = [mockSimilarProjects[0]];
    renderWithProviders(<SimilarProjects projects={singleProject} />);

    expect(screen.getByText('類似している事業')).toBeInTheDocument();
    expect(screen.getByText('道路維持管理事業')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });
});
