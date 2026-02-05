/**
 * 類似事業推薦機能
 *
 * 各事業間の類似度を計算し、関連する事業を推薦します。
 * 類似度は以下の4軸で計算されます：
 * 1. 政策階層の一致度（重み: 0.35）
 * 2. テキスト類似度（重み: 0.30）
 * 3. 財政規模の近似度（重み: 0.20）
 * 4. 組織・属性の一致度（重み: 0.15）
 */

import TinySegmenter from 'tiny-segmenter';
import type { Project } from '@/types';
import type {
  SimilarityWeights,
  SimilarProject,
  SimilarityData,
  SimilarProjectDisplay,
} from '@/types/similarity';

/**
 * 類似度スコアの重み設定（デフォルト値）
 */
const DEFAULT_WEIGHTS: SimilarityWeights = {
  hierarchy: 0.35, // 政策階層の一致度
  text: 0.3, // テキスト類似度
  financial: 0.2, // 財政規模の近似度
  attribute: 0.15, // 組織・属性の一致度
};

/**
 * 政策階層の一致度を計算する
 *
 * @param projectA - 比較する事業A
 * @param projectB - 比較する事業B
 * @returns 類似度スコア（0.0〜1.0）
 */
export function calculateHierarchySimilarity(
  projectA: Project,
  projectB: Project
): number {
  // 基本事業IDが一致する場合
  if (projectA.basicProject.id === projectB.basicProject.id) {
    return 1.0;
  }

  // 施策IDが一致する場合
  if (projectA.measure.id === projectB.measure.id) {
    return 0.7;
  }

  // 政策IDが一致する場合
  if (projectA.policy.id === projectB.policy.id) {
    return 0.3;
  }

  // すべて不一致の場合
  return 0.0;
}

/**
 * TF-IDFベクトルを計算する
 *
 * @param text - 対象テキスト
 * @param idfCache - IDF値のキャッシュ（単語 → IDF値）
 * @returns TF-IDFベクトル（単語 → スコアのマップ）
 */
function calculateTfIdf(
  text: string,
  idfCache: Map<string, number>
): Map<string, number> {
  const segmenter = new TinySegmenter();
  const tokens = segmenter.segment(text).filter((t: string) => t.trim() !== '');

  // TF（単語の出現頻度）を計算
  const tf = new Map<string, number>();
  tokens.forEach((token: string) => {
    tf.set(token, (tf.get(token) || 0) + 1);
  });

  // 正規化（TFを単語数で割る）
  const totalTokens = tokens.length;
  tf.forEach((count, token) => {
    tf.set(token, count / totalTokens);
  });

  // TF-IDFを計算
  const tfidf = new Map<string, number>();
  tf.forEach((tfValue, token) => {
    const idfValue = idfCache.get(token) || 0;
    tfidf.set(token, tfValue * idfValue);
  });

  return tfidf;
}

/**
 * 全事業のIDF値を事前計算する
 *
 * @param allTexts - 全事業のテキスト配列
 * @returns IDF値のキャッシュ（単語 → IDF値）
 */
export function buildIdfCache(allTexts: string[]): Map<string, number> {
  const segmenter = new TinySegmenter();
  const totalDocs = allTexts.length;

  // 全単語を抽出
  const allTokens = new Set<string>();
  const documentTokens: Set<string>[] = [];

  allTexts.forEach((text) => {
    const tokens = new Set(
      segmenter.segment(text).filter((t: string) => t.trim() !== '')
    );
    documentTokens.push(tokens);
    tokens.forEach((token) => allTokens.add(token));
  });

  // IDF値を計算
  const idfCache = new Map<string, number>();
  allTokens.forEach((token) => {
    // このトークンを含む文書数をカウント
    const docsWithToken = documentTokens.filter((tokens) =>
      tokens.has(token)
    ).length;

    // IDF = log(総文書数 / トークンを含む文書数)
    idfCache.set(token, Math.log(totalDocs / (docsWithToken + 1)));
  });

  return idfCache;
}

