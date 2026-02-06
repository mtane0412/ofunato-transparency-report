/**
 * Excelファイル→JSON変換スクリプト
 *
 * 大船渡市基本事業評価シートをExcelファイルから読み込み、
 * 型安全なJSONファイルに変換します。
 */

import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';
import type { Project, ProjectDataset, YearlyFinancial, YearlyIndicator } from '../types';

/**
 * Excelファイルのパス
 */
const EXCEL_FILE_PATH = path.join(process.cwd(), 'report.xlsx');

/**
 * 出力JSONファイルのパス
 */
const OUTPUT_JSON_PATH = path.join(process.cwd(), 'data', 'projects.json');

/**
 * 数値に変換する（空文字やnullは0に変換）
 */
function toNumber(value: unknown): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}

/**
 * 文字列に変換する（nullや空文字はそのまま空文字に）
 */
function toStringValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
}

/**
 * Excelファイルを読み込む
 */
function readExcelFile(filePath: string): XLSX.WorkSheet {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  return workbook.Sheets[sheetName];
}

/**
 * 行データをProjectオブジェクトに変換
 */
function parseProjectRow(row: unknown[]): Project {
  // 基本情報
  const year = toNumber(row[5]);
  const createdAt = `${toNumber(row[2])}/${toNumber(row[3])}/${toNumber(row[4])}`;

  // 政策階層
  const policyId = `${toNumber(row[9])}${toNumber(row[10])}`;
  const measureId = `${toNumber(row[12])}${toNumber(row[13])}`;
  const basicProjectId = `${toNumber(row[15])}${toNumber(row[16])}`;

  // 財政データ（6年分）を抽出
  // Excelファイルの列構成は固定（令和2年度〜令和7年度）
  const financials: YearlyFinancial[] = [];
  const baseYears = [2, 3, 4, 5, 6, 7];
  const financialBlocks = [
    { start: 70, year: baseYears[0] },
    { start: 89, year: baseYears[1] },
    { start: 108, year: baseYears[2] },
    { start: 127, year: baseYears[3] },
    { start: 146, year: baseYears[4] },
    { start: 165, year: baseYears[5] },
  ];

  for (const block of financialBlocks) {
    const offset = block.start;
    financials.push({
      year: block.year,
      nationalSubsidy: toNumber(row[offset]),
      prefecturalSubsidy: toNumber(row[offset + 1]),
      localBond: toNumber(row[offset + 2]),
      other: toNumber(row[offset + 3]),
      generalRevenue: toNumber(row[offset + 4]),
      totalCost: toNumber(row[offset + 5]),
      personnelCount: toNumber(row[offset + 6]),
      workHours: toNumber(row[offset + 7]),
      personnelCost: toNumber(row[offset + 8]),
      grandTotal: toNumber(row[offset + 9]),
    });
  }

  // 指標データ（6年分）を抽出
  const indicators: YearlyIndicator[] = [];
  const indicatorBlocks = [
    { start: 80, year: baseYears[0] },
    { start: 99, year: baseYears[1] },
    { start: 118, year: baseYears[2] },
    { start: 137, year: baseYears[3] },
    { start: 156, year: baseYears[4] },
    { start: 175, year: baseYears[5] },
  ];

  for (const block of indicatorBlocks) {
    const offset = block.start;
    indicators.push({
      year: block.year,
      activity: [
        toNumber(row[offset]) || null,
        toNumber(row[offset + 1]) || null,
        toNumber(row[offset + 2]) || null,
      ],
      target: [
        toNumber(row[offset + 3]) || null,
        toNumber(row[offset + 4]) || null,
        toNumber(row[offset + 5]) || null,
      ],
      outcome: [
        toNumber(row[offset + 6]) || null,
        toNumber(row[offset + 7]) || null,
        toNumber(row[offset + 8]) || null,
      ],
    });
  }

  const project: Project = {
    id: toStringValue(row[6]),
    name: toStringValue(row[7]),
    year,
    createdAt,
    policy: {
      id: policyId,
      name: toStringValue(row[11]),
    },
    measure: {
      id: measureId,
      name: toStringValue(row[14]),
    },
    basicProject: {
      id: basicProjectId,
      name: toStringValue(row[17]),
    },
    department: toStringValue(row[19]),
    manager: toStringValue(row[20]),
    section: toStringValue(row[21]),
    contact: toStringValue(row[22]),
    category: toStringValue(row[35]),
    period: {
      type: toStringValue(row[27]),
      start: toStringValue(row[28]),
      end: toStringValue(row[29]),
    },
    overview: toStringValue(row[36]),
    target: toStringValue(row[49]),
    intent: toStringValue(row[50]),
    result: toStringValue(row[51]),
    legalBasis: toStringValue(row[18]),
    financials,
    indicators,
    indicatorLabels: {
      activity: [
        { name: toStringValue(row[52]), unit: toStringValue(row[53]) }, // BB-BC列: 活動指標ア（名称・単位）
        { name: toStringValue(row[54]), unit: toStringValue(row[55]) }, // BD-BE列: 活動指標イ（名称・単位）
        { name: toStringValue(row[56]), unit: toStringValue(row[57]) }, // BF-BG列: 活動指標ウ（名称・単位）
      ],
      target: [
        { name: toStringValue(row[58]), unit: toStringValue(row[59]) }, // BH-BI列: 対象指標カ（名称・単位）
        { name: toStringValue(row[60]), unit: toStringValue(row[61]) }, // BJ-BK列: 対象指標キ（名称・単位）
        { name: toStringValue(row[62]), unit: toStringValue(row[63]) }, // BL-BM列: 対象指標ク（名称・単位）
      ],
      outcome: [
        { name: toStringValue(row[64]), unit: toStringValue(row[65]) }, // BN-BO列: 成果指標サ（名称・単位）
        { name: toStringValue(row[66]), unit: toStringValue(row[67]) }, // BP-BQ列: 成果指標シ（名称・単位）
        { name: toStringValue(row[68]), unit: toStringValue(row[69]) }, // BR-BS列: 成果指標ス（名称・単位）
      ],
    },
    evaluation: {
      direction: toStringValue(row[203]),
      futureDirection: toStringValue(row[207]),
      comments: [
        {
          role: '担当課',
          comment: toStringValue(row[206]),
        },
        {
          role: '課長',
          comment: toStringValue(row[208]),
        },
      ],
    },
  };

  return project;
}

