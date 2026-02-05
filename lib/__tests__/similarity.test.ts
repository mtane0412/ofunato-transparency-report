/**
 * 類似度計算ロジックのテスト
 */

import { describe, it, expect } from 'vitest';
import {
  calculateHierarchySimilarity,
  calculateTextSimilarity,
  calculateFinancialSimilarity,
  calculateAttributeSimilarity,
  calculateSimilarityScore,
  findSimilarProjects,
} from '../similarity';
import type { Project } from '@/types';

describe('類似度計算ロジック', () => {
  // テスト用のサンプル事業データ
  const project1: Project = {
    id: 'P001',
    name: '道路維持管理事業',
    year: 2024,
    createdAt: '2024-04-01',
    policy: { id: 'POL1', name: '安全・安心なまちづくり' },
    measure: { id: 'MES1', name: '道路整備' },
    basicProject: { id: 'BP1', name: '市道維持管理' },
    department: '建設部',
    manager: '山田太郎',
    section: '維持係',
    contact: '佐藤花子',
    category: '一般',
    period: { type: '継続', start: '2020' },
    overview: '市道の舗装補修や除草作業を実施する',
    target: '市内全域の市道',
    intent: '安全な道路環境を維持する',
    result: '舗装補修を100箇所実施した',
    legalBasis: '',
    financials: [
      {
        year: 2024,
        nationalSubsidy: 0,
        prefecturalSubsidy: 0,
        localBond: 0,
        other: 0,
        generalRevenue: 50000,
        totalCost: 50000,
        personnelCount: 1,
        workHours: 100,
        personnelCost: 5000,
        grandTotal: 55000,
      },
    ],
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
      direction: '現状維持',
      futureDirection: '現状維持',
      comments: [],
    },
  };

  const project2: Project = {
    id: 'P002',
    name: '橋梁維持管理事業',
    year: 2024,
    createdAt: '2024-04-01',
    policy: { id: 'POL1', name: '安全・安心なまちづくり' },
    measure: { id: 'MES1', name: '道路整備' },
    basicProject: { id: 'BP2', name: '橋梁維持管理' },
    department: '建設部',
    manager: '山田太郎',
    section: '維持係',
    contact: '鈴木一郎',
    category: '一般',
    period: { type: '継続', start: '2020' },
    overview: '橋梁の点検と補修を実施する',
    target: '市内の全橋梁',
    intent: '安全な橋梁環境を維持する',
    result: '点検を50橋実施した',
    legalBasis: '',
    financials: [
      {
        year: 2024,
        nationalSubsidy: 0,
        prefecturalSubsidy: 0,
        localBond: 0,
        other: 0,
        generalRevenue: 45000,
        totalCost: 45000,
        personnelCount: 1,
        workHours: 100,
        personnelCost: 5000,
        grandTotal: 50000,
      },
    ],
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
      direction: '現状維持',
      futureDirection: '現状維持',
      comments: [],
    },
  };

  const project3: Project = {
    id: 'P003',
    name: '観光振興事業',
    year: 2024,
    createdAt: '2024-04-01',
    policy: { id: 'POL2', name: '産業振興' },
    measure: { id: 'MES2', name: '観光振興' },
    basicProject: { id: 'BP3', name: '観光プロモーション' },
    department: '商工観光部',
    manager: '田中次郎',
    section: '観光係',
    contact: '高橋三郎',
    category: '政策事業',
    period: { type: '継続', start: '2023', end: '2027' },
    overview: '観光客誘致のためのプロモーション活動',
    target: '国内外の観光客',
    intent: '観光客数を増加させる',
    result: 'イベントを10回開催した',
    legalBasis: '',
    financials: [
      {
        year: 2024,
        nationalSubsidy: 0,
        prefecturalSubsidy: 0,
        localBond: 0,
        other: 0,
        generalRevenue: 10000,
        totalCost: 10000,
        personnelCount: 1,
        workHours: 100,
        personnelCost: 2000,
        grandTotal: 12000,
      },
    ],
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
      direction: '拡大',
      futureDirection: '拡大',
      comments: [],
    },
  };

  describe('calculateHierarchySimilarity', () => {
    it('基本事業IDが一致する場合、スコアは1.0', () => {
      const proj1 = { ...project1, basicProject: { id: 'BP1', name: 'test' } };
      const proj2 = { ...project2, basicProject: { id: 'BP1', name: 'test' } };
      expect(calculateHierarchySimilarity(proj1, proj2)).toBe(1.0);
    });

    it('基本事業IDは異なるが施策IDが一致する場合、スコアは0.7', () => {
      const proj1 = {
        ...project1,
        basicProject: { id: 'BP1', name: 'test' },
        measure: { id: 'MES1', name: 'test' },
      };
      const proj2 = {
        ...project2,
        basicProject: { id: 'BP2', name: 'test' },
        measure: { id: 'MES1', name: 'test' },
      };
      expect(calculateHierarchySimilarity(proj1, proj2)).toBe(0.7);
    });

    it('施策IDは異なるが政策IDが一致する場合、スコアは0.3', () => {
      const proj1 = {
        ...project1,
        measure: { id: 'MES1', name: 'test' },
        policy: { id: 'POL1', name: 'test' },
      };
      const proj2 = {
        ...project2,
        measure: { id: 'MES2', name: 'test' },
        policy: { id: 'POL1', name: 'test' },
      };
      expect(calculateHierarchySimilarity(proj1, proj2)).toBe(0.3);
    });

    it('すべて不一致の場合、スコアは0.0', () => {
      expect(calculateHierarchySimilarity(project1, project3)).toBe(0.0);
    });
  });

  describe('calculateTextSimilarity', () => {
    it('同じテキストの場合、スコアは1.0', () => {
      expect(calculateTextSimilarity(project1, project1)).toBe(1.0);
    });

    it('類似したテキストの場合、スコアは0より大きい', () => {
      const score = calculateTextSimilarity(project1, project2);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1.0);
    });

    it('全く異なるテキストの場合、スコアは0以上1以下', () => {
      const score = calculateTextSimilarity(project1, project3);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1.0);
    });
  });

  describe('calculateFinancialSimilarity', () => {
    it('同じ予算の場合、スコアは1.0', () => {
      expect(calculateFinancialSimilarity(project1, project1)).toBe(1.0);
    });

    it('近い予算の場合、スコアは高い', () => {
      const score = calculateFinancialSimilarity(project1, project2);
      expect(score).toBeGreaterThan(0.8);
      expect(score).toBeLessThanOrEqual(1.0);
    });

    it('異なる予算の場合、スコアは0以上1以下', () => {
      const score = calculateFinancialSimilarity(project1, project3);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1.0);
    });

    it('財政データがない事業同士の場合、スコアは0.0', () => {
      const proj1 = { ...project1, financials: [] };
      const proj2 = { ...project2, financials: [] };
      expect(calculateFinancialSimilarity(proj1, proj2)).toBe(0.0);
    });
  });

  describe('calculateAttributeSimilarity', () => {
    it('すべての属性が一致する場合、スコアは1.0', () => {
      const proj2 = {
        ...project2,
        department: project1.department,
        category: project1.category,
        evaluation: { ...project1.evaluation },
      };
      expect(calculateAttributeSimilarity(project1, proj2)).toBe(1.0);
    });

    it('部署のみ一致する場合、スコアは0.4', () => {
      const proj2 = {
        ...project2,
        department: project1.department,
        category: '政策',
        evaluation: { ...project2.evaluation, futureDirection: '拡大' },
      };
      expect(calculateAttributeSimilarity(project1, proj2)).toBe(0.4);
    });

    it('すべて不一致の場合、スコアは0.0', () => {
      expect(calculateAttributeSimilarity(project1, project3)).toBe(0.0);
    });
  });

  describe('calculateSimilarityScore', () => {
    it('同じ事業の場合、スコアは1.0に近い', () => {
      const score = calculateSimilarityScore(project1, project1);
      expect(score).toBeGreaterThan(0.95);
      expect(score).toBeLessThanOrEqual(1.0);
    });

    it('異なる事業の場合、スコアは0〜1の範囲', () => {
      const score = calculateSimilarityScore(project1, project2);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1.0);
    });

    it('全く異なる事業の場合、スコアは0〜1の範囲', () => {
      const score = calculateSimilarityScore(project1, project3);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1.0);
    });
  });

  describe('findSimilarProjects', () => {
    it('指定した件数の類似事業を返す', () => {
      const projects = [project1, project2, project3];
      const similar = findSimilarProjects(project1, projects, 2);
      expect(similar).toHaveLength(2);
    });

    it('スコアの降順でソートされている', () => {
      const projects = [project1, project2, project3];
      const similar = findSimilarProjects(project1, projects, 2);
      expect(similar[0].score).toBeGreaterThanOrEqual(similar[1].score);
    });

    it('自分自身は除外される', () => {
      const projects = [project1, project2, project3];
      const similar = findSimilarProjects(project1, projects, 3);
      expect(similar.every((s: { id: string }) => s.id !== project1.id)).toBe(
        true
      );
    });

    it('利用可能な事業数より多い件数を指定しても、全事業数-1を返す', () => {
      const projects = [project1, project2];
      const similar = findSimilarProjects(project1, projects, 10);
      expect(similar).toHaveLength(1);
    });
  });
});
