/**
 * lib/analysis-data.ts の予算分析用データ集計関数のテスト
 */

import { describe, expect, it } from 'vitest';
import type { Project } from '@/types';
import {
  aggregateBudgetByDepartment,
  aggregateBudgetByPolicyAndYear,
  aggregateRevenueSourceTotal,
  aggregateYearlyTotalBudget,
} from './analysis-data';

// テスト用のモックプロジェクトデータ
const mockProjects: Project[] = [
  {
    id: 'proj-001',
    name: '事業A',
    year: 7,
    createdAt: '2024-01-01',
    policy: { id: '01', name: '政策1' },
    measure: { id: '01-01', name: '施策1-1' },
    basicProject: { id: '01-01-01', name: '基本事業1-1-1' },
    department: '総務部総務課',
    manager: '山田太郎',
    section: '総務係',
    contact: '鈴木花子',
    category: '政策事業',
    period: { type: '継続' },
    overview: '事業Aの概要',
    target: '市民',
    intent: '効率化',
    result: '達成',
    legalBasis: '',
    financials: [
      {
        year: 2,
        nationalSubsidy: 1000,
        prefecturalSubsidy: 500,
        localBond: 200,
        other: 100,
        generalRevenue: 300,
        totalCost: 2100,
        personnelCount: 2,
        workHours: 1600,
        personnelCost: 800,
        grandTotal: 2900,
      },
      {
        year: 3,
        nationalSubsidy: 1200,
        prefecturalSubsidy: 600,
        localBond: 300,
        other: 150,
        generalRevenue: 350,
        totalCost: 2600,
        personnelCount: 2,
        workHours: 1600,
        personnelCost: 800,
        grandTotal: 3400,
      },
      {
        year: 7,
        nationalSubsidy: 1500,
        prefecturalSubsidy: 700,
        localBond: 400,
        other: 200,
        generalRevenue: 400,
        totalCost: 3200,
        personnelCount: 3,
        workHours: 2400,
        personnelCost: 1200,
        grandTotal: 4400,
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
      direction: '維持',
      futureDirection: '継続',
      comments: [],
    },
  },
  {
    id: 'proj-002',
    name: '事業B',
    year: 7,
    createdAt: '2024-01-01',
    policy: { id: '02', name: '政策2' },
    measure: { id: '02-01', name: '施策2-1' },
    basicProject: { id: '02-01-01', name: '基本事業2-1-1' },
    department: '保健福祉部　こども家庭センター',
    manager: '佐藤次郎',
    section: '福祉係',
    contact: '田中一郎',
    category: '一般',
    period: { type: '新規' },
    overview: '事業Bの概要',
    target: '高齢者',
    intent: '支援',
    result: '達成',
    legalBasis: '',
    financials: [
      {
        year: 2,
        nationalSubsidy: 500,
        prefecturalSubsidy: 250,
        localBond: 0,
        other: 50,
        generalRevenue: 200,
        totalCost: 1000,
        personnelCount: 1,
        workHours: 800,
        personnelCost: 400,
        grandTotal: 1400,
      },
      {
        year: 3,
        nationalSubsidy: 600,
        prefecturalSubsidy: 300,
        localBond: 0,
        other: 60,
        generalRevenue: 240,
        totalCost: 1200,
        personnelCount: 1,
        workHours: 800,
        personnelCost: 400,
        grandTotal: 1600,
      },
      {
        year: 7,
        nationalSubsidy: 800,
        prefecturalSubsidy: 400,
        localBond: 0,
        other: 80,
        generalRevenue: 320,
        totalCost: 1600,
        personnelCount: 2,
        workHours: 1600,
        personnelCost: 800,
        grandTotal: 2400,
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
      direction: '改善',
      futureDirection: '拡大',
      comments: [],
    },
  },
  {
    id: 'proj-003',
    name: '事業C',
    year: 7,
    createdAt: '2024-01-01',
    policy: { id: '01', name: '政策1' },
    measure: { id: '01-02', name: '施策1-2' },
    basicProject: { id: '01-02-01', name: '基本事業1-2-1' },
    department: '総務部総務課',
    manager: '高橋三郎',
    section: '企画係',
    contact: '伊藤四郎',
    category: '施設管理',
    period: { type: '継続' },
    overview: '事業Cの概要',
    target: '市内全域',
    intent: '維持管理',
    result: '達成',
    legalBasis: '',
    financials: [
      {
        year: 2,
        nationalSubsidy: 0,
        prefecturalSubsidy: 0,
        localBond: 500,
        other: 100,
        generalRevenue: 400,
        totalCost: 1000,
        personnelCount: 1,
        workHours: 800,
        personnelCost: 400,
        grandTotal: 1400,
      },
      {
        year: 3,
        nationalSubsidy: 0,
        prefecturalSubsidy: 0,
        localBond: 600,
        other: 120,
        generalRevenue: 480,
        totalCost: 1200,
        personnelCount: 1,
        workHours: 800,
        personnelCost: 400,
        grandTotal: 1600,
      },
      {
        year: 7,
        nationalSubsidy: 0,
        prefecturalSubsidy: 0,
        localBond: 800,
        other: 160,
        generalRevenue: 640,
        totalCost: 1600,
        personnelCount: 2,
        workHours: 1600,
        personnelCost: 800,
        grandTotal: 2400,
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
      direction: '維持',
      futureDirection: '継続',
      comments: [],
    },
  },
];

describe('aggregateYearlyTotalBudget', () => {
  it('年度別の総予算を正しく集計し、年度順にソートする', () => {
    const result = aggregateYearlyTotalBudget(mockProjects);

    // 3年度分のデータがあることを確認
    expect(result).toHaveLength(3);

    // 年度順（R2, R3, R7）にソートされていることを確認
    expect(result[0]).toEqual({ year: 'R2', budget: 5700 }); // 2900 + 1400 + 1400
    expect(result[1]).toEqual({ year: 'R3', budget: 6600 }); // 3400 + 1600 + 1600
    expect(result[2]).toEqual({ year: 'R7', budget: 9200 }); // 4400 + 2400 + 2400
  });

  it('空の配列を渡した場合、空の配列を返す', () => {
    const result = aggregateYearlyTotalBudget([]);
    expect(result).toEqual([]);
  });
});

describe('aggregateBudgetByDepartment', () => {
  it('最新年度の予算を部署別に集計し、予算降順でソートする', () => {
    const result = aggregateBudgetByDepartment(mockProjects);

    // 2部署のデータがあることを確認
    expect(result).toHaveLength(2);

    // 予算降順でソートされていることを確認
    expect(result[0].name).toBe('総務部総務課');
    expect(result[0].budget).toBe(6800); // proj-001: 4400 + proj-003: 2400
    expect(result[0].count).toBe(2);

    expect(result[1].name).toBe('保健福祉部こども家庭センター'); // 全角スペース除去
    expect(result[1].budget).toBe(2400);
    expect(result[1].count).toBe(1);
  });

  it('部署名の全角スペースを除去して正規化する', () => {
    const result = aggregateBudgetByDepartment(mockProjects);

    // 全角スペースが除去されていることを確認
    const normalized = result.find(
      (d: { name: string; budget: number; count: number }) =>
        d.name === '保健福祉部こども家庭センター'
    );
    expect(normalized).toBeDefined();
    expect(normalized?.budget).toBe(2400);
  });

  it('空の配列を渡した場合、空の配列を返す', () => {
    const result = aggregateBudgetByDepartment([]);
    expect(result).toEqual([]);
  });
});

describe('aggregateRevenueSourceTotal', () => {
  it('最新年度の5種類の財源を集計し、金額降順でソートする', () => {
    const result = aggregateRevenueSourceTotal(mockProjects);

    // 5種類の財源が集計されることを確認
    expect(result).toHaveLength(5);

    // 合計値の確認
    const totalNationalSubsidy = 1500 + 800 + 0; // 2300
    const totalPrefecturalSubsidy = 700 + 400 + 0; // 1100
    const totalLocalBond = 400 + 0 + 800; // 1200
    const totalOther = 200 + 80 + 160; // 440
    const totalGeneralRevenue = 400 + 320 + 640; // 1360

    // 金額降順でソートされていることを確認
    expect(result[0]).toEqual({ name: '国庫支出金', value: totalNationalSubsidy });
    expect(result[1]).toEqual({ name: '一般財源', value: totalGeneralRevenue });
    expect(result[2]).toEqual({ name: '地方債', value: totalLocalBond });
    expect(result[3]).toEqual({ name: '都道府県支出金', value: totalPrefecturalSubsidy });
    expect(result[4]).toEqual({ name: 'その他', value: totalOther });
  });

  it('空の配列を渡した場合、5種類の財源がすべて0で返される', () => {
    const result = aggregateRevenueSourceTotal([]);

    expect(result).toHaveLength(5);
    result.forEach((item: { name: string; value: number }) => {
      expect(item.value).toBe(0);
    });
  });
});

describe('aggregateBudgetByPolicyAndYear', () => {
  it('政策別・年度別の予算を集計し、年度順にソートする', () => {
    const result = aggregateBudgetByPolicyAndYear(mockProjects);

    // データ配列の確認
    expect(result.data).toHaveLength(3); // 3年度分

    // 政策名一覧の確認
    expect(result.policyNames).toHaveLength(2);
    expect(result.policyNames).toContain('政策1');
    expect(result.policyNames).toContain('政策2');

    // R2年度のデータ確認
    const r2Data = result.data.find(
      (d: { year: string; [key: string]: string | number }) => d.year === 'R2'
    );
    expect(r2Data).toBeDefined();
    expect(r2Data?.政策1).toBe(4300); // proj-001: 2900 + proj-003: 1400
    expect(r2Data?.政策2).toBe(1400); // proj-002: 1400

    // R3年度のデータ確認
    const r3Data = result.data.find(
      (d: { year: string; [key: string]: string | number }) => d.year === 'R3'
    );
    expect(r3Data).toBeDefined();
    expect(r3Data?.政策1).toBe(5000); // proj-001: 3400 + proj-003: 1600
    expect(r3Data?.政策2).toBe(1600); // proj-002: 1600

    // R7年度のデータ確認
    const r7Data = result.data.find(
      (d: { year: string; [key: string]: string | number }) => d.year === 'R7'
    );
    expect(r7Data).toBeDefined();
    expect(r7Data?.政策1).toBe(6800); // proj-001: 4400 + proj-003: 2400
    expect(r7Data?.政策2).toBe(2400); // proj-002: 2400
  });

  it('空の配列を渡した場合、空のデータと政策名を返す', () => {
    const result = aggregateBudgetByPolicyAndYear([]);

    expect(result.data).toEqual([]);
    expect(result.policyNames).toEqual([]);
  });

  it('政策名の表記揺れを吸収し、最も使用頻度の高い名前を使用する', () => {
    // 同じ政策ID「01」で異なる名前を持つプロジェクトを作成
    const projectsWithVariations: Project[] = [
      {
        ...mockProjects[0], // proj-001（政策1）
        policy: { id: '01', name: '政策1' },
      },
      {
        ...mockProjects[2], // proj-003（政策1）
        policy: { id: '01', name: '政策１' }, // 全角数字の表記揺れ
      },
      {
        ...mockProjects[0],
        id: 'proj-004', // idを明示的に上書き
        policy: { id: '01', name: '政策1' }, // 再度「政策1」
      },
    ];

    const result = aggregateBudgetByPolicyAndYear(projectsWithVariations);

    // 「政策1」が2回、「政策１」が1回出現するため、「政策1」が選択される
    expect(result.policyNames).toHaveLength(1);
    expect(result.policyNames[0]).toBe('政策1');

    // R2年度のデータ確認（すべて「政策1」として集約される）
    const r2Data = result.data.find(
      (d: { year: string; [key: string]: string | number }) => d.year === 'R2'
    );
    expect(r2Data).toBeDefined();
    expect(r2Data?.政策1).toBe(7200); // 2900 + 1400 + 2900
    expect(r2Data?.政策１).toBeUndefined(); // 表記揺れは集約される
  });
});
