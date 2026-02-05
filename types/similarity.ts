/**
 * 類似事業表示機能の型定義
 *
 * 各事業間の類似度を計算し、関連する事業を推薦するための型を定義します。
 */

/**
 * 類似度スコアの重み設定
 */
export type SimilarityWeights = {
  /** 政策階層の一致度の重み（デフォルト: 0.35） */
  hierarchy: number;
  /** テキスト類似度の重み（デフォルト: 0.30） */
  text: number;
  /** 財政規模の近似度の重み（デフォルト: 0.20） */
  financial: number;
  /** 組織・属性の一致度の重み（デフォルト: 0.15） */
  attribute: number;
};

/**
 * 類似事業の基本情報
 */
export type SimilarProject = {
  /** 事業ID */
  id: string;
  /** 類似度スコア（0.0〜1.0） */
  score: number;
};

/**
 * 類似度計算結果（事前計算されたデータ）
 */
export type SimilarityData = {
  /** 生成日時（ISO 8601形式） */
  generatedAt: string;
  /** 各事業IDをキーとした類似事業リスト */
  similarities: {
    [projectId: string]: SimilarProject[];
  };
};

/**
 * 表示用の類似事業情報
 */
export type SimilarProjectDisplay = {
  /** 事業ID */
  id: string;
  /** 事業名 */
  name: string;
  /** 類似度スコア（0.0〜1.0） */
  score: number;
  /** 政策名 */
  policyName: string;
  /** 施策名 */
  measureName: string;
  /** 部署名 */
  department: string;
  /** トータルコスト（最新年度） */
  totalCost: number;
};
