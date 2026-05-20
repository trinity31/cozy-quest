'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import {
  addHit,
  getDiscoveryState,
  getFoundPartIds,
  getOrCreateSceneStart,
  getProgress,
  setProgress,
  type PartType,
  type Scene,
} from '@cozy-quest/shared';
import {
  feedbackAlreadyFound,
  feedbackDiscovery,
  isMuted,
  setMuted,
  unlockAudio,
} from '@/lib/feedback';

const PART_LABEL: Record<PartType, string> = {
  fullbody: '풀바디',
  tail: '꼬리',
  ears: '귀',
  paw: '발',
  face: '얼굴',
  back: '등',
};

export function DiscoveryView({ scene }: { scene: Scene }) {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [recentHit, setRecentHit] = useState<{ id: string; type: PartType; isNew: boolean } | null>(
    null,
  );
  const [muted, setMutedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const startedAtRef = useRef<string | null>(null);

  // Mount: localStorage 복원 + sceneStart 보장
  useEffect(() => {
    const now = new Date();
    const progress = getProgress();
    const { progress: next, startedAt } = getOrCreateSceneStart(progress, scene.scene_id, now);
    if (next !== progress) setProgress(next);
    startedAtRef.current = startedAt;
    setFoundIds(getFoundPartIds(next, scene.cat.parts));
    setMutedState(isMuted());
    setHydrated(true);
  }, [scene]);

  // 토스트는 1.4s 후 자동 클리어 (toast-pop 애니메이션 길이와 일치)
  useEffect(() => {
    if (!recentHit) return;
    const t = window.setTimeout(() => setRecentHit(null), 1400);
    return () => window.clearTimeout(t);
  }, [recentHit]);

  const discovery = useMemo(
    () => getDiscoveryState(scene.cat.parts, foundIds),
    [scene.cat.parts, foundIds],
  );

  function handlePartTap(partId: string, type: PartType) {
    unlockAudio();
    if (foundIds.includes(partId)) {
      feedbackAlreadyFound();
      setRecentHit({ id: partId, type, isNew: false });
      return;
    }
    const now = new Date();
    const startedAt = startedAtRef.current ?? now.toISOString();
    const current = getProgress();
    const nextProgress = addHit(current, partId, startedAt, now);
    setProgress(nextProgress);
    const nextFound = [...foundIds, partId];
    setFoundIds(nextFound);
    setRecentHit({ id: partId, type, isNew: true });
    feedbackDiscovery(nextFound.length - 1);
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) unlockAudio();
  }

  return (
    <main className="relative flex-1 overflow-hidden bg-paper">
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={4}
        doubleClick={{ mode: 'reset' }}
        wheel={{ step: 0.2 }}
        pinch={{ step: 5 }}
      >
        <TransformComponent wrapperClass="!h-full !w-full" contentClass="!h-full !w-full">
          <div className="relative aspect-[9/16] w-full select-none">
            <Image
              src={scene.image_url}
              alt={scene.title}
              fill
              priority
              sizes="(max-width: 480px) 100vw, 480px"
              className="object-cover"
              draggable={false}
            />

            {scene.cat.parts.map((part) => {
              const found = foundIds.includes(part.part_id);
              const pulse = recentHit?.id === part.part_id && recentHit.isNew;
              return (
                <button
                  key={part.part_id}
                  type="button"
                  aria-label={found ? `발견함: ${PART_LABEL[part.type]}` : `숨은 부위 ${PART_LABEL[part.type]}`}
                  onClick={() => handlePartTap(part.part_id, part.type)}
                  className="absolute rounded-full"
                  style={{
                    left: `${(part.x - part.radius) * 100}%`,
                    top: `${(part.y - part.radius) * 100}%`,
                    width: `${part.radius * 200}%`,
                    height: `${part.radius * 200}%`,
                  }}
                >
                  {found && (
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: '4px solid #5C4128',
                        backgroundColor: 'rgba(232, 197, 108, 0.6)',
                        boxShadow:
                          '0 0 0 3px #FFFBF0, 0 6px 14px rgba(92, 65, 40, 0.45)',
                      }}
                    />
                  )}
                  {pulse && (
                    <span className="absolute inset-0 animate-[ping_700ms_ease-out_1] rounded-full bg-cat/60" />
                  )}
                </button>
              );
            })}
          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* 상단 헤더 — 5-slot 발견 카운트 + 음소거 */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-3 pt-3">
        <div className="pointer-events-auto">
          <DiscoveryHeader found={hydrated ? discovery.found : 0} total={scene.cat.parts.length} />
        </div>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? '소리 켜기' : '소리 끄기'}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full ink-line bg-[#FFFBF0] text-text shadow-ink-1 backdrop-blur-sm"
        >
          <span className="text-sm">{muted ? '🔇' : '🔊'}</span>
        </button>
      </header>

      {/* CatRevealModal — 5/5 달성 */}
      {discovery.isComplete && <CatRevealModal scene={scene} />}

      {/* 하단 푸터 — Day 3에 보금자리 라우팅 */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-5">
        <button
          type="button"
          disabled
          aria-disabled
          className="rounded-full ink-line bg-[#FFFBF0]/90 px-5 py-2.5 text-cap font-semibold text-text-faint shadow-ink-1 backdrop-blur-sm"
        >
          🏠 보금자리
        </button>
      </footer>
    </main>
  );
}

