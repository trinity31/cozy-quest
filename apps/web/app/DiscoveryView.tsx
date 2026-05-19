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
  type Scene,
} from '@cozy-quest/shared';
import {
  feedbackAlreadyFound,
  feedbackDiscovery,
  isMuted,
  setMuted,
  unlockAudio,
} from '@/lib/feedback';

export function DiscoveryView({ scene }: { scene: Scene }) {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [recentHitId, setRecentHitId] = useState<string | null>(null);
  const [muted, setMutedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const startedAtRef = useRef<string | null>(null);

  // Mount: localStorage 복원 + sceneStart 보장 (PRD 5.3)
  useEffect(() => {
    const now = new Date();
    const progress = getProgress();
    const { progress: next, startedAt } = getOrCreateSceneStart(
      progress,
      scene.scene_id,
      now,
    );
    if (next !== progress) setProgress(next);
    startedAtRef.current = startedAt;
    setFoundIds(getFoundPartIds(next, scene.cat.parts));
    setMutedState(isMuted());
    setHydrated(true);
  }, [scene]);

  // 발견 시각 펄스 (700ms 후 클리어)
  useEffect(() => {
    if (!recentHitId) return;
    const t = window.setTimeout(() => setRecentHitId(null), 700);
    return () => window.clearTimeout(t);
  }, [recentHitId]);

  const discovery = useMemo(
    () => getDiscoveryState(scene.cat.parts, foundIds),
    [scene.cat.parts, foundIds],
  );

  function handlePartTap(partId: string) {
    unlockAudio();
    if (foundIds.includes(partId)) {
      feedbackAlreadyFound();
      setRecentHitId(partId);
      return;
    }
    const now = new Date();
    const startedAt = startedAtRef.current ?? now.toISOString();
    const current = getProgress();
    const nextProgress = addHit(current, partId, startedAt, now);
    setProgress(nextProgress);
    const nextFound = [...foundIds, partId];
    setFoundIds(nextFound);
    setRecentHitId(partId);
    feedbackDiscovery(nextFound.length - 1); // 0-based: 방금 발견한 게 몇 번째
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) unlockAudio();
  }

  return (
    <main className="relative flex-1 overflow-hidden bg-black">
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={4}
        doubleClick={{ mode: 'reset' }}
        wheel={{ step: 0.2 }}
        pinch={{ step: 5 }}
      >
        <TransformComponent
          wrapperClass="!h-full !w-full"
          contentClass="!h-full !w-full"
        >
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
              const pulse = recentHitId === part.part_id;
              return (
                <button
                  key={part.part_id}
                  type="button"
                  aria-label={found ? `발견함: ${part.type}` : `숨은 부위 ${part.type}`}
                  onClick={() => handlePartTap(part.part_id)}
                  className="absolute rounded-full"
                  style={{
                    left: `${(part.x - part.radius) * 100}%`,
                    top: `${(part.y - part.radius) * 100}%`,
                    width: `${part.radius * 200}%`,
                    height: `${part.radius * 200}%`,
                  }}
                >
                  {found && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-amber-300/70" />
                  )}
                  {pulse && (
                    <span className="absolute inset-0 animate-[ping_700ms_ease-out_1] rounded-full bg-amber-300/50" />
                  )}
                </button>
              );
            })}
          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* 상단 헤더 */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 pb-6 pt-3">
        <h1 className="text-sm font-medium text-white/90">{scene.title}</h1>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm tabular-nums">
            {hydrated ? `${discovery.found}/${discovery.total}` : `0/${scene.cat.parts.length}`} 발견
          </span>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? '소리 켜기' : '소리 끄기'}
            className="pointer-events-auto rounded-full bg-black/40 px-2.5 py-1 text-xs text-white/90 backdrop-blur-sm"
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>

      {/* 풀바디 등장 오버레이 */}
      {discovery.isComplete && <FullbodyOverlay scene={scene} />}

      {/* 하단 푸터 — Day 3에 보금자리 */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center bg-gradient-to-t from-black/60 to-transparent px-4 pb-6 pt-8">
        <button
          type="button"
          disabled
          aria-disabled
          className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white/40 backdrop-blur-sm"
        >
          🏠 보금자리
        </button>
      </footer>
    </main>
  );
}

function FullbodyOverlay({ scene }: { scene: Scene }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
      <div className="w-full max-w-xs rounded-2xl bg-white/10 p-6 text-center">
        <div className="relative mx-auto aspect-square w-40">
          <Image
            src={scene.cat.fullbody_image_url}
            alt={scene.cat.name}
            fill
            className="object-contain"
            sizes="160px"
          />
        </div>
        <p className="mt-3 text-lg font-medium text-white">{scene.cat.name}</p>
        <p className="text-sm text-white/70">{scene.cat.personality}</p>
        <p className="mt-4 text-xs text-white/50">Day 3 — 가구 3중 택1 예정</p>
      </div>
    </div>
  );
}
