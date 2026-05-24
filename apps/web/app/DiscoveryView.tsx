'use client';

import Link from 'next/link';
import { ImageWithSpinner } from './ImageWithSpinner';
import { HomeIcon, SearchIcon } from './icons';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import {
  addHit,
  addHomeSlot,
  clearProgress,
  getDiscoveryState,
  getFoundPartIds,
  getOrCreateSceneStart,
  getProgress,
  getSeasonSlots,
  setProgress,
  type FurnitureOption,
  type PartType,
  type Scene,
} from '@cozy-quest/shared';
import {
  feedbackAlreadyFound,
  feedbackDiscovery,
  isMuted,
  playClickSFX,
  playPlaceSFX,
  setMuted,
  unlockAudio,
} from '@/lib/feedback';

const isDev = process.env.NODE_ENV === 'development';

// 기획서 §2.1 / §5 [5]: 씬당 60초 빡세게 (시즌1 CHEESE 메커닉 2026-05-22).
const SCENE_DURATION_SECONDS = 60;
// 기획서 §2.3: 힌트 씬당 2회 고정.
const HINTS_PER_SCENE = 2;
// 힌트 펄스 지속 시간 (ms)
const HINT_PULSE_MS = 1400;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

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
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  // 시즌 첫 만남 여부 — 가구 슬롯 0개일 때만 RevealCard("오늘의 고양이를 만났어요"),
  // 재회(Day 2~)는 바로 PickCard로 스킵.
  const [isFirstMeeting, setIsFirstMeeting] = useState(true);
  // 5/5 영속 + 선물 미수령 상태에서 사용자가 모달 닫고 풍경 회상할 수 있게.
  // 세션 단위 (새로고침 시 초기화 = 자동 재등장).
  const [rewardDismissed, setRewardDismissed] = useState(false);
  // 기획서 §2.1 / §2.3 / §5 [5] — 타이머 + 힌트.
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [hintsLeft, setHintsLeft] = useState(HINTS_PER_SCENE);
  const [hintedPartId, setHintedPartId] = useState<string | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const startedAtRef = useRef<string | null>(null);

  // Mount: localStorage 복원 + sceneStart 보장
  useEffect(() => {
    const now = new Date();
    const progress = getProgress();
    const { progress: next, startedAt } = getOrCreateSceneStart(progress, scene.scene_id, now);
    if (next !== progress) setProgress(next);
    startedAtRef.current = startedAt;
    setFoundIds(getFoundPartIds(next, scene.cat.parts));
    setAlreadyClaimed(
      Boolean(getSeasonSlots(next, scene.season_id)[scene.furniture_category]),
    );
    setIsFirstMeeting(
      next.home_slots.filter((s) => s.season_id === scene.season_id).length === 0,
    );
    setMutedState(isMuted());
    setHydrated(true);
  }, [scene]);

  // 토스트는 1.4s 후 자동 클리어 (toast-pop 애니메이션 길이와 일치)
  useEffect(() => {
    if (!recentHit) return;
    const t = window.setTimeout(() => setRecentHit(null), 1400);
    return () => window.clearTimeout(t);
  }, [recentHit]);

  // 힌트 펄스 자동 클리어
  useEffect(() => {
    if (!hintedPartId) return;
    const t = window.setTimeout(() => setHintedPartId(null), HINT_PULSE_MS);
    return () => window.clearTimeout(t);
  }, [hintedPartId]);

  const discovery = useMemo(
    () => getDiscoveryState(scene.cat.parts, foundIds),
    [scene.cat.parts, foundIds],
  );

  const hasParts = scene.cat.parts.length > 0;
  const timerActive =
    hydrated && hasParts && !discovery.isComplete && secondsLeft !== null;

  // 타이머 시작 — 5/5 미발견 + 부위 있음 + 하이드레이션 완료 시.
  useEffect(() => {
    if (!hydrated) return;
    if (!hasParts) return;
    if (discovery.isComplete) return;
    if (secondsLeft !== null) return;
    setSecondsLeft(SCENE_DURATION_SECONDS);
  }, [hydrated, hasParts, discovery.isComplete, secondsLeft]);

  // 1초 tick
  useEffect(() => {
    if (!timerActive) return;
    if (secondsLeft === null || secondsLeft <= 0) return;
    const t = window.setTimeout(() => setSecondsLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [timerActive, secondsLeft]);

  // 시간 초과 → 씬 재시작 트리거 (CHEESE 메커닉 2026-05-22: 시간초과=씬 재시작).
  useEffect(() => {
    if (!hydrated) return;
    if (!hasParts) return;
    if (discovery.isComplete) return;
    if (secondsLeft !== 0) return;
    if (timeUp) return;
    setTimeUp(true);
  }, [hydrated, hasParts, discovery.isComplete, secondsLeft, timeUp]);

  // 씬 재시도 — 이 씬의 hits + scene_started_at 만 제거, 그 외 진척은 유지.
  function handleRetry() {
    playClickSFX();
    const scenePartIds = new Set(scene.cat.parts.map((p) => p.part_id));
    const current = getProgress();
    const cleanedHits = current.hits.filter((h) => !scenePartIds.has(h.part_id));
    const cleanedStarted = { ...current.scene_started_at };
    delete cleanedStarted[scene.scene_id];
    const now = new Date();
    const nextProgress = {
      ...current,
      hits: cleanedHits,
      scene_started_at: { ...cleanedStarted, [scene.scene_id]: now.toISOString() },
    };
    setProgress(nextProgress);
    startedAtRef.current = nextProgress.scene_started_at[scene.scene_id]!;
    setFoundIds([]);
    setRecentHit(null);
    setHintedPartId(null);
    setHintsLeft(HINTS_PER_SCENE);
    setSecondsLeft(SCENE_DURATION_SECONDS);
    setTimeUp(false);
  }

  function handleHint() {
    if (hintsLeft <= 0) return;
    if (discovery.isComplete) return;
    if (!hasParts) return;
    const missing = scene.cat.parts.filter((p) => !foundIds.includes(p.part_id));
    if (missing.length === 0) return;
    const pick = missing[Math.floor(Math.random() * missing.length)];
    if (!pick) return;
    playClickSFX();
    setHintedPartId(pick.part_id);
    setHintsLeft(hintsLeft - 1);
  }

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

  function handleReset() {
    clearProgress();
    window.location.href = '/';
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
            <ImageWithSpinner
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
              const pulse =
                (recentHit?.id === part.part_id && recentHit.isNew) ||
                hintedPartId === part.part_id;
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

      {/* 상단 헤더 — 5-slot 발견 카운트 + 음소거 (타이머는 하단 가운데) */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-3 pt-3">
        <div className="pointer-events-auto">
          <DiscoveryHeader found={hydrated ? discovery.found : 0} total={scene.cat.parts.length} />
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          {isDev && (
            <button
              type="button"
              onClick={handleReset}
              aria-label="진척 리셋 (dev)"
              title="진척 리셋 (dev)"
              className="flex h-10 w-10 items-center justify-center rounded-full ink-line bg-[#FFFBF0] text-text backdrop-blur-sm"
            >
              <span className="text-base">↻</span>
            </button>
          )}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? '소리 켜기' : '소리 끄기'}
            className="flex h-10 w-10 items-center justify-center rounded-full ink-line bg-[#FFFBF0] text-text backdrop-blur-sm"
          >
            <span className="text-sm">{muted ? '🔇' : '🔊'}</span>
          </button>
        </div>
      </header>

      {/* RewardModal — 5/5 달성 + 미수령 + 사용자가 닫지 않은 상태에서만 등장 */}
      {discovery.isComplete && !alreadyClaimed && !rewardDismissed && (
        <RewardModal
          scene={scene}
          isFirstMeeting={isFirstMeeting}
          onDismiss={() => setRewardDismissed(true)}
        />
      )}

      {/* 시간 초과 오버레이 — 자동 노출 X, 재시도만 (CHEESE 2026-05-22 빡세게) */}
      {timeUp && !discovery.isComplete && (
        <TimeUpOverlay found={discovery.found} total={scene.cat.parts.length} onRetry={handleRetry} />
      )}

      {/* 하단 푸터 — 보금자리(좌) | 타이머(중앙) | 힌트·선물(우).
          가장자리 부위 가림 최소화하려 아이콘-only 44px 원형. */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 px-3 pb-4">
        <Link
          href="/home"
          aria-label="보금자리로 가기"
          title="보금자리"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full ink-line bg-[#FFFBF0]/90 text-text backdrop-blur-md"
        >
          <HomeIcon size={22} />
        </Link>

        {/* 중앙 타이머 */}
        <div className="pointer-events-auto">
          {timerActive && secondsLeft !== null && (
            <TimerPill seconds={secondsLeft} />
          )}
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {discovery.isComplete && !alreadyClaimed && rewardDismissed && (
            <button
              type="button"
              onClick={() => {
                playClickSFX();
                setRewardDismissed(false);
              }}
              className="rounded-full border-[2.5px] border-ink bg-cat px-5 py-2.5 text-cap font-extrabold text-[#FFFBF0]"
            >
              🎁 선물 받기
            </button>
          )}
          {hasParts && !discovery.isComplete && (
            <button
              type="button"
              onClick={handleHint}
              disabled={hintsLeft <= 0}
              aria-label={`힌트 (${hintsLeft}회 남음)`}
              title={`힌트 ${hintsLeft}/${HINTS_PER_SCENE}`}
              className="relative flex h-11 w-11 items-center justify-center rounded-full ink-line bg-honey text-text backdrop-blur-md disabled:opacity-50"
            >
              <SearchIcon size={22} />
              <span
                aria-hidden
                className="absolute -bottom-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full ink-line bg-cat-deep px-1 text-[10px] font-bold leading-none text-[#FFFBF0] tabular-nums"
              >
                {hintsLeft}
              </span>
            </button>
          )}
        </div>
      </footer>
    </main>
  );
}

// ─── TimeUpOverlay — 시간 초과 시 재시도 모달 ───────────────────────

function TimeUpOverlay({
  found,
  total,
  onRetry,
}: {
  found: number;
  total: number;
  onRetry: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm">
      <div className="ink-line w-full max-w-[300px] rounded-modal bg-[#FFFBF0] p-5 text-center animate-slide-up">
        <p className="font-sans text-3xl">⏱</p>
        <h2 className="mt-2 font-book text-h2 font-bold text-cat-deep">시간 초과</h2>
        <p className="mt-1 font-sans text-cap text-text-soft">
          치즈를 <span className="font-bold text-cat-deep">{found}/{total}</span> 찾았어요
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 h-12 w-full rounded-full border-[2.5px] border-ink bg-cat font-sans text-lg font-extrabold text-[#FFFBF0] active:bg-cat-deep"
        >
          🔄 재시도
        </button>
      </div>
    </div>
  );
}

// ─── TimerPill — 상단 타이머 ────────────────────────────────────────

function TimerPill({ seconds }: { seconds: number }) {
  const danger = seconds <= 10;
  return (
    <div
      className={`rounded-full ink-line px-3 py-1 font-sans text-cap font-bold tabular-nums ${
        danger ? 'bg-terra text-[#FFFBF0]' : 'bg-[#FFFBF0]/90 text-text'
      }`}
      role="timer"
      aria-live={danger ? 'assertive' : 'off'}
    >
      ⏱ {formatTime(seconds)}
    </div>
  );
}

// ─── DiscoveryHeader — pill + 5 slot dots ───────────────────────────

function DiscoveryHeader({ found, total }: { found: number; total: number }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full ink-line bg-[#FFFBF0]/90 px-3 py-1.5 backdrop-blur-md">
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
                  ? 'ink-line bg-cat'
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

function RewardModal({
  scene,
  isFirstMeeting,
  onDismiss,
}: {
  scene: Scene;
  isFirstMeeting: boolean;
  onDismiss: () => void;
}) {
  const router = useRouter();
  // 첫 만남(시즌 슬롯 0개)만 reveal부터, 재회는 pick으로 바로
  const [phase, setPhase] = useState<'reveal' | 'pick'>(
    isFirstMeeting ? 'reveal' : 'pick',
  );

  function handleChoose(option: FurnitureOption) {
    playPlaceSFX();
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
      <div className="relative w-full max-w-[320px] overflow-hidden rounded-modal ink-line bg-[#FFFBF0] p-5 animate-slide-up">
        <button
          type="button"
          onClick={() => {
            playClickSFX();
            onDismiss();
          }}
          aria-label="모달 닫기"
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full text-text-soft hover:bg-paper-soft"
        >
          <span className="text-lg leading-none">✕</span>
        </button>
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
      <p className="text-center font-sans text-lg font-bold text-cat-deep">
        오늘의 고양이를 만났어요
      </p>

      <div className="mx-auto mt-3 aspect-square w-40">
        <div className="relative h-full w-full overflow-hidden rounded-card ink-line bg-paper-soft">
          <ImageWithSpinner
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
        onClick={() => {
          playClickSFX();
          onAdvance();
        }}
        className="mt-4 h-14 w-full rounded-full border-[2.5px] border-ink bg-cat font-sans text-xl font-extrabold text-[#FFFBF0] transition-colors active:bg-cat-deep"
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
      <p className="text-center font-sans text-lg font-bold text-cat-deep">
        {scene.cat.name}가 준 선물
      </p>
      <p className="mt-1 text-center text-cap text-text-soft">하나를 고르세요</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {scene.cat.furniture_options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChoose(opt)}
            aria-label={opt.name}
            className="group flex flex-col items-center gap-1 rounded-card ink-line bg-paper-soft p-2 transition-colors active:bg-paper-deep"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-md">
              <ImageWithSpinner
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
