'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import {
  addHit,
  addHomeSlot,
  getDiscoveryState,
  getFoundPartIds,
  getOrCreateSceneStart,
  getProgress,
  setProgress,
  type FurnitureOption,
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
                    left: `${part.x * 100}%`,
                    top: `${part.y * 100}%`,
                    width: `${part.radius * 200}%`,
                    aspectRatio: '1',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {found && (
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{ border: '4px solid #FFFBF0' }}
                    />
                  )}
                  {pulse && (
                    <span className="absolute inset-0 animate-[ping_700ms_ease-out_1] rounded-full bg-white/60" />
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

      {/* CatRevealModal — 5/5 달성 시 등장. 선물 받기 → 가구 3중 택1로 phase 전환 */}
      {discovery.isComplete && <RewardModal scene={scene} />}

      {/* 하단 푸터 — 보금자리 라우팅 */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-5">
        <Link
          href="/home"
          className="pointer-events-auto rounded-full ink-line bg-[#FFFBF0] px-5 py-2.5 text-cap font-semibold text-text shadow-ink-1 backdrop-blur-sm"
        >
          🏠 보금자리
        </Link>
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

// ─── RewardModal — reveal(고양이 만남) → pick(선물 3중 택1) ─────────

function RewardModal({ scene }: { scene: Scene }) {
  const router = useRouter();
  const [phase, setPhase] = useState<'reveal' | 'pick'>('reveal');

  function handleChoose(option: FurnitureOption) {
    const next = addHomeSlot(
      getProgress(),
      {
        season_id: scene.season_id,
        category: scene.furniture_category,
        cat_id: scene.cat.cat_id,
        furniture_id: option.id,
      },
      new Date(),
    );
    setProgress(next);
    router.push('/home');
  }

  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center bg-ink/40 px-4 pb-8 backdrop-blur-sm sm:items-center sm:pb-0">
      <div className="relative w-full max-w-[320px] overflow-hidden rounded-modal ink-line bg-[#FFFBF0] p-5 shadow-paper-3 animate-slide-up">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 left-1/2 h-56 w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(232,197,108,0.45)_0%,transparent_60%)]"
        />
        {phase === 'reveal' ? (
          <RevealCard scene={scene} onAdvance={() => setPhase('pick')} />
        ) : (
          <PickCard scene={scene} onChoose={handleChoose} />
        )}
      </div>
    </div>
  );
}

function RevealCard({ scene, onAdvance }: { scene: Scene; onAdvance: () => void }) {
  return (
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
        <p className="text-body text-text-soft">{scene.cat.personality}</p>
        <h2 className="mt-1 font-book text-h1 text-text">{scene.cat.name}</h2>
      </div>

      <button
        type="button"
        onClick={onAdvance}
        className="mt-4 h-12 w-full rounded-full ink-line bg-cat font-semibold text-[#FFFBF0] shadow-cat-1 transition-transform active:translate-y-0.5 active:shadow-none"
      >
        선물 받기
      </button>
    </div>
  );
}

function PickCard({
  scene,
  onChoose,
}: {
  scene: Scene;
  onChoose: (opt: FurnitureOption) => void;
}) {
  return (
    <div className="relative">
      <p className="text-center font-mark text-xl text-cat-deep" style={{ transform: 'rotate(-2deg)' }}>
        {scene.cat.name}가 준 선물
      </p>
      <p className="mt-1 text-center text-cap text-text-soft">하나만 골라 보금자리에 두세요</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {scene.cat.furniture_options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChoose(opt)}
            aria-label={opt.name}
            className="group flex flex-col items-center gap-1 rounded-card ink-line bg-paper-soft p-2 shadow-ink-1 transition-transform active:translate-y-0.5 active:shadow-none"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-md">
              <Image
                src={opt.image_url}
                alt={opt.name}
                fill
                sizes="96px"
                className="object-contain"
              />
            </div>
            <span className="text-cap font-semibold text-text">{opt.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
