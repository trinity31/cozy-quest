'use client';

import Image from 'next/image';

/**
 * 인트로 / 타이틀 화면.
 * SEASON1_CHEESE §9 [2] Title/Intro — 일러스트가 9:16 컨테이너 가득, 로고/CTA는 overlay.
 * 일러스트(§1.3): 상단 25% 로고 자리, 중앙 50% 치즈, 하단 25% CTA 자리.
 */
export function IntroView({ onStart }: { onStart: () => void }) {
  return (
    <main className="relative flex-1 overflow-hidden">
      {/* 배경 일러스트 — 컨테이너 9:16에 정확히 매칭 (SEASON1 §1.3) */}
      <Image
        src="/intro/season_001_title.png"
        alt="Cozy Quest · Season 1: 치즈의 일주일"
        fill
        priority
        sizes="(max-width: 420px) 100vw, 420px"
        className="object-cover"
      />

      {/* 상단 로고 + 부제 카드 — 완전 불투명 paper-soft로 가독성 확보 */}
      <div className="absolute inset-x-0 top-0 z-10 flex justify-center px-8 pt-20">
        <div className="rounded-card ink-line bg-paper-soft px-9 py-5">
          <h1 className="text-center font-sans text-4xl font-extrabold leading-none text-cat-deep">
            Cozy Quest
          </h1>
          <p
            className="mt-2 text-center font-sans text-lg font-semibold text-text"
            style={{ transform: 'rotate(-1.5deg)' }}
          >
            숨은 고양이 찾기
          </p>
        </div>
      </div>

      {/* 하단 시즌 타이틀 + 시작하기 */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 px-8 pb-8">
        <p className="rounded-full ink-line bg-paper-soft px-5 py-1.5 font-sans text-body font-bold text-text">
          Season 1 · 치즈의 일주일
        </p>
        <button
          type="button"
          onClick={onStart}
          className="h-14 w-full max-w-[260px] rounded-full ink-line bg-cat font-sans text-2xl font-extrabold text-[#FFFBF0] transition-colors active:bg-cat-deep"
        >
          시작하기
        </button>
      </div>
    </main>
  );
}
