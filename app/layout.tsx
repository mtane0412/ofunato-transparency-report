/**
 * ルートレイアウト
 *
 * アプリケーション全体の基本レイアウトを定義します。
 * ヘッダー、メインコンテンツ、フッターを含みます。
 */

import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { AmountDisplayProvider } from '@/contexts/AmountDisplayContext';

export const metadata: Metadata = {
  title: '大船渡市 事務事業評価データ（非公式）',
  description: '大船渡市の事務事業評価データを可視化したダッシュボードです。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen">
        <AmountDisplayProvider>
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
          <Footer />
        </AmountDisplayProvider>
        <Analytics />
      </body>
    </html>
  );
}
