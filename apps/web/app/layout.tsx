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
      <body className="flex min-h-screen items-center justify-center bg-paper-deep text-text antialiased">
        {/* 9:16 모바일 프레임 — 모든 화면에서 9:16 박스 + 둥근 모서리 + ink 테두리 + 그림자
            (GAME_RULES §O.1, SEASON1 §9.1: max-width 420px + 코지 톤 배경 + 세로 모드 고정)
            width = 420 / 100vw / 96vh*9/16 중 최소 → 화면 세로가 짧아도 비율 유지하며 자동 축소 */}
        <div
          className="mx-auto flex aspect-[9/16] flex-col overflow-hidden bg-paper-soft
                     w-[min(420px,100vw,calc(96vh*9/16))]
                     rounded-modal ink-line"
        >
          {children}
        </div>
      </body>
    </html>
  );
}
