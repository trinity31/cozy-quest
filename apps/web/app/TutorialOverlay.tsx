'use client';

import { useState } from 'react';
import { playClickSFX } from '@/lib/feedback';

/**
 * Tutorial — 기획서 §5 [3]. 첫 진입 1회만 표시되는 3컷 말풍선.
 * - 컷 1: 탭으로 부위 찾기
 * - 컷 2: 가구 선택
 * - 컷 3: 인테리어 채우기
 * 진척은 [[TutorialGate]]가 localStorage로 관리. 본 컴포넌트는 표시 + onFinish만.
 */

const STEPS: Array<{ emoji: string; title: string; body: string }> = [
  {
    emoji: '👆',
    title: '탭으로 치즈를 찾아요',
    body: '풍경 곳곳에 숨은 5개 단서를 탭으로 찾으세요. 5개를 다 찾으면 고양이 치즈가 나타나요.',
  },
  {
    emoji: '🎁',
    title: '선물을 골라요',
    body: '치즈가 가구 3개를 줘요. 그중 하나를 골라 보금자리에 박을 수 있어요.',
  },
  {
    emoji: '🏠',
    title: '나만의 인테리어',
    body: '7개 풍경을 클리어할수록 빈 방이 점점 채워져요. 시즌 끝나면 치즈가 방에 살아요.',
  },
];

export function TutorialOverlay({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step]!;

  function handleNext() {
    playClickSFX();
    if (isLast) {
      onFinish();
      return;
    }
    setStep(step + 1);
  }

  function handleSkip() {
    playClickSFX();
    onFinish();
  }

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center bg-paper-soft px-6">
      <button
        type="button"
        onClick={handleSkip}
        className="absolute right-4 top-4 rounded-full px-3 py-1 font-sans text-cap font-semibold text-text-soft active:bg-paper"
        aria-label="튜토리얼 건너뛰기"
      >
        건너뛰기
      </button>

      <div className="flex w-full max-w-[320px] flex-col items-center gap-5">
        <div
          className="ink-line flex h-32 w-32 items-center justify-center rounded-full bg-paper text-6xl"
          aria-hidden
        >
          {current.emoji}
        </div>

        <div className="ink-line w-full rounded-modal bg-[#FFFBF0] p-5 text-center">
          <h2 className="font-mark text-2xl text-cat-deep" style={{ transform: 'rotate(-1deg)' }}>
            {current.title}
          </h2>
          <p className="mt-2 font-sans text-body leading-relaxed text-text">{current.body}</p>
        </div>

        <div className="flex items-center gap-2" role="status" aria-label={`${step + 1} / ${STEPS.length}`}>
          {STEPS.map((_, i) => (
            <span
              key={i}
              aria-hidden
              className={`block h-2 w-2 rounded-full ${
                i === step ? 'bg-cat-deep' : 'bg-text-faint/40'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="h-12 w-full max-w-[240px] rounded-full ink-line bg-cat font-sans text-lg font-extrabold text-[#FFFBF0] active:bg-cat-deep"
        >
          {isLast ? '시작하기' : '다음'}
        </button>
      </div>
    </main>
  );
}
