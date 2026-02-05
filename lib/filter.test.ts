/**
 * フィルタリングロジックのテスト
 *
 * 事業データのフィルタリング機能とカスケード選択肢の取得機能をテストします。
 */
import { describe, it, expect } from 'vitest';
import type { Project } from '@/types';
import {
  filterProjects,
  getAvailableMeasures,
  getAvailableBasicProjects,
  getFilterOptionCounts,
} from './filter';

// テスト用の共通定数
const EMPTY_INDICATOR_LABELS: Project['indicatorLabels'] = {
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
};

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
    indicatorLabels: EMPTY_INDICATOR_LABELS,
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
    indicatorLabels: EMPTY_INDICATOR_LABELS,
    evaluation: {
      direction: '改革方向B',
      futureDirection: '今後の方向性B',
      comments: [],
    },
  },
  {
    id: '003',
    name: '事業C',
    year: 2024,
    createdAt: '2024-01-03',
    policy: { id: 'P2', name: '政策2' },
    measure: { id: 'M3', name: '施策3' },
    basicProject: { id: 'BP3', name: '基本事業3' },
    department: '総務部',
    manager: '課長C',
    section: '財政課',
    contact: '担当者C',
    category: '一般事業',
    period: { type: '継続' },
    overview: '概要C',
    target: '対象C',
    intent: '意図C',
    result: '結果C',
    legalBasis: '',
    financials: [],
    indicators: [],
    indicatorLabels: EMPTY_INDICATOR_LABELS,
    evaluation: {
      direction: '改革方向C',
      futureDirection: '今後の方向性C',
      comments: [],
    },
  },
];

