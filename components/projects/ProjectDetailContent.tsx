/**
 * 事業詳細コンテンツコンポーネント
 *
 * 事業詳細ページのコンテンツ部分をClient Componentとして分離します。
 */

'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { FormattedAmount } from '@/components/ui/FormattedAmount';
import { YearlyFinancialChart } from '@/components/charts/YearlyFinancialChart';
import { RevenueSourceChart } from '@/components/charts/RevenueSourceChart';
import { CostBreakdownChart } from '@/components/charts/CostBreakdownChart';
import { IndicatorChart } from '@/components/charts/IndicatorChart';
import { hasValidIndicatorData } from '@/lib/chart-data';
import type { Project } from '@/types';

interface ProjectDetailContentProps {
  project: Project;
}

/**
 * 指標ラベルをフォーマットする
 * - 名称と単位の両方がある場合: "名称（単位）"
 * - 名称のみの場合: "名称"
 * - 単位のみの場合: "デフォルトラベル（単位）"
 * - 両方とも空: "デフォルトラベル"
 */
function formatIndicatorLabel(
  label: { name: string; unit: string },
  defaultLabel: string
): string {
  const { name, unit } = label;

  if (name && unit) {
    return `${name}（${unit}）`;
  }
  if (name) {
    return name;
  }
  if (unit) {
    return `${defaultLabel}（${unit}）`;
  }
  return defaultLabel;
}

/**
 * ProjectDetailContent コンポーネント
 */
