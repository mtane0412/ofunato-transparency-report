/**
 * 類似事業データの事前計算スクリプト
 *
 * data/projects.json を読み込み、全事業ペアの類似度を計算し、
 * data/similarities.json に出力します。
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { ProjectDataset } from '../types';
import type { SimilarityData } from '../types/similarity';
import { findSimilarProjects } from '../lib/similarity';

// ES Modules環境で__dirnameを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * メイン処理
 */
function main(): void {
  console.log('類似事業データの計算を開始します...');

  // プロジェクトデータを読み込む
  const projectsPath = path.join(__dirname, '../data/projects.json');
  const projectsData: ProjectDataset = JSON.parse(
    fs.readFileSync(projectsPath, 'utf-8')
  );

  const projects = projectsData.projects;
  console.log(`対象事業数: ${projects.length}件`);

  // 類似度データを計算
  const similarities: SimilarityData['similarities'] = {};

  projects.forEach((project, index) => {
    // 進捗表示（10件ごと）
    if ((index + 1) % 10 === 0 || index === 0) {
      console.log(`処理中: ${index + 1}/${projects.length}件`);
    }

    // Top 5の類似事業を取得
    const similar = findSimilarProjects(project, projects, 5);
    similarities[project.id] = similar;
  });

  // 結果を出力
  const output: SimilarityData = {
    generatedAt: new Date().toISOString(),
    similarities,
  };

  const outputPath = path.join(__dirname, '../data/similarities.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`類似度データを ${outputPath} に出力しました。`);
  console.log('処理が完了しました。');
}

// スクリプト実行
main();
