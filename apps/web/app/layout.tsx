import type { Metadata, Viewport } from 'next';
import { Gowun_Dodum, Caveat } from 'next/font/google';
import './globals.css';

// Storybook display (Korean) — 헤더, 발견 카운트 등
const gowun = Gowun_Dodum({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-gowun',
  display: 'swap',
});

// Handwritten accents (Latin) — 손글씨 강조 ("오늘의 고양이를 만났어요" 등)
const caveat = Caveat({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cozy Quest',
  description: '매일 풍경 1장에 숨은 고양이 1마리를 5번 탭으로 발견하고, 보금자리를 채우는 코지 발견 게임.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#F5E5B8',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${gowun.variable} ${caveat.variable}`}>
      <body className="bg-paper text-text antialiased">
        {/* 9:16 세로 컨테이너 — 데스크탑에서 가운데 정렬, 모바일은 풀스크린 */}
        <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-paper-soft">
          {children}
        </div>
      </body>
    </html>
  );
}