/**
 * コサイン類似度を計算する
 *
 * @param vectorA - ベクトルA
 * @param vectorB - ベクトルB
 * @returns コサイン類似度（0.0〜1.0）
 */
function calculateCosineSimilarity(
  vectorA: Map<string, number>,
  vectorB: Map<string, number>
): number {
  // 内積を計算
  let dotProduct = 0;
  vectorA.forEach((valueA, key) => {
    const valueB = vectorB.get(key) || 0;
    dotProduct += valueA * valueB;
  });

  // ベクトルAのノルムを計算
  let normA = 0;
  vectorA.forEach((value) => {
    normA += value * value;
  });
  normA = Math.sqrt(normA);

  // ベクトルBのノルムを計算
  let normB = 0;
  vectorB.forEach((value) => {
    normB += value * value;
  });
  normB = Math.sqrt(normB);

  // コサイン類似度を計算
  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * テキスト類似度を計算する（TF-IDF + コサイン類似度）
 *
 * 事業概要、対象、意図を結合したテキストで類似度を計算します。
 *
 * @param projectA - 比較する事業A
 * @param projectB - 比較する事業B
 * @param idfCache - IDF値のキャッシュ（省略時は小規模なキャッシュを生成）
 * @returns 類似度スコア（0.0〜1.0）
 */
export function calculateTextSimilarity(
  projectA: Project,
  projectB: Project,
  idfCache?: Map<string, number>
): number {
  // テキストを結合
  const textA = `${projectA.overview} ${projectA.target} ${projectA.intent}`;
  const textB = `${projectB.overview} ${projectB.target} ${projectB.intent}`;

  // IDFキャッシュがない場合は、この2つの事業だけでIDF計算
  let actualIdfCache = idfCache;
  if (!actualIdfCache) {
    const allTexts = [textA, textB];
    actualIdfCache = buildIdfCache(allTexts);
  }

  // TF-IDFベクトルを計算
  const vectorA = calculateTfIdf(textA, actualIdfCache);
  const vectorB = calculateTfIdf(textB, actualIdfCache);

  // コサイン類似度を計算
  return calculateCosineSimilarity(vectorA, vectorB);
}

/**
 * 財政規模の近似度を計算する（対数スケール）
 *
 * 予算規模が近い事業ほど高いスコアを返します。
 * 対数スケールを使用することで、予算の幅広い範囲に対応します。
 *
 * @param projectA - 比較する事業A
 * @param projectB - 比較する事業B
 * @returns 類似度スコア（0.0〜1.0）
 */
export function calculateFinancialSimilarity(
  projectA: Project,
  projectB: Project
): number {
  // 最新年度の財政データを取得
  const finA = projectA.financials[0];
  const finB = projectB.financials[0];

  // 財政データがない場合
  if (!finA || !finB) {
    return 0.0;
  }

  const budgetA = finA.grandTotal;
  const budgetB = finB.grandTotal;

  // 同じ予算の場合
  if (budgetA === budgetB) {
    return 1.0;
  }

  // 対数スケールで差を計算
  const logDiff = Math.abs(Math.log(budgetA + 1) - Math.log(budgetB + 1));

  // 最大対数差を仮定（1円〜100億円 → log(10000000000) ≒ 23）
  const maxLogDiff = 23;

  // 類似度を計算（0〜1にクランプ）
  const similarity = 1 - logDiff / maxLogDiff;
  return Math.max(0, Math.min(1, similarity));
}

/**
 * 組織・属性の一致度を計算する
 *
 * 部署名、事業区分、今後の方向性の一致度を計算します。
 *
 * @param projectA - 比較する事業A
 * @param projectB - 比較する事業B
 * @returns 類似度スコア（0.0〜1.0）
 */
export function calculateAttributeSimilarity(
  projectA: Project,
  projectB: Project
): number {
  let score = 0;

  // 部署名の一致（配分: 0.4）
  if (projectA.department === projectB.department) {
    score += 0.4;
  }

  // 事業区分の一致（配分: 0.3）
  if (projectA.category === projectB.category) {
    score += 0.3;
  }

  // 今後の方向性の一致（配分: 0.3）
  if (
    projectA.evaluation.futureDirection ===
    projectB.evaluation.futureDirection
  ) {
    score += 0.3;
  }

  return score;
}

/**
 * 総合的な類似度スコアを計算する（4軸の加重平均）
 *
 * @param projectA - 比較する事業A
 * @param projectB - 比較する事業B
 * @param idfCache - IDF値のキャッシュ（省略時は小規模なキャッシュを生成）
 * @param weights - 各軸の重み設定（省略時はデフォルト値）
 * @returns 類似度スコア（0.0〜1.0）
 */
export function calculateSimilarityScore(
  projectA: Project,
  projectB: Project,
  idfCache?: Map<string, number>,
  weights: SimilarityWeights = DEFAULT_WEIGHTS
): number {
  const hierarchyScore = calculateHierarchySimilarity(projectA, projectB);
  const textScore = calculateTextSimilarity(projectA, projectB, idfCache);
  const financialScore = calculateFinancialSimilarity(projectA, projectB);
  const attributeScore = calculateAttributeSimilarity(projectA, projectB);

  return (
    weights.hierarchy * hierarchyScore +
    weights.text * textScore +
    weights.financial * financialScore +
    weights.attribute * attributeScore
  );
}

/**
 * 類似事業を検索する（Top N）
 *
 * @param targetProject - 対象事業
 * @param allProjects - 全事業データ
 * @param topN - 取得件数（デフォルト: 5）
 * @param weights - 各軸の重み設定（省略時はデフォルト値）
 * @returns 類似事業のリスト（スコア降順）
 */
export function findSimilarProjects(
  targetProject: Project,
  allProjects: Project[],
  topN = 5,
  weights: SimilarityWeights = DEFAULT_WEIGHTS
): SimilarProject[] {
  // 自分自身を除外
  const otherProjects = allProjects.filter((p) => p.id !== targetProject.id);

  // 全事業のIDFキャッシュを事前計算
  const allTexts = allProjects.map(
    (p) => `${p.overview} ${p.target} ${p.intent}`
  );
  const idfCache = buildIdfCache(allTexts);

  // 各事業の類似度を計算
  const similarities: SimilarProject[] = otherProjects.map((project) => ({
    id: project.id,
    score: calculateSimilarityScore(targetProject, project, idfCache, weights),
  }));

  // スコア降順でソート
  similarities.sort((a, b) => b.score - a.score);

  // Top Nを取得
  return similarities.slice(0, topN);
}

/**
 * 事前計算された類似度データを読み込む
 *
 * @returns 類似度データ
 */
export function loadSimilarityData(): SimilarityData {
  const data = require('@/data/similarities.json');
  return data as SimilarityData;
}

/**
 * 事業の類似事業を取得する（表示用データ）
 *
 * @param projectId - 事業ID
 * @param topN - 取得件数（デフォルト: 5）
 * @returns 類似事業の表示用データ
 */
export function getSimilarProjects(
  projectId: string,
  topN = 5
): SimilarProjectDisplay[] {
  const similarityData = loadSimilarityData();
  const projectData = require('@/data/projects.json');

  // 類似事業IDリストを取得
  const similarIds = similarityData.similarities[projectId] || [];

  // 事業詳細を結合
  const result: SimilarProjectDisplay[] = similarIds
    .slice(0, topN)
    .map((similar) => {
      const project = projectData.projects.find(
        (p: Project) => p.id === similar.id
      );

      if (!project) {
        throw new Error(`Project not found: ${similar.id}`);
      }

      const latestFinancial = project.financials[0];

      return {
        id: project.id,
        name: project.name,
        score: similar.score,
        policyName: project.policy.name,
        measureName: project.measure.name,
        department: project.department,
        totalCost: latestFinancial?.grandTotal || 0,
      };
    });

  return result;
}
