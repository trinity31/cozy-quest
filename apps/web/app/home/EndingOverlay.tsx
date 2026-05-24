'use client';

import Image from 'next/image';
import { playClickSFX } from '@/lib/feedback';

/**
 * Ending 화면 — 기획서 §5 [8] + CHEESE §9 [9]/[10].
 * - 치즈 fullbody가 인테리어 가운데에 페이드인 + breathing
 * - "시즌 클리어!" 메시지 + 시즌 맵(N/total 체크)
 * - "다음 시즌 Coming Soon" 카드
 * - 공유 버튼 (Web Share API; 브라우저 미지원 시 클립보드 폴백)
 * - 다시 보기 (오버레이 닫고 인테리어 회상)
 */
export function EndingOverlay({
  catImage,
  catName,
  seasonTitle,
  completedCount,
  totalScenes,
  onClose,
}: {
  catImage: string;
  catName: string;
  seasonTitle: string;
  completedCount: number;
  totalScenes: number;
  onClose: () => void;
}) {
  const isFullSeason = completedCount === totalScenes;
  const headline = isFullSeason
    ? `${catName}의 일주일 클리어!`
    : `${seasonTitle} 데모 클리어!`;

  async function handleShare() {
    playClickSFX();
    const text = `Cozy Quest — ${catName}의 일주일을 완성했어요 🐱`;
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({ title: 'Cozy Quest', text, url });
        return;
      }
    } catch {
      // 사용자가 취소했거나 share 실패 — 클립보드 폴백으로
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert('공유 링크가 클립보드에 복사됐어요');
    } catch {
      alert('공유에 실패했어요');
    }
  }

  function handleClose() {
    playClickSFX();
    onClose();
  }

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col items-center justify-between bg-ink/30 px-4 pt-6 pb-6 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="시즌 완성"
    >
      {/* 치즈 breathing — 상단 1/3 */}
      <div className="relative h-44 w-44">
        <Image
          src={catImage}
          alt={catName}
          fill
          sizes="176px"
          className="animate-breathing object-contain drop-shadow-[0_8px_18px_rgba(92,65,40,0.35)]"
          priority
        />
      </div>

      {/* 하단 카드 — 메시지 + 시즌 맵 + Coming Soon + CTA */}
      <div className="ink-line w-full max-w-[360px] rounded-modal bg-paper-soft p-5 text-center shadow-paper-3">
        <h2 className="font-book text-3xl font-bold text-cat-deep">
          {headline}
        </h2>
        <p className="mt-1 font-sans text-cap text-text-soft">
          치즈가 보금자리에 살게 됐어요
        </p>

        {/* 시즌 맵 — 모든 Day 완료 체크 */}
        <div className="mt-4 flex justify-center gap-1.5" role="list" aria-label="시즌 맵">
          {Array.from({ length: totalScenes }).map((_, i) => {
            const done = i < completedCount;
            return (
              <span
                key={i}
                role="listitem"
                className={`flex h-7 w-7 items-center justify-center rounded-full ink-line text-cap font-bold tabular-nums ${
                  done ? 'bg-cat text-[#FFFBF0]' : 'bg-paper text-text-faint'
                }`}
              >
                {done ? '✓' : i + 1}
              </span>
            );
          })}
        </div>

        {/* Coming Soon */}
        <div className="ink-line-dashed mt-4 rounded-card bg-[#FFFBF0] p-3">
          <p className="font-book text-base font-bold text-cat-deep">
            다음 시즌 Coming Soon
          </p>
          <p className="mt-0.5 font-sans text-cap text-text-soft">
            새 고양이 · 새 풍경 · 새 인테리어
          </p>
        </div>

        {/* CTA */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-full ink-line bg-[#FFFBF0] py-2.5 font-sans text-cap font-semibold text-text active:bg-paper"
          >
            다시 보기
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 rounded-full border-[2.5px] border-ink bg-cat py-2.5 font-sans text-cap font-bold text-[#FFFBF0] active:bg-cat-deep"
          >
            🔗 공유하기
          </button>
        </div>
      </div>
    </div>
  );
}
