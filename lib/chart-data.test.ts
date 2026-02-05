/**
 * lib/chart-data.ts のテスト
 * グラフ用データ変換関数の単体テスト
 */

import { describe, it, expect } from 'vitest';
import {
  formatFiscalYear,
  toGrandTotalChartData,
  toRevenueSourceChartData,
  toCostBreakdownChartData,
  toIndicatorChartData,
  hasValidIndicatorData,
} from './chart-data';
import type { YearlyFinancial, YearlyIndicator } from '@/types';

describe('formatFiscalYear', () => {
  it('年度数値を和暦文字列に変換する', () => {
    expect(formatFiscalYear(5)).toBe('R5');
    expect(formatFiscalYear(4)).toBe('R4');
    expect(formatFiscalYear(10)).toBe('R10');
  });
});

describe('toGrandTotalChartData', () => {
  it('財政データからトータルコスト推移用データに変換する', () => {
    const fiscalData: YearlyFinancial[] = [
      { year: 4, grandTotal: 1000000 } as YearlyFinancial,
      { year: 5, grandTotal: 1200000 } as YearlyFinancial,
    ];

    const result = toGrandTotalChartData(fiscalData);

    expect(result).toEqual([
      { year: 'R4', トータルコスト: 1000000 },
      { year: 'R5', トータルコスト: 1200000 },
    ]);
  });

  it('空配列の場合は空配列を返す', () => {
    expect(toGrandTotalChartData([])).toEqual([]);
  });

  it('grandTotalがnullの場合は0として扱う', () => {
    const fiscalData: YearlyFinancial[] = [
      { year: 4, grandTotal: null } as unknown as YearlyFinancial,
    ];

    const result = toGrandTotalChartData(fiscalData);

    expect(result).toEqual([{ year: 'R4', トータルコスト: 0 }]);
  });
});

describe('toRevenueSourceChartData', () => {
  it('財政データから財源構成用データに変換する', () => {
    const fiscalData: YearlyFinancial[] = [
      {
        year: 5,
        nationalSubsidy: 100000,
        prefecturalSubsidy: 50000,
        localBond: 30000,
        other: 20000,
        generalRevenue: 300000,
      } as YearlyFinancial,
    ];

    const result = toRevenueSourceChartData(fiscalData);

    expect(result).toEqual([
      {
        year: 'R5',
        国庫支出金: 100000,
        県支出金: 50000,
        地方債: 30000,
        その他: 20000,
        一般財源: 300000,
      },
    ]);
  });

  it('nullの場合は0として扱う', () => {
    const fiscalData: YearlyFinancial[] = [
      {
        year: 4,
        nationalSubsidy: null,
        prefecturalSubsidy: null,
        localBond: null,
        other: null,
        generalRevenue: 100000,
      } as unknown as YearlyFinancial,
    ];

    const result = toRevenueSourceChartData(fiscalData);

    expect(result).toEqual([
      {
        year: 'R4',
        国庫支出金: 0,
        県支出金: 0,
        地方債: 0,
        その他: 0,
        一般財源: 100000,
      },
    ]);
  });
});

describe('toCostBreakdownChartData', () => {
  it('財政データから事業費vs人件費用データに変換する', () => {
    const fiscalData: YearlyFinancial[] = [
      {
        year: 5,
        totalCost: 500000,
        personnelCost: 200000,
      } as YearlyFinancial,
    ];

    const result = toCostBreakdownChartData(fiscalData);

    expect(result).toEqual([
      {
        year: 'R5',
        事業費: 500000,
        人件費: 200000,
      },
    ]);
  });

  it('nullの場合は0として扱う', () => {
    const fiscalData: YearlyFinancial[] = [
      {
        year: 4,
        totalCost: null,
        personnelCost: null,
      } as unknown as YearlyFinancial,
    ];

    const result = toCostBreakdownChartData(fiscalData);

    expect(result).toEqual([
      {
        year: 'R4',
        事業費: 0,
        人件費: 0,
      },
    ]);
  });
});

describe('toIndicatorChartData', () => {
  it('指標データから指定カテゴリ・インデックスのデータを抽出する', () => {
    const indicatorData: YearlyIndicator[] = [
      {
        year: 4,
        activity: [100, 200, null],
        target: [null, null, null],
        outcome: [null, null, null],
      },
      {
        year: 5,
        activity: [150, 250, null],
        target: [null, null, null],
        outcome: [null, null, null],
      },
    ];

    const result = toIndicatorChartData(indicatorData, 'activity', 0);

    expect(result).toEqual([
      { year: 'R4', 実績値: 100 },
      { year: 'R5', 実績値: 150 },
    ]);
  });

  it('nullの値は除外する', () => {
    const indicatorData: YearlyIndicator[] = [
      {
        year: 4,
        activity: [100, null, null],
        target: [null, null, null],
        outcome: [null, null, null],
      },
      {
        year: 5,
        activity: [null, null, null],
        target: [null, null, null],
        outcome: [null, null, null],
      },
      {
        year: 6,
        activity: [200, null, null],
        target: [null, null, null],
        outcome: [null, null, null],
      },
    ];

    const result = toIndicatorChartData(indicatorData, 'activity', 0);

    expect(result).toEqual([
      { year: 'R4', 実績値: 100 },
      { year: 'R6', 実績値: 200 },
    ]);
  });

  it('指定されたインデックスが範囲外の場合は空配列を返す', () => {
    const indicatorData: YearlyIndicator[] = [
      {
        year: 4,
        activity: [100, null, null],
        target: [null, null, null],
        outcome: [null, null, null],
      },
    ];

    const result = toIndicatorChartData(indicatorData, 'activity', 3);

    expect(result).toEqual([]);
  });
});

describe('hasValidIndicatorData', () => {
  it('有効なデータが1つ以上ある場合はtrueを返す', () => {
    const indicatorData: YearlyIndicator[] = [
      {
        year: 4,
        activity: [100, null, null],
        target: [null, null, null],
        outcome: [null, null, null],
      },
    ];

    expect(hasValidIndicatorData(indicatorData, 'activity', 0)).toBe(true);
  });

  it('すべてnullの場合はfalseを返す', () => {
    const indicatorData: YearlyIndicator[] = [
      {
        year: 4,
        activity: [null, null, null],
        target: [null, null, null],
        outcome: [null, null, null],
      },
      {
        year: 5,
        activity: [null, null, null],
        target: [null, null, null],
        outcome: [null, null, null],
      },
    ];

    expect(hasValidIndicatorData(indicatorData, 'activity', 0)).toBe(false);
  });

  it('指定されたインデックスが範囲外の場合はfalseを返す', () => {
    const indicatorData: YearlyIndicator[] = [
      {
        year: 4,
        activity: [100, null, null],
        target: [null, null, null],
        outcome: [null, null, null],
      },
    ];

    expect(hasValidIndicatorData(indicatorData, 'activity', 3)).toBe(false);
  });

  it('空配列の場合はfalseを返す', () => {
    expect(hasValidIndicatorData([], 'activity', 0)).toBe(false);
  });
});
