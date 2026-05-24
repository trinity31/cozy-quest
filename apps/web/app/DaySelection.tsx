'use client';

import { useEffect, useState } from 'react';
import {
  getProgress,
  getSeasonSlots,
  type FurnitureCategory,
  type Scene,
} from '@cozy-quest/shared';
import { playClickSFX } from '@/lib/feedback';
import { ImageWithSpinner } from './ImageWithSpinner';

/**
 * Day Selection — 기획서 §5 [4].
 * 시즌 1 진척 게이지(X/7) + 1~7일 해금 상태 카드.
 *
 * 잠금 로직:
 * - completed: home_slots에 (season_id, day의 furniture_category) 슬롯이 이미 있음
 * - available: 직전 day가 completed (Day 1은 항상)
 *   AND release_date <= today (현실 자산 있음)
 * - sequentialLocked: release_date <= today 인데 직전 day 미완료
 * - comingSoon: release_date > today (자산 미공급)
 */

const CATEGORY_LABEL: Record<FurnitureCategory, string> = {
  lamp: '🪔 등불',
  chair: '🪑 의자',
  plant: '🪴 식물',
  rug: '🧺 러그',
  cushion: '🛋 쿠션',
  shelf: '📚 선반',
  bed: '🛏 침대',
};

type CardStatus = 'completed' | 'available' | 'sequentialLocked' | 'comingSoon';

interface DayCard {
  scene: Scene;
  status: CardStatus;
}

function statusFor(
  scene: Scene,
  prevCompleted: boolean,
  completedCategories: Set<FurnitureCategory>,
  todayIso: string,
): CardStatus {
  if (completedCategories.has(scene.furniture_category)) return 'completed';
  if (scene.release_date > todayIso) return 'comingSoon';
  if (!prevCompleted) return 'sequentialLocked';
  return 'available';
}

export function DaySelection({
  scenes,
  onPick,
}: {
  scenes: Scene[];
  onPick: (scene: Scene) => void;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [completed, setCompleted] = useState<Set<FurnitureCategory>>(new Set());

  useEffect(() => {
    setHydrated(true);
    const seasonId = scenes[0]?.season_id;
    if (!seasonId) return;
    const slots = getSeasonSlots(getProgress(), seasonId);
    setCompleted(new Set(Object.keys(slots) as FurnitureCategory[]));
  }, [scenes]);

  const sorted = [...scenes].sort((a, b) => a.day_in_season - b.day_in_season);
  const todayIso = new Date().toISOString().split('T')[0];

  const cards: DayCard[] = [];
  let prevCompleted = true; // Day 1 은 직전 없음 → 항상 unlock
  for (const scene of sorted) {
    const status = hydrated
      ? statusFor(scene, prevCompleted, completed, todayIso)
      : (scene.release_date > todayIso ? 'comingSoon' : 'sequentialLocked');
    cards.push({ scene, status });
    prevCompleted = completed.has(scene.furniture_category);
  }

  const filled = completed.size;
  const total = sorted.length;

  return (
    <main className="relative flex-1 overflow-y-auto bg-paper-soft px-5 pt-6 pb-8">
      <header className="mb-5 text-center">
        <p className="font-sans text-cap text-text-soft">Season 1 · 치즈의 일주일</p>
        <h1 className="mt-1 font-book text-3xl font-bold text-cat-deep">
          오늘은 어디로?
        </h1>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full ink-line bg-paper px-4 py-1.5 font-sans text-cap font-bold text-text">
          <span className="text-cat-deep">{filled}</span>
          <span className="text-text-faint">/ {total} 완성</span>
        </div>
      </header>

      <ul className="flex flex-col gap-2.5" role="list">
        {cards.map(({ scene, status }) => (
          <li key={scene.scene_id}>
            <DayCardItem
              scene={scene}
              status={status}
              onPick={() => {
                playClickSFX();
                onPick(scene);
              }}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}

function DayCardItem({
  scene,
  status,
  onPick,
}: {
  scene: Scene;
  status: CardStatus;
  onPick: () => void;
}) {
  const day = scene.day_in_season;
  const label = CATEGORY_LABEL[scene.furniture_category];
  const isClickable = status === 'available' || status === 'completed';
  const hasArt = status !== 'comingSoon' && status !== 'sequentialLocked';

  const stateBadge =
    status === 'completed' ? (
      <span className="rounded-full bg-cat px-2.5 py-0.5 text-cap font-bold text-[#FFFBF0]">
        ✓ 완성
      </span>
    ) : status === 'available' ? (
      <span className="rounded-full ink-line bg-cat-soft px-2.5 py-0.5 text-cap font-bold text-cat-deep">
        ▶ 시작
      </span>
    ) : status === 'sequentialLocked' ? (
      <span className="rounded-full bg-text-faint/20 px-2.5 py-0.5 text-cap font-semibold text-text-faint">
        🔒 잠금
      </span>
    ) : (
      <span className="rounded-full bg-text-faint/20 px-2.5 py-0.5 text-cap font-semibold text-text-faint">
        Coming Soon
      </span>
    );

  const dim = status === 'sequentialLocked' || status === 'comingSoon';

  return (
    <button
      type="button"
      onClick={isClickable ? onPick : undefined}
      disabled={!isClickable}
      aria-disabled={!isClickable}
      className={`flex w-full items-center gap-3 rounded-card ink-line px-3 py-2.5 text-left transition-colors ${
        isClickable ? 'bg-[#FFFBF0] active:bg-paper-soft' : 'bg-paper'
      } ${dim ? 'opacity-60' : ''}`}
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md ink-line-faint bg-paper-soft">
        {hasArt ? (
          <ImageWithSpinner
            src={scene.image_url}
            alt={scene.title}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-2xl text-text-faint">
            {status === 'comingSoon' ? '✨' : '🔒'}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-sans text-cap font-bold text-text-faint">Day {day}</span>
          <span className="font-sans text-body font-bold text-text">·</span>
          <span className="truncate font-sans text-body font-bold text-text">
            {scene.title}
          </span>
        </div>
        <p className="mt-0.5 font-sans text-cap text-text-soft">{label}</p>
      </div>
      <div className="shrink-0">{stateBadge}</div>
    </button>
  );
}
