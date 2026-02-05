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

    it('各政策IDに対して最も使用頻度の高い名前を使用していること', () => {
      const stats = getDatasetStats();
      const allProjects = getAllProjects();

      // 各政策について、最も使用頻度の高い名前が採用されているか確認
      stats.projectsByPolicy.forEach((policyStat) => {
        // この政策IDに属するすべてのプロジェクトを取得
        const policyId = getAllPolicies().find((p) => p.name === policyStat.name)?.id;
        if (!policyId) return;

        const projectsInPolicy = allProjects.filter((p) => p.policy.id === policyId);

        // 名前の出現回数をカウント
        const nameCountMap = new Map<string, number>();
        projectsInPolicy.forEach((project) => {
          const count = nameCountMap.get(project.policy.name) || 0;
          nameCountMap.set(project.policy.name, count + 1);
        });

        // 最も使用頻度の高い名前を取得
        let maxCount = 0;
        let mostFrequentName = '';
        nameCountMap.forEach((count, name) => {
          if (count > maxCount) {
            maxCount = count;
            mostFrequentName = name;
          }
        });

        // 統計情報の名前が最も使用頻度の高い名前と一致することを確認
        expect(policyStat.name).toBe(mostFrequentName);
      });
    });

    it('政策数が正しく計算されること', () => {
      const stats = getDatasetStats();
      const policies = getAllPolicies();

      expect(stats.policyCount).toBe(policies.length);
      expect(stats.policyCount).toBeGreaterThan(0);
    });

    it('事業区分数が正しく計算されること', () => {
      const stats = getDatasetStats();
      const categories = getAllCategories();

      expect(stats.categoryCount).toBe(categories.length);
      expect(stats.categoryCount).toBeGreaterThan(0);
    });

    it('平均事業予算が正しく計算されること', () => {
      const stats = getDatasetStats();

      const expectedAverage = Math.round(stats.totalBudget / stats.totalProjects);
      expect(stats.averageBudget).toBe(expectedAverage);
      expect(stats.averageBudget).toBeGreaterThan(0);
    });

    it('評価統計情報が存在すること', () => {
      const stats = getDatasetStats();

      // evaluationStatsフィールドの存在確認
      expect(stats).toHaveProperty('evaluationStats');
      expect(stats.evaluationStats).toBeDefined();
      expect(stats.evaluationStats).toHaveProperty('directionCounts');
      expect(stats.evaluationStats).toHaveProperty('futureDirectionCounts');
    });

    it('改革改善の方向性の件数合計が総事業数と一致すること', () => {
      const stats = getDatasetStats();

      // directionCountsの合計件数を計算
      const totalDirectionCount = stats.evaluationStats.directionCounts.reduce(
        (sum, item) => sum + item.count,
        0
      );

      // 総事業数と一致することを確認
      expect(totalDirectionCount).toBe(stats.totalProjects);
    });

    it('今後の方向性の件数合計が総事業数と一致すること', () => {
      const stats = getDatasetStats();

      // futureDirectionCountsの合計件数を計算
      const totalFutureDirectionCount = stats.evaluationStats.futureDirectionCounts.reduce(
        (sum, item) => sum + item.count,
        0
      );

      // 総事業数と一致することを確認
      expect(totalFutureDirectionCount).toBe(stats.totalProjects);
    });

    it('不正データが「その他・未設定」として集約されること', () => {
      const stats = getDatasetStats();

      // 不正データ（数字のみ）が「その他・未設定」に集約されているか確認
      const directionOther = stats.evaluationStats.directionCounts.find(
        (item) => item.name === 'その他・未設定'
      );
      const futureDirectionOther = stats.evaluationStats.futureDirectionCounts.find(
        (item) => item.name === 'その他・未設定'
      );

      // 不正データが存在する場合、「その他・未設定」カテゴリが存在すること
      const allProjects = getAllProjects();
      const hasInvalidDirection = allProjects.some((p) => /^[0-9]+$/.test(p.evaluation.direction));
      const hasInvalidFutureDirection = allProjects.some((p) => /^[0-9]+$/.test(p.evaluation.futureDirection));

      if (hasInvalidDirection) {
        expect(directionOther).toBeDefined();
        expect(directionOther!.count).toBeGreaterThan(0);
      }

      if (hasInvalidFutureDirection) {
        expect(futureDirectionOther).toBeDefined();
        expect(futureDirectionOther!.count).toBeGreaterThan(0);
      }
    });

    it('政策別統計に方向性内訳（directionBreakdown / futureDirectionBreakdown）が含まれること', () => {
      const stats = getDatasetStats();

      // すべての政策統計に方向性内訳が含まれること
      stats.projectsByPolicy.forEach((policy) => {
        expect(policy).toHaveProperty('directionBreakdown');
        expect(policy).toHaveProperty('futureDirectionBreakdown');
        expect(typeof policy.directionBreakdown).toBe('object');
        expect(typeof policy.futureDirectionBreakdown).toBe('object');
      });
    });

    it('政策別統計の方向性内訳の件数合計が事業数と一致すること', () => {
      const stats = getDatasetStats();

      stats.projectsByPolicy.forEach((policy) => {
        // directionBreakdownの合計件数
        const directionTotal = Object.values(policy.directionBreakdown).reduce(
          (sum, count) => sum + count,
          0
        );
        expect(directionTotal).toBe(policy.count);

        // futureDirectionBreakdownの合計件数
        const futureDirectionTotal = Object.values(policy.futureDirectionBreakdown).reduce(
          (sum, count) => sum + count,
          0
        );
        expect(futureDirectionTotal).toBe(policy.count);
      });
    });

    it('事業区分別統計に方向性内訳（directionBreakdown / futureDirectionBreakdown）が含まれること', () => {
      const stats = getDatasetStats();

      // すべての事業区分統計に方向性内訳が含まれること
      stats.projectsByCategory.forEach((category) => {
        expect(category).toHaveProperty('directionBreakdown');
        expect(category).toHaveProperty('futureDirectionBreakdown');
        expect(typeof category.directionBreakdown).toBe('object');
        expect(typeof category.futureDirectionBreakdown).toBe('object');
      });
    });

    it('事業区分別統計の方向性内訳の件数合計が事業数と一致すること', () => {
      const stats = getDatasetStats();

      stats.projectsByCategory.forEach((category) => {
        // directionBreakdownの合計件数
        const directionTotal = Object.values(category.directionBreakdown).reduce(
          (sum, count) => sum + count,
          0
        );
        expect(directionTotal).toBe(category.count);

        // futureDirectionBreakdownの合計件数
        const futureDirectionTotal = Object.values(category.futureDirectionBreakdown).reduce(
          (sum, count) => sum + count,
          0
        );
        expect(futureDirectionTotal).toBe(category.count);
      });
    });
  });
});
