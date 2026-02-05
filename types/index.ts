/**
 * 大船渡市基本事業評価シート データ型定義
 *
 * このファイルは、Excelファイルから変換されたJSONデータの型定義を提供します。
 */

/**
 * 金額表示モード
 * - 'thousand': 千円表記（例: "130,005千円"）
 * - 'japanese': 日本語表記（例: "1億3,000万5,000円"）
 */
export type AmountDisplayMode = 'thousand' | 'japanese';

/**
 * 年度別財政データ
 */
export interface YearlyFinancial {
  /** 年度 */
  year: number;
  /** 国庫支出金（千円） */
  nationalSubsidy: number;
  /** 都道府県支出金（千円） */
  prefecturalSubsidy: number;
  /** 地方債（千円） */
  localBond: number;
  /** その他（千円） */
  other: number;
  /** 一般財源（千円） */
  generalRevenue: number;
  /** 事業費計（千円） */
  totalCost: number;
  /** 正規職員従事人数（人） */
  personnelCount: number;
  /** 延べ業務時間（時間） */
  workHours: number;
  /** 人件費計（千円） */
  personnelCost: number;
  /** トータルコスト（千円） */
  grandTotal: number;
}

/**
 * 指標の名称と単位
 */
export interface IndicatorLabel {
  /** 名称 */
  name: string;
  /** 単位 */
  unit: string;
}

/**
 * 指標の名称定義
 */
export interface IndicatorLabels {
  /** 活動指標の名称と単位（ア/イ/ウ） */
  activity: [IndicatorLabel, IndicatorLabel, IndicatorLabel];
  /** 対象指標の名称と単位（カ/キ/ク） */
  target: [IndicatorLabel, IndicatorLabel, IndicatorLabel];
  /** 成果指標の名称と単位（サ/シ/ス） */
  outcome: [IndicatorLabel, IndicatorLabel, IndicatorLabel];
}

/**
 * 指標データ（単年）
 */
export interface YearlyIndicator {
  /** 年度 */
  year: number;
  /** 活動指標（ア/イ/ウ） */
  activity: (number | null)[];
  /** 対象指標（カ/キ/ク） */
  target: (number | null)[];
  /** 成果指標（サ/シ/ス） */
  outcome: (number | null)[];
}

/**
 * 評価コメント
 */
export interface EvaluationComment {
  /** 評価者の役職 */
  role: string;
  /** コメント内容 */
  comment: string;
}

/**
 * 事業評価データ
 */
export interface Evaluation {
  /** 改革改善の方向性 */
  direction: string;
  /** 今後の方向性 */
  futureDirection: string;
  /** 評価コメント一覧 */
  comments: EvaluationComment[];
}

/**
 * 政策階層情報
 */
export interface PolicyHierarchy {
  /** ID */
  id: string;
  /** 名称 */
  name: string;
}

/**
 * 事業期間情報
 */
export interface ProjectPeriod {
  /** 期間種別（継続/新規/終了） */
  type: string;
  /** 開始年度（該当する場合） */
  start?: string;
  /** 終了年度（該当する場合） */
  end?: string;
}

/**
 * 事務事業データ（メイン型定義）
 */
export interface Project {
  /** 事務事業ID */
  id: string;
  /** 事務事業名 */
  name: string;
  /** 評価年度 */
  year: number;
  /** 作成日 */
  createdAt: string;

  // 階層構造
  /** 政策情報 */
  policy: PolicyHierarchy;
  /** 施策情報 */
  measure: PolicyHierarchy;
  /** 基本事業情報 */
  basicProject: PolicyHierarchy;

  // 組織情報
  /** 部課名 */
  department: string;
  /** 課長名 */
  manager: string;
  /** 係名 */
  section: string;
  /** 担当者名 */
  contact: string;

  // 事業情報
  /** 事業区分（政策事業/施設整備/施設管理/補助金等/一般） */
  category: string;
  /** 事業期間 */
  period: ProjectPeriod;
  /** 事業概要 */
  overview: string;
  /** 対象（誰・何を対象としているか） */
  target: string;
  /** 意図（どのような状態にしたいか） */
  intent: string;
  /** 結果（どのような成果があったか） */
  result: string;
  /** 根拠法令 */
  legalBasis: string;

  // 財政データ（年度別）
  /** 財政データ一覧（6年分） */
  financials: YearlyFinancial[];

  // 指標データ（年度別）
  /** 指標データ一覧（6年分） */
  indicators: YearlyIndicator[];
  /** 指標の名称定義 */
  indicatorLabels: IndicatorLabels;

  // 評価
  /** 評価情報 */
  evaluation: Evaluation;
}

/**
 * データセット全体
 */
export interface ProjectDataset {
  /** データセット生成日時 */
  generatedAt: string;
  /** 総事業数 */
  totalCount: number;
  /** 事業データ一覧 */
  projects: Project[];
}

/**
 * データセット統計情報
 */
/** 政策別・事業区分別の集計データ */
export interface CategoryStats {
  /** カテゴリ名称 */
  name: string;
  /** 事業数 */
  count: number;
  /** 予算合計（最新年度のトータルコスト合計、千円単位） */
  budget: number;
}

export interface DatasetStats {
  /** 総事業数 */
  totalProjects: number;
  /** 総予算（最新年度のトータルコスト合計、千円単位） */
  totalBudget: number;
  /** データ生成日時 */
  generatedAt: string;
  /** 政策別事業数・予算 */
  projectsByPolicy: CategoryStats[];
  /** 事業区分別事業数・予算 */
  projectsByCategory: CategoryStats[];
  /** 政策数 */
  policyCount: number;
  /** 事業区分数 */
  categoryCount: number;
  /** 平均事業予算（千円単位） */
  averageBudget: number;
}