describe('filter.ts', () => {
  describe('filterProjects', () => {
    it('フィルターパラメータなしの場合は全データを返すこと', () => {
      const result = filterProjects(mockProjects, {});
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockProjects);
    });

    it('政策でフィルタリングできること', () => {
      const result = filterProjects(mockProjects, { policy: 'P1' });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('001');
      expect(result[1].id).toBe('002');
    });

    it('施策でフィルタリングできること', () => {
      const result = filterProjects(mockProjects, { measure: 'M1' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('001');
    });

    it('基本事業でフィルタリングできること', () => {
      const result = filterProjects(mockProjects, { basicProject: 'BP2' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('002');
    });

    it('部署でフィルタリングできること', () => {
      const result = filterProjects(mockProjects, { department: '総務部' });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('001');
      expect(result[1].id).toBe('003');
    });

    it('事業区分でフィルタリングできること', () => {
      const result = filterProjects(mockProjects, { category: '重点事業' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('002');
    });

    it('改革改善の方向性でフィルタリングできること', () => {
      const result = filterProjects(mockProjects, { direction: '改革方向A' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('001');
    });

    it('今後の方向性でフィルタリングできること', () => {
      const result = filterProjects(mockProjects, { futureDirection: '今後の方向性B' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('002');
    });

    it('複数条件でフィルタリングできること（AND条件）', () => {
      const result = filterProjects(mockProjects, {
        policy: 'P1',
        department: '総務部',
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('001');
    });

    it('方向性と他フィルターの複合条件でフィルタリングできること', () => {
      const result = filterProjects(mockProjects, {
        direction: '改革方向A',
        department: '総務部',
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('001');

      // 条件に該当しないケース
      const result2 = filterProjects(mockProjects, {
        direction: '改革方向A',
        department: '企画部',
      });
      expect(result2).toHaveLength(0);
    });

    it('該当するデータがない場合は空配列を返すこと', () => {
      const result = filterProjects(mockProjects, { policy: 'NONEXISTENT' });
      expect(result).toHaveLength(0);
    });

    it('キーワードに一致する事業名のみを返すこと', () => {
      const result = filterProjects(mockProjects, { q: '事業A' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('001');
    });

    it('部分一致で検索できること', () => {
      const result = filterProjects(mockProjects, { q: '事業' });
      expect(result).toHaveLength(3);
    });

    it('キーワードが空文字/undefinedの場合は全データを返すこと', () => {
      const result1 = filterProjects(mockProjects, { q: '' });
      expect(result1).toHaveLength(3);

      const result2 = filterProjects(mockProjects, { q: undefined });
      expect(result2).toHaveLength(3);
    });

    it('該当しないキーワードの場合は空配列を返すこと', () => {
      const result = filterProjects(mockProjects, { q: '存在しない事業名' });
      expect(result).toHaveLength(0);
    });

    it('他のフィルターとAND条件で組み合わせられること', () => {
      const result = filterProjects(mockProjects, {
        q: '事業',
        department: '総務部',
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('001');
      expect(result[1].id).toBe('003');
    });

    it('大文字小文字を区別せず検索できること', () => {
      // モックデータに大文字小文字が混在する事業名を一時的に追加
      const projectWithMixedCase: Project = {
        ...mockProjects[0],
        id: '004',
        name: 'ABC事業',
      };
      const testData = [...mockProjects, projectWithMixedCase];

      const result1 = filterProjects(testData, { q: 'abc' });
      expect(result1).toHaveLength(1);
      expect(result1[0].id).toBe('004');

      const result2 = filterProjects(testData, { q: 'ABC' });
      expect(result2).toHaveLength(1);
      expect(result2[0].id).toBe('004');
    });
  });

  describe('getAvailableMeasures', () => {
    it('政策IDを指定した場合、その政策に属する施策のみを返すこと', () => {
      const result = getAvailableMeasures(mockProjects, 'P1');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 'M1', name: '施策1' });
      expect(result[1]).toEqual({ id: 'M2', name: '施策2' });
    });

    it('政策IDを指定しない場合、全施策を返すこと', () => {
      const result = getAvailableMeasures(mockProjects);
      expect(result).toHaveLength(3);
    });

    it('存在しない政策IDの場合は空配列を返すこと', () => {
      const result = getAvailableMeasures(mockProjects, 'NONEXISTENT');
      expect(result).toHaveLength(0);
    });

    it('IDで昇順ソートされていること', () => {
      const result = getAvailableMeasures(mockProjects);
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].id.localeCompare(result[i + 1].id)).toBeLessThanOrEqual(0);
      }
    });

    it('重複がないこと', () => {
      const result = getAvailableMeasures(mockProjects);
      const ids = result.map((measure) => measure.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('getAvailableBasicProjects', () => {
    it('施策IDを指定した場合、その施策に属する基本事業のみを返すこと', () => {
      const result = getAvailableBasicProjects(mockProjects, 'M1');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: 'BP1', name: '基本事業1' });
    });

    it('施策IDを指定しない場合、全基本事業を返すこと', () => {
      const result = getAvailableBasicProjects(mockProjects);
      expect(result).toHaveLength(3);
    });

    it('存在しない施策IDの場合は空配列を返すこと', () => {
      const result = getAvailableBasicProjects(mockProjects, 'NONEXISTENT');
      expect(result).toHaveLength(0);
    });

    it('IDで昇順ソートされていること', () => {
      const result = getAvailableBasicProjects(mockProjects);
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].id.localeCompare(result[i + 1].id)).toBeLessThanOrEqual(0);
      }
    });

    it('重複がないこと', () => {
      const result = getAvailableBasicProjects(mockProjects);
      const ids = result.map((basicProject) => basicProject.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('getFilterOptionCounts', () => {
    it('現在のフィルター条件に基づいて各選択肢の件数を返すこと', () => {
      const result = getFilterOptionCounts(mockProjects, {});

      // 政策の件数
      expect(result.policies.get('P1')).toBe(2);
      expect(result.policies.get('P2')).toBe(1);

      // 施策の件数
      expect(result.measures.get('M1')).toBe(1);
      expect(result.measures.get('M2')).toBe(1);
      expect(result.measures.get('M3')).toBe(1);

      // 基本事業の件数
      expect(result.basicProjects.get('BP1')).toBe(1);
      expect(result.basicProjects.get('BP2')).toBe(1);
      expect(result.basicProjects.get('BP3')).toBe(1);

      // 部署の件数
      expect(result.departments.get('総務部')).toBe(2);
      expect(result.departments.get('企画部')).toBe(1);

      // 事業区分の件数
      expect(result.categories.get('一般事業')).toBe(2);
      expect(result.categories.get('重点事業')).toBe(1);

      // 改革改善の方向性の件数
      expect(result.directions.get('改革方向A')).toBe(1);
      expect(result.directions.get('改革方向B')).toBe(1);
      expect(result.directions.get('改革方向C')).toBe(1);

      // 今後の方向性の件数
      expect(result.futureDirections.get('今後の方向性A')).toBe(1);
      expect(result.futureDirections.get('今後の方向性B')).toBe(1);
      expect(result.futureDirections.get('今後の方向性C')).toBe(1);
    });

    it('政策フィルター適用時、施策と基本事業の件数が絞り込まれること', () => {
      const result = getFilterOptionCounts(mockProjects, { policy: 'P1' });

      // 施策の件数（P1に属する施策のみ）
      expect(result.measures.get('M1')).toBe(1);
      expect(result.measures.get('M2')).toBe(1);
      expect(result.measures.get('M3')).toBeUndefined(); // P2に属するためカウントされない

      // 基本事業の件数（P1に属する基本事業のみ）
      expect(result.basicProjects.get('BP1')).toBe(1);
      expect(result.basicProjects.get('BP2')).toBe(1);
      expect(result.basicProjects.get('BP3')).toBeUndefined(); // P2に属するためカウントされない
    });

    it('施策フィルター適用時、基本事業の件数が絞り込まれること', () => {
      const result = getFilterOptionCounts(mockProjects, { measure: 'M1' });

      // 基本事業の件数（M1に属する基本事業のみ）
      expect(result.basicProjects.get('BP1')).toBe(1);
      expect(result.basicProjects.get('BP2')).toBeUndefined(); // M2に属するためカウントされない
      expect(result.basicProjects.get('BP3')).toBeUndefined(); // M3に属するためカウントされない
    });

    it('複数のフィルター適用時、正しく件数が計算されること', () => {
      const result = getFilterOptionCounts(mockProjects, {
        policy: 'P1',
        department: '総務部',
      });

      // 該当するのは事業Aのみ（政策P1 AND 総務部）
      expect(result.measures.get('M1')).toBe(1);
      expect(result.measures.get('M2')).toBeUndefined(); // 政策はP1だが部署が企画部のため0件
      expect(result.basicProjects.get('BP1')).toBe(1);
      expect(result.basicProjects.get('BP2')).toBeUndefined(); // 政策はP1だが部署が企画部のため0件
    });

    it('方向性フィルター適用時、他フィルターの件数が正しく絞り込まれること', () => {
      const result = getFilterOptionCounts(mockProjects, { direction: '改革方向A' });

      // 該当するのは事業Aのみ（改革方向A）
      expect(result.policies.get('P1')).toBe(1);
      expect(result.policies.get('P2')).toBeUndefined(); // 改革方向Aではないため0件

      expect(result.departments.get('総務部')).toBe(1);
      expect(result.departments.get('企画部')).toBeUndefined(); // 改革方向Aではないため0件

      expect(result.categories.get('一般事業')).toBe(1);
      expect(result.categories.get('重点事業')).toBeUndefined(); // 改革方向Aではないため0件
    });

    it('キーワード検索適用時、各フィルターの件数が正しく絞り込まれること', () => {
      const result = getFilterOptionCounts(mockProjects, { q: '事業A' });

      // 該当するのは事業Aのみ（名前に「事業A」を含む）
      expect(result.policies.get('P1')).toBe(1);
      expect(result.policies.get('P2')).toBeUndefined(); // 事業Aは政策P1なので0件

      expect(result.measures.get('M1')).toBe(1);
      expect(result.measures.get('M2')).toBeUndefined();
      expect(result.measures.get('M3')).toBeUndefined();

      expect(result.basicProjects.get('BP1')).toBe(1);
      expect(result.basicProjects.get('BP2')).toBeUndefined();
      expect(result.basicProjects.get('BP3')).toBeUndefined();

      expect(result.departments.get('総務部')).toBe(1);
      expect(result.departments.get('企画部')).toBeUndefined();

      expect(result.categories.get('一般事業')).toBe(1);
      expect(result.categories.get('重点事業')).toBeUndefined();
    });
  });
});
