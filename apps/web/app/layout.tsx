import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cozy Quest',
  description: '매일 풍경 1장에 숨은 고양이 1마리를 5번 탭으로 발견하고, 보금자리를 채우는 코지 발견 게임.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-black text-white antialiased">
        {/* 9:16 세로 컨테이너 — 데스크탑에서는 가운데 정렬, 모바일은 풀스크린 */}
        <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-black">
          {children}
        </div>
      </body>
    </html>
  );
}
