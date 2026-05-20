'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  FURNITURE_CATEGORIES,
  getProgress,
  getSeasonSlots,
  type FurnitureCategory,
  type FurnitureOption,
  type Season,
} from '@cozy-quest/shared';
import scenesData from '@/public/data/scenes.json';
import type { Scene } from '@cozy-quest/shared';

const CATEGORY_LABEL: Record<FurnitureCategory, string> = {
  lamp: '등불',
  chair: '의자',
  plant: '식물',
  rug: '러그',
  cushion: '쿠션',
  shelf: '선반',
  bed: '침대',
};

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

export function HomeView({ season }: { season: Season }) {
  const [chosen, setChosen] = useState<Partial<Record<FurnitureCategory, ChosenItem>>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const progress = getProgress();
    const slotsMap = getSeasonSlots(progress, season.season_id);
    setChosen(buildChosenMap(season, slotsMap));
    setHydrated(true);
  }, [season]);

  const filled = hydrated
    ? FURNITURE_CATEGORIES.filter((c) => chosen[c]).length
    : 0;
  const total = FURNITURE_CATEGORIES.length;

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

        {/* 7 카테고리 슬롯 — 정의된 좌표만 표시, 채움 여부에 따라 furniture or silhouette */}
        {FURNITURE_CATEGORIES.map((cat) => {
          const slot = season.slots[cat];
          if (!slot) return null;
          const item = chosen[cat];
          return (
            <div
              key={cat}
              aria-label={item ? item.option.name : `${CATEGORY_LABEL[cat]} 슬롯 (잠김)`}
              className="absolute"
              style={{
                left: `${(slot.x - slot.w / 2) * 100}%`,
                top: `${(slot.y - slot.h / 2) * 100}%`,
                width: `${slot.w * 100}%`,
                height: `${slot.h * 100}%`,
              }}
            >
              {item ? (
                <Image
                  src={item.option.image_url}
                  alt={item.option.name}
                  fill
                  sizes="160px"
                  className="object-contain drop-shadow-[0_3px_4px_rgba(92,65,40,0.25)]"
                />
              ) : (
                <SlotSilhouette label={CATEGORY_LABEL[cat]} />
              )}
            </div>
          );
        })}
      </div>

      {/* 상단 헤더 — 진척 게이지 + 시즌 타이틀 */}
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
        <Link
          href="/"
          className="pointer-events-auto flex h-10 items-center gap-1 rounded-full ink-line bg-[#FFFBF0] px-3 text-cap font-semibold text-text shadow-ink-1"
        >
          <span aria-hidden>←</span> 풍경
        </Link>
      </header>
    </main>
  );
}

function SlotSilhouette({ label }: { label: string }) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-ink/30 bg-ink/15" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mark text-2xl font-bold text-ink/50">?</span>
      </div>
      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-ink/40 px-2 py-0.5 text-[10px] font-semibold text-[#FFFBF0]">
        {label}
      </span>
    </div>
  );
}