/**
 * Excel→JSON変換を実行
 */
async function convertExcelToJson(): Promise<void> {
  console.log('Excel→JSON変換を開始します...');
  console.log(`入力ファイル: ${EXCEL_FILE_PATH}`);

  // Excelファイルの存在確認
  if (!fs.existsSync(EXCEL_FILE_PATH)) {
    throw new Error(`Excelファイルが見つかりません: ${EXCEL_FILE_PATH}`);
  }

  // Excelファイルを読み込む
  const worksheet = readExcelFile(EXCEL_FILE_PATH);
  const rawData: unknown[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  console.log(`読み込み完了: ${rawData.length}行`);

  // データセットを構築
  const dataset: ProjectDataset = {
    generatedAt: new Date().toISOString(),
    totalCount: 0,
    projects: [],
  };

  // ヘッダー行は2行目（インデックス1）、データは3行目（インデックス2）から開始
  const DATA_START_INDEX = 2;

  const projects: Project[] = [];

  // 各データ行を処理
  for (let i = DATA_START_INDEX; i < rawData.length; i++) {
    const row = rawData[i] as unknown[];

    // 空行をスキップ
    if (!row || row.length === 0) continue;

    // 事務事業IDが存在しない行はスキップ
    const projectId = toStringValue(row[6]);
    if (!projectId) continue;

    try {
      const project = parseProjectRow(row);
      projects.push(project);
    } catch (error) {
      console.warn(`行${i + 1}のパースに失敗しました:`, error);
    }
  }

  dataset.totalCount = projects.length;
  dataset.projects = projects;

  // 出力ディレクトリが存在しない場合は作成
  const outputDir = path.dirname(OUTPUT_JSON_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // JSONファイルに書き出す
  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(dataset, null, 2), 'utf-8');

  console.log(`変換完了: ${OUTPUT_JSON_PATH}`);
  console.log(`総事業数: ${dataset.totalCount}`);
}

// スクリプト実行
convertExcelToJson().catch((error) => {
  console.error('エラーが発生しました:', error);
  process.exit(1);
});
