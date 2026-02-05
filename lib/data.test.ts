/**
 * データアクセス関数のテスト
 *
 * JSONデータ読み込みと一覧取得関数が正しく動作することを確認します。
 */
import { describe, it, expect } from 'vitest';
import {
  getAllProjects,
  getProjectById,
  getAllPolicies,
  getAllMeasures,
  getAllBasicProjects,
  getAllDepartments,
  getAllCategories,
  getDatasetStats,
} from './data';

describe('data.ts', () => {
  describe('getAllProjects', () => {
    it('全事業データを取得できること', () => {
      const projects = getAllProjects();
      expect(projects).toBeDefined();
      expect(projects.length).toBeGreaterThan(0);
    });
  });

  describe('getProjectById', () => {
    it('指定したIDの事業データを取得できること', () => {
      const projects = getAllProjects();
      const firstProject = projects[0];
      const project = getProjectById(firstProject.id);

      expect(project).toBeDefined();
      expect(project?.id).toBe(firstProject.id);
    });

    it('存在しないIDの場合はundefinedを返すこと', () => {
      const project = getProjectById('NONEXISTENT_ID');
      expect(project).toBeUndefined();
    });
  });

  describe('getAllPolicies', () => {
    it('重複を除いた政策一覧を取得できること', () => {
      const policies = getAllPolicies();
      expect(policies).toBeDefined();
      expect(policies.length).toBeGreaterThan(0);

      // 各要素がidとnameを持つこと
      policies.forEach((policy) => {
        expect(policy).toHaveProperty('id');
        expect(policy).toHaveProperty('name');
        expect(typeof policy.id).toBe('string');
        expect(typeof policy.name).toBe('string');
      });

      // IDで昇順ソートされていること
      for (let i = 0; i < policies.length - 1; i++) {
        expect(policies[i].id.localeCompare(policies[i + 1].id)).toBeLessThanOrEqual(0);
      }

      // 重複がないこと
      const ids = policies.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('getAllMeasures', () => {
    it('重複を除いた施策一覧を取得できること', () => {
      const measures = getAllMeasures();
      expect(measures).toBeDefined();
      expect(measures.length).toBeGreaterThan(0);

      // 各要素がidとnameを持つこと
      measures.forEach((measure) => {
        expect(measure).toHaveProperty('id');
        expect(measure).toHaveProperty('name');
        expect(typeof measure.id).toBe('string');
        expect(typeof measure.name).toBe('string');
      });

      // IDで昇順ソートされていること
      for (let i = 0; i < measures.length - 1; i++) {
        expect(measures[i].id.localeCompare(measures[i + 1].id)).toBeLessThanOrEqual(0);
      }

      // 重複がないこと
      const ids = measures.map((m) => m.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('getAllBasicProjects', () => {
    it('重複を除いた基本事業一覧を取得できること', () => {
      const basicProjects = getAllBasicProjects();
      expect(basicProjects).toBeDefined();
      expect(basicProjects.length).toBeGreaterThan(0);

      // 各要素がidとnameを持つこと
      basicProjects.forEach((basicProject) => {
        expect(basicProject).toHaveProperty('id');
        expect(basicProject).toHaveProperty('name');
        expect(typeof basicProject.id).toBe('string');
        expect(typeof basicProject.name).toBe('string');
      });

      // IDで昇順ソートされていること
      for (let i = 0; i < basicProjects.length - 1; i++) {
        expect(basicProjects[i].id.localeCompare(basicProjects[i + 1].id)).toBeLessThanOrEqual(0);
      }

      // 重複がないこと
      const ids = basicProjects.map((bp) => bp.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('getAllDepartments', () => {
    it('重複を除いた部署一覧を取得できること', () => {
      const departments = getAllDepartments();
      expect(departments).toBeDefined();
      expect(departments.length).toBeGreaterThan(0);

      // 各要素が文字列であること
      departments.forEach((dept) => {
        expect(typeof dept).toBe('string');
      });

      // アルファベット順ソートされていること
      for (let i = 0; i < departments.length - 1; i++) {
        expect(departments[i].localeCompare(departments[i + 1])).toBeLessThanOrEqual(0);
      }

      // 重複がないこと
      const uniqueDepartments = new Set(departments);
      expect(departments.length).toBe(uniqueDepartments.size);
    });
  });

  describe('getAllCategories', () => {
    it('重複を除いた事業区分一覧を取得できること', () => {
      const categories = getAllCategories();
      expect(categories).toBeDefined();
      expect(categories.length).toBeGreaterThan(0);

      // 各要素が文字列であること
      categories.forEach((category) => {
        expect(typeof category).toBe('string');
      });

      // アルファベット順ソートされていること
      for (let i = 0; i < categories.length - 1; i++) {
        expect(categories[i].localeCompare(categories[i + 1])).toBeLessThanOrEqual(0);
      }

      // 重複がないこと
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe('getDatasetStats', () => {
    it('データセット統計情報を取得できること', () => {
      const stats = getDatasetStats();

      // 基本フィールドの存在確認
      expect(stats).toBeDefined();
      expect(stats.totalProjects).toBeGreaterThan(0);
      expect(stats.totalBudget).toBeGreaterThan(0);
      expect(stats.generatedAt).toBeDefined();
      expect(typeof stats.generatedAt).toBe('string');

      // 政策別統計の検証
      expect(stats.projectsByPolicy).toBeDefined();
      expect(stats.projectsByPolicy.length).toBeGreaterThan(0);
      stats.projectsByPolicy.forEach((policy) => {
        expect(policy).toHaveProperty('name');
        expect(policy).toHaveProperty('count');
        expect(policy).toHaveProperty('budget');
        expect(typeof policy.name).toBe('string');
        expect(typeof policy.count).toBe('number');
        expect(typeof policy.budget).toBe('number');
        expect(policy.count).toBeGreaterThan(0);
        expect(policy.budget).toBeGreaterThanOrEqual(0);
      });

      // 事業区分別統計の検証
      expect(stats.projectsByCategory).toBeDefined();
      expect(stats.projectsByCategory.length).toBeGreaterThan(0);
      stats.projectsByCategory.forEach((category) => {
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('count');
        expect(category).toHaveProperty('budget');
        expect(typeof category.name).toBe('string');
        expect(typeof category.count).toBe('number');
        expect(typeof category.budget).toBe('number');
        expect(category.count).toBeGreaterThan(0);
        expect(category.budget).toBeGreaterThanOrEqual(0);
      });
    });

    it('政策別の予算合計が正しく計算されること', () => {
      const stats = getDatasetStats();
      const allProjects = getAllProjects();

      // 最初の政策について予算合計を手動計算
      const firstPolicy = stats.projectsByPolicy[0];
      const policies = getAllPolicies();
      const policyId = policies.find((p) => p.name === firstPolicy.name)?.id;

      if (policyId) {
        const projectsInPolicy = allProjects.filter((p) => p.policy.id === policyId);
        const expectedBudget = projectsInPolicy.reduce((sum, project) => {
          const latestFinancial = project.financials.find((f) => f.year === project.year);
          return sum + (latestFinancial?.grandTotal || 0);
        }, 0);

        expect(firstPolicy.budget).toBe(expectedBudget);
      }
    });

    it('政策別統計がID順にソートされていること', () => {
      const stats = getDatasetStats();
      const policies = getAllPolicies();

      // 政策名からIDを逆引きしてソート順を確認
      for (let i = 0; i < stats.projectsByPolicy.length - 1; i++) {
        const currentPolicyId = policies.find((p) => p.name === stats.projectsByPolicy[i].name)?.id || '';
        const nextPolicyId = policies.find((p) => p.name === stats.projectsByPolicy[i + 1].name)?.id || '';
        expect(currentPolicyId.localeCompare(nextPolicyId)).toBeLessThanOrEqual(0);
      }
    });
  });
});