export function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  // 最新年度の財政データを取得
  const latestFinancial = project.financials.find(
    (f) => f.year === project.year
  );

  return (
    <div className="space-y-6">
      {/* パンくずナビゲーション */}
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600">
          トップ
        </Link>
        {' / '}
        <Link href="/projects" className="hover:text-blue-600">
          事業一覧
        </Link>
        {' / '}
        <span className="text-gray-900">{project.name}</span>
      </nav>

      {/* ページタイトル */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-medium text-gray-500">
            ID: {project.id}
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
            {project.category}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
      </div>

      {/* 基本情報カード */}
      <Card title="基本情報">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">政策</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {project.policy.name}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">施策</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {project.measure.name}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">基本事業</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {project.basicProject.name}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">担当部署</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {project.department}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">課長名</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.manager}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">係名</dt>
            <dd className="mt-1 text-sm text-gray-900">{project.section}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">根拠法令</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {project.legalBasis || 'なし'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">事業期間</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {project.period.type}
              {project.period.start &&
                project.period.start !== '-' &&
                ` (${project.period.start}〜${project.period.end || ''})`}
            </dd>
          </div>
        </dl>
      </Card>

      {/* 事業概要カード */}
      <Card title="事業概要">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">概要</h3>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {project.overview}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              対象（誰・何を対象にしているか）
            </h3>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {project.target}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              意図（対象をどう変えるのか）
            </h3>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {project.intent}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              結果（基本事業への貢献）
            </h3>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {project.result}
            </p>
          </div>
        </div>
      </Card>

      {/* 財政データカード */}
      <Card title="財政データ（最新年度）">
        {latestFinancial ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  国庫支出金
                </dt>
                <dd className="mt-1 text-lg font-bold text-gray-900">
                  <FormattedAmount amount={latestFinancial.nationalSubsidy} />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  都道府県支出金
                </dt>
                <dd className="mt-1 text-lg font-bold text-gray-900">
                  <FormattedAmount
                    amount={latestFinancial.prefecturalSubsidy}
                  />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">地方債</dt>
                <dd className="mt-1 text-lg font-bold text-gray-900">
                  <FormattedAmount amount={latestFinancial.localBond} />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">その他</dt>
                <dd className="mt-1 text-lg font-bold text-gray-900">
                  <FormattedAmount amount={latestFinancial.other} />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">一般財源</dt>
                <dd className="mt-1 text-lg font-bold text-gray-900">
                  <FormattedAmount amount={latestFinancial.generalRevenue} />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  事業費計
                </dt>
                <dd className="mt-1 text-lg font-bold text-gray-900">
                  <FormattedAmount amount={latestFinancial.totalCost} />
                </dd>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    正規職員従事人数
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-gray-900">
                    {latestFinancial.personnelCount}人
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    延べ業務時間
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-gray-900">
                    {latestFinancial.workHours}時間
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    人件費計
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-gray-900">
                    <FormattedAmount amount={latestFinancial.personnelCost} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    トータルコスト
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-blue-600">
                    <FormattedAmount amount={latestFinancial.grandTotal} />
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">財政データがありません</p>
        )}
      </Card>

      {/* グラフセクション */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">財政データの推移</h2>

        {/* トータルコスト推移グラフ */}
        <YearlyFinancialChart financials={project.financials} />

        {/* 財源構成グラフ */}
        <RevenueSourceChart financials={project.financials} />

        {/* コスト内訳グラフ */}
        <CostBreakdownChart financials={project.financials} />

        {/* 指標推移グラフ */}
        {project.indicators.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mt-8">指標の推移</h2>

            {/* 活動指標 */}
            {hasValidIndicatorData(project.indicators, 'activity', 0) && (
              <IndicatorChart
                indicators={project.indicators}
                category="activity"
                index={0}
                label={formatIndicatorLabel(
                  project.indicatorLabels.activity[0],
                  '活動指標ア'
                )}
              />
            )}
            {hasValidIndicatorData(project.indicators, 'activity', 1) && (
              <IndicatorChart
                indicators={project.indicators}
                category="activity"
                index={1}
                label={formatIndicatorLabel(
                  project.indicatorLabels.activity[1],
                  '活動指標イ'
                )}
              />
            )}
            {hasValidIndicatorData(project.indicators, 'activity', 2) && (
              <IndicatorChart
                indicators={project.indicators}
                category="activity"
                index={2}
                label={formatIndicatorLabel(
                  project.indicatorLabels.activity[2],
                  '活動指標ウ'
                )}
              />
            )}

            {/* 対象指標 */}
            {hasValidIndicatorData(project.indicators, 'target', 0) && (
              <IndicatorChart
                indicators={project.indicators}
                category="target"
                index={0}
                label={formatIndicatorLabel(
                  project.indicatorLabels.target[0],
                  '対象指標カ'
                )}
              />
            )}
            {hasValidIndicatorData(project.indicators, 'target', 1) && (
              <IndicatorChart
                indicators={project.indicators}
                category="target"
                index={1}
                label={formatIndicatorLabel(
                  project.indicatorLabels.target[1],
                  '対象指標キ'
                )}
              />
            )}
            {hasValidIndicatorData(project.indicators, 'target', 2) && (
              <IndicatorChart
                indicators={project.indicators}
                category="target"
                index={2}
                label={formatIndicatorLabel(
                  project.indicatorLabels.target[2],
                  '対象指標ク'
                )}
              />
            )}

            {/* 成果指標 */}
            {hasValidIndicatorData(project.indicators, 'outcome', 0) && (
              <IndicatorChart
                indicators={project.indicators}
                category="outcome"
                index={0}
                label={formatIndicatorLabel(
                  project.indicatorLabels.outcome[0],
                  '成果指標サ'
                )}
              />
            )}
            {hasValidIndicatorData(project.indicators, 'outcome', 1) && (
              <IndicatorChart
                indicators={project.indicators}
                category="outcome"
                index={1}
                label={formatIndicatorLabel(
                  project.indicatorLabels.outcome[1],
                  '成果指標シ'
                )}
              />
            )}
            {hasValidIndicatorData(project.indicators, 'outcome', 2) && (
              <IndicatorChart
                indicators={project.indicators}
                category="outcome"
                index={2}
                label={formatIndicatorLabel(
                  project.indicatorLabels.outcome[2],
                  '成果指標ス'
                )}
              />
            )}
          </>
        )}
      </div>

      {/* 評価情報カード */}
      <Card title="評価情報">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              改革改善の方向性
            </h3>
            <p className="text-sm text-gray-900">
              {project.evaluation.direction || 'なし'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              今後の方向性
            </h3>
            <p className="text-sm text-gray-900">
              {project.evaluation.futureDirection || 'なし'}
            </p>
          </div>
          {project.evaluation.comments.map((comment, index) => (
            <div key={index}>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {comment.role}意見
              </h3>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {comment.comment || 'なし'}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* 戻るリンク */}
      <div className="text-center">
        <Link
          href="/projects"
          className="inline-block text-blue-600 hover:text-blue-800 hover:underline"
        >
          ← 事業一覧に戻る
        </Link>
      </div>
    </div>
  );
}