// ─── DiscoveryHeader — pill + 5 slot dots ───────────────────────────

function DiscoveryHeader({ found, total }: { found: number; total: number }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full ink-line bg-[#FFFBF0]/90 px-3 py-1.5 shadow-ink-1 backdrop-blur-md">
      <div className="flex items-baseline gap-[1px] border-r border-ink-faint pr-2 font-book leading-none">
        <span className="text-base text-cat-deep">{found}</span>
        <span className="text-[10px] text-text-faint">/{total}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => {
          const filled = i < found;
          return (
            <span
              key={i}
              aria-hidden
              className={`block h-5 w-5 rounded-full transition-all duration-200 ${
                filled
                  ? 'ink-line bg-cat shadow-cat-1'
                  : 'ink-line-faint bg-[#FFFBF0]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── CatRevealModal — 5/5 달성 시 슬라이드 업 ────────────────────

function CatRevealModal({ scene }: { scene: Scene }) {
  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center bg-ink/40 px-4 pb-8 backdrop-blur-sm sm:items-center sm:pb-0">
      <div className="relative w-full max-w-[300px] overflow-hidden rounded-modal ink-line bg-[#FFFBF0] p-5 shadow-paper-3 animate-slide-up">
        {/* honey 광배 */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 left-1/2 h-56 w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(232,197,108,0.45)_0%,transparent_60%)]"
        />
        <div className="relative">
          <p className="text-center font-mark text-xl text-cat-deep" style={{ transform: 'rotate(-2deg)' }}>
            오늘의 고양이를 만났어요
          </p>

          <div className="mx-auto mt-3 aspect-square w-40">
            <div className="relative h-full w-full overflow-hidden rounded-card ink-line bg-paper-soft">
              <Image
                src={scene.cat.fullbody_image_url}
                alt={scene.cat.name}
                fill
                sizes="160px"
                className="object-contain p-3"
              />
            </div>
          </div>

          <div className="mt-3 text-center">
            <h2 className="font-book text-h1 text-text">{scene.cat.name}</h2>
            <p className="mt-1 text-body text-text-soft">{scene.cat.personality}</p>
          </div>

          <button
            type="button"
            disabled
            className="mt-4 h-12 w-full rounded-full ink-line bg-cat/60 font-semibold text-[#FFFBF0]/80 shadow-cat-1 disabled:cursor-not-allowed"
          >
            가구 받기
          </button>
          <p className="mt-2 text-center text-cap text-text-faint">Day 3 — 가구 3중 택1 예정</p>
        </div>
      </div>
    </div>
  );
}
