/**
 * tiny-segmenter の型定義
 *
 * tiny-segmenterは型定義ファイルを提供していないため、
 * プロジェクト内で独自に定義します。
 */

declare module 'tiny-segmenter' {
  /**
   * TinySegmenter - 日本語軽量形態素解析器
   */
  class TinySegmenter {
    /**
     * コンストラクタ
     */
    constructor();

    /**
     * テキストを形態素に分割する
     *
     * @param text - 分割対象のテキスト
     * @returns 形態素の配列
     */
    segment(text: string): string[];
  }

  export = TinySegmenter;
}
