'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FURNITURE_CATEGORIES,
  clearProgress,
  getProgress,
  getSeasonSlots,
  pickActiveScene,
  type FurnitureCategory,
  type FurnitureOption,
  type Season,
} from '@cozy-quest/shared';
import scenesData from '@/public/data/scenes.json';
import type { Scene } from '@cozy-quest/shared';

interface ChosenItem {
  category: FurnitureCategory;
  option: FurnitureOption;
}

/**
 * 사용자가 박은 furniture_id를 scenes.json의 furniture_options에서 찾아
 * 이름·이미지 url을 복원한다. (scenes 파일은 카테고리/카탈로그 마스터 역할도 겸함.)
 */
function buildChosenMap(
  season: Season,
  slotsByCategory: ReturnType<typeof getSeasonSlots>,
): Partial<Record<FurnitureCategory, ChosenItem>> {
  const all = scenesData.scenes as Scene[];
  const seasonScenes = all.filter((s) => s.season_id === season.season_id);
  const result: Partial<Record<FurnitureCategory, ChosenItem>> = {};

  for (const cat of FURNITURE_CATEGORIES) {
    const slot = slotsByCategory[cat];
    if (!slot) continue;
    const scene = seasonScenes.find((s) => s.furniture_category === cat);
    const option = scene?.cat.furniture_options.find((o) => o.id === slot.furniture_id);
    if (option) result[cat] = { category: cat, option };
  }
  return result;
}

const isDev = process.env.NODE_ENV === 'development';

export function HomeView({ season }: { season: Season }) {
  const router = useRouter();
  const [chosen, setChosen] = useState<Partial<Record<FurnitureCategory, ChosenItem>>>({});
  const [nextScene, setNextScene] = useState<Scene | null>(null);
  const [allCleared, setAllCleared] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const progress = getProgress();
    const slotsMap = getSeasonSlots(progress, season.season_id);
    setChosen(buildChosenMap(season, slotsMap));

    // 다음 진척 풍경 계산 (이 시즌 안에서 미클리어 + release 도래한 가장 이른 씬)
    const today = new Date().toISOString().split('T')[0];
    const seasonScenes = (scenesData.scenes as Scene[]).filter(
      (s) => s.season_id === season.season_id,
    );
    const active = pickActiveScene(seasonScenes, progress, today);
    if (active) {
      const slotted = progress.home_slots.some(
        (h) => h.season_id === active.season_id && h.category === active.furniture_category,
      );
      // 미클리어인 활성 씬이면 next, 모두 클리어 상태면 null
      setNextScene(slotted ? null : active);
      setAllCleared(slotted);
    }
    setHydrated(true);
  }, [season]);

  const filled = hydrated
    ? FURNITURE_CATEGORIES.filter((c) => chosen[c]).length
    : 0;
  const total = FURNITURE_CATEGORIES.length;

  function handleReset() {
    clearProgress();
    router.push('/');
  }

  return (
    <main className="relative flex-1 overflow-hidden bg-paper">
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[480px]">
        <Image
          src={season.room_image_url}
          alt={`${season.title} 보금자리`}
          fill
          priority
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />

        {/* 발견한 카테고리만 합성. 미발견은 표시 X (사용자 결정) */}
        {FURNITURE_CATEGORIES.map((cat) => {
          const slot = season.slots[cat];
          if (!slot) return null;
          const item = chosen[cat];
          if (!item) return null;
          return (
            <div
              key={cat}
              aria-label={item.option.name}
              className="absolute"
              style={{
                left: `${(slot.x - slot.w / 2) * 100}%`,
                top: `${(slot.y - slot.h / 2) * 100}%`,
                width: `${slot.w * 100}%`,
                height: `${slot.h * 100}%`,
              }}
            >
              <Image
                src={item.option.image_url}
                alt={item.option.name}
                fill
                sizes="160px"
                className="object-contain drop-shadow-[0_3px_4px_rgba(92,65,40,0.25)]"
              />
            </div>
          );
        })}
      </div>

      {/* 상단 헤더 — 진척 게이지 + 보조 풍경 링크 + dev 리셋 */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-3 pt-3">
        <div className="pointer-events-auto rounded-card ink-line bg-[#FFFBF0]/95 px-3 py-2 shadow-ink-1 backdrop-blur-md">
          <p className="font-mark text-base text-cat-deep" style={{ transform: 'rotate(-1.5deg)' }}>
            {season.title}
          </p>
          <p className="mt-0.5 text-cap text-text-soft tabular-nums">
            <span className="font-bold text-cat-deep">{filled}</span>
            <span className="text-text-faint">/{total} 완성</span>
          </p>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          {isDev && (
            <button
              type="button"
              onClick={handleReset}
              aria-label="진척 리셋 (dev)"
              title="진척 리셋 (dev)"
              className="flex h-10 w-10 items-center justify-center rounded-full ink-line bg-[#FFFBF0] text-text shadow-ink-1"
            >
              <span className="text-base">↻</span>
            </button>
          )}
          <Link
            href="/"
            className="flex h-10 items-center gap-1 rounded-full ink-line bg-[#FFFBF0] px-3 text-cap font-semibold text-text shadow-ink-1"
          >
            <span aria-hidden>←</span> 풍경
          </Link>
        </div>
      </header>

      {/* 하단 CTA — 다음 풍경 진척 또는 시즌 완료 표시 */}
      {hydrated && (nextScene || allCleared) && (
        <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-5">
          {nextScene ? (
            <Link
              href="/"
              className="pointer-events-auto rounded-full ink-line bg-cat px-6 py-3 font-semibold text-[#FFFBF0] shadow-cat-1"
            >
              다음: {nextScene.title}
            </Link>
          ) : (
            <span className="pointer-events-auto rounded-full ink-line bg-[#FFFBF0] px-5 py-2.5 text-cap font-semibold text-text-soft shadow-ink-1">
              오늘의 진척 완료 ✓
            </span>
          )}
        </footer>
      )}
    </main>
  );
}
