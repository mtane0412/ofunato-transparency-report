/**
 * lib/utils.ts のユーティリティ関数のテスト
 */

import { describe, it, expect } from 'vitest';
import {
  formatJapaneseYen,
  formatAmount,
  formatAmountShort,
  formatIndicatorLabel,
} from './utils';

describe('formatJapaneseYen', () => {
  it('0千円を0円として表示する', () => {
    expect(formatJapaneseYen(0)).toBe('0円');
  });

  it('3千円を3,000円として表示する', () => {
    expect(formatJapaneseYen(3)).toBe('3,000円');
  });

  it('3089千円を308万9,000円として表示する', () => {
    expect(formatJapaneseYen(3089)).toBe('308万9,000円');
  });

  it('10000千円を1,000万円として表示する', () => {
    expect(formatJapaneseYen(10000)).toBe('1,000万円');
  });

  it('130005千円を1億3,000万5,000円として表示する', () => {
    expect(formatJapaneseYen(130005)).toBe('1億3,000万5,000円');
  });

  it('100000千円を1億円として表示する', () => {
    expect(formatJapaneseYen(100000)).toBe('1億円');
  });

  it('1千円を1,000円として表示する', () => {
    expect(formatJapaneseYen(1)).toBe('1,000円');
  });

  it('10千円を1万円として表示する', () => {
    expect(formatJapaneseYen(10)).toBe('1万円');
  });

  it('100千円を10万円として表示する', () => {
    expect(formatJapaneseYen(100)).toBe('10万円');
  });

  it('1000千円を100万円として表示する', () => {
    expect(formatJapaneseYen(1000)).toBe('100万円');
  });

  it('負の値を処理できる', () => {
    expect(formatJapaneseYen(-3089)).toBe('-308万9,000円');
  });

  it('端数がある場合も正しく表示する', () => {
    expect(formatJapaneseYen(12345)).toBe('1,234万5,000円');
  });
});

describe('formatAmount', () => {
  it('千円モードで金額にカンマを付けて表示する', () => {
    expect(formatAmount(130005, 'thousand')).toBe('130,005千円');
  });

  it('千円モードで0を0千円として表示する', () => {
    expect(formatAmount(0, 'thousand')).toBe('0千円');
  });

  it('千円モードで負の値を表示する', () => {
    expect(formatAmount(-12345, 'thousand')).toBe('-12,345千円');
  });

  it('日本語モードで金額を日本語表記で表示する', () => {
    expect(formatAmount(130005, 'japanese')).toBe('1億3,000万5,000円');
  });

  it('日本語モードで0を0円として表示する', () => {
    expect(formatAmount(0, 'japanese')).toBe('0円');
  });

  it('日本語モードで負の値を表示する', () => {
    expect(formatAmount(-3089, 'japanese')).toBe('-308万9,000円');
  });
});

describe('formatAmountShort', () => {
  describe('thousandモード', () => {
    it('1,000千円未満はそのまま表示する', () => {
      expect(formatAmountShort(100, 'thousand')).toBe('100千円');
      expect(formatAmountShort(999, 'thousand')).toBe('999千円');
    });

    it('1,000千円以上はカンマ付きで表示する', () => {
      expect(formatAmountShort(1000, 'thousand')).toBe('1,000千円');
      expect(formatAmountShort(10000, 'thousand')).toBe('10,000千円');
      expect(formatAmountShort(130005, 'thousand')).toBe('130,005千円');
    });

    it('0は0千円として表示する', () => {
      expect(formatAmountShort(0, 'thousand')).toBe('0千円');
    });

    it('負の値を処理できる', () => {
      expect(formatAmountShort(-1000, 'thousand')).toBe('-1,000千円');
    });
  });

  describe('japaneseモード', () => {
    it('1万円未満は千円単位で表示する', () => {
      expect(formatAmountShort(1, 'japanese')).toBe('1千円');
      expect(formatAmountShort(5, 'japanese')).toBe('5千円');
      expect(formatAmountShort(9, 'japanese')).toBe('9千円');
    });

    it('1万円〜1億円未満は万円単位で表示する（小数点1桁）', () => {
      expect(formatAmountShort(10, 'japanese')).toBe('1万');
      expect(formatAmountShort(15, 'japanese')).toBe('1.5万');
      expect(formatAmountShort(100, 'japanese')).toBe('10万');
      expect(formatAmountShort(3089, 'japanese')).toBe('308.9万');
      expect(formatAmountShort(10000, 'japanese')).toBe('1,000万');
      expect(formatAmountShort(99999, 'japanese')).toBe('9,999.9万');
    });

    it('1億円以上は億円単位で表示する（小数点1桁）', () => {
      expect(formatAmountShort(100000, 'japanese')).toBe('1億');
      expect(formatAmountShort(130005, 'japanese')).toBe('1.3億');
      expect(formatAmountShort(1000000, 'japanese')).toBe('10億');
      expect(formatAmountShort(1234567, 'japanese')).toBe('12.3億');
    });

    it('0は0円として表示する', () => {
      expect(formatAmountShort(0, 'japanese')).toBe('0円');
    });

    it('負の値を処理できる', () => {
      expect(formatAmountShort(-10, 'japanese')).toBe('-1万');
      expect(formatAmountShort(-130005, 'japanese')).toBe('-1.3億');
    });
  });
});

describe('formatIndicatorLabel', () => {
  it('名称と単位の両方がある場合は「名称（単位）」形式で表示する', () => {
    expect(formatIndicatorLabel({ name: '参加者数', unit: '人' }, 'デフォルト')).toBe('参加者数（人）');
  });

  it('名称のみの場合は名称を表示する', () => {
    expect(formatIndicatorLabel({ name: '参加者数', unit: '' }, 'デフォルト')).toBe('参加者数');
  });

  it('単位のみの場合はデフォルトラベルと単位を表示する', () => {
    expect(formatIndicatorLabel({ name: '', unit: '人' }, 'デフォルトラベル')).toBe('デフォルトラベル（人）');
  });

  it('両方とも空の場合はデフォルトラベルを表示する', () => {
    expect(formatIndicatorLabel({ name: '', unit: '' }, 'デフォルトラベル')).toBe('デフォルトラベル');
  });

  it('labelがundefinedの場合でもエラーにならずデフォルトラベルを表示する', () => {
    expect(formatIndicatorLabel(undefined, 'デフォルトラベル')).toBe('デフォルトラベル');
  });

  it('labelがnullの場合でもエラーにならずデフォルトラベルを表示する', () => {
    expect(formatIndicatorLabel(null as unknown as { name: string; unit: string }, 'デフォルトラベル')).toBe('デフォルトラベル');
  });

  it('nameやunitがundefinedの場合でも正しく処理する', () => {
    expect(formatIndicatorLabel({ name: undefined as unknown as string, unit: '人' }, 'デフォルト')).toBe('デフォルト（人）');
    expect(formatIndicatorLabel({ name: '参加者数', unit: undefined as unknown as string }, 'デフォルト')).toBe('参加者数');
  });
});
