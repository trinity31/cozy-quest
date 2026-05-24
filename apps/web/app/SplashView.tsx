'use client';

/**
 * Splash/Loading 화면.
 * SEASON1_CHEESE §9 [1] — Cozy Quest 로고 + preload spinner, 자산 로드 후 자동 다음.
 * 인터랙션 없이 자동 advance. BGM은 [시작하기] 이후이므로 여기선 무음.
 */
export function SplashView() {
  return (
    <main className="flex h-full flex-1 flex-col items-center justify-center gap-7 bg-paper-soft px-8">
      <div className="text-center">
        <h1 className="font-sans text-5xl font-extrabold leading-none text-cat-deep">
          Cozy Quest
        </h1>
        <p className="mt-3 font-sans text-lg font-semibold text-text">
          숨은 고양이 찾기
        </p>
      </div>
      <div
        className="flex items-center gap-2"
        role="status"
        aria-live="polite"
        aria-label="로딩 중"
      >
        <span
          className="h-2.5 w-2.5 animate-bounce rounded-full bg-cat"
          style={{ animationDelay: '0ms', animationDuration: '900ms' }}
        />
        <span
          className="h-2.5 w-2.5 animate-bounce rounded-full bg-cat"
          style={{ animationDelay: '150ms', animationDuration: '900ms' }}
        />
        <span
          className="h-2.5 w-2.5 animate-bounce rounded-full bg-cat"
          style={{ animationDelay: '300ms', animationDuration: '900ms' }}
        />
      </div>
    </main>
  );
}
