/**
 * Footer コンポーネントのテスト
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('免責事項が表示される', () => {
    render(<Footer />);

    expect(
      screen.getByText(
        '本サイトは大船渡市のオープンデータをもとに市民が作成したものです。公式情報は大船渡市HPをご確認ください。'
      )
    ).toBeInTheDocument();
  });

  it('コピーライト表記が存在しない', () => {
    render(<Footer />);

    // コピーライト記号を含むテキストが存在しないことを確認
    expect(screen.queryByText(/©/)).not.toBeInTheDocument();
    expect(screen.queryByText(/All rights reserved/)).not.toBeInTheDocument();
  });
});
