/**
 * lib/utils.ts のユーティリティ関数のテスト
 */

import { describe, it, expect } from 'vitest';
import { formatJapaneseYen, formatAmount } from './utils';

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
