// PRD 5.3 — localStorage 스키마 + 헬퍼

import type { CatPart, FurnitureCategory } from './game';

export interface HitRecord {
  part_id: string;
  found_at: string;          // ISO timestamp
  seconds_to_find: number;
}

/**
 * 한 시즌의 카테고리 슬롯 1개. 7 카테고리 × N 시즌으로 누적.
 * GAME_RULES K.5 (v1.6).
 */
export interface HomeSlot {
  season_id: string;
  category: FurnitureCategory;
  cat_id: string;
  furniture_id: string;
  chosen_at: string;
}

export interface UserProgress {
  hits: HitRecord[];
  home_slots: HomeSlot[];
  scene_started_at: { [scene_id: string]: string };  // 발견 시간 측정용
}

const KEY = 'cozy_quest_progress_v1';

const EMPTY: UserProgress = {
  hits: [],
  home_slots: [],
  scene_started_at: {},
};

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getProgress(): UserProgress {
  if (!isBrowser()) return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      hits: parsed.hits ?? [],
      home_slots: parsed.home_slots ?? [],
      scene_started_at: parsed.scene_started_at ?? {},
    };
  } catch {
    // 손상된 데이터는 초기화
    return { ...EMPTY };
  }
}

export function setProgress(next: UserProgress): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearProgress(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(KEY);
}

// ─── 게임 로직 헬퍼 (pure) ─────────────────────────────────────────

/**
 * 해당 풍경의 첫 방문 시각을 보장. 이미 있으면 그대로, 없으면 now 기록.
 * 반환: 갱신된 progress + 그 시점의 시작 시각(ISO).
 */
export function getOrCreateSceneStart(
  progress: UserProgress,
  sceneId: string,
  now: Date,
): { progress: UserProgress; startedAt: string } {
  const existing = progress.scene_started_at[sceneId];
  if (existing) return { progress, startedAt: existing };
  const startedAt = now.toISOString();
  return {
    progress: {
      ...progress,
      scene_started_at: { ...progress.scene_started_at, [sceneId]: startedAt },
    },
    startedAt,
  };
}

/**
 * 발견 기록 추가. 같은 part_id가 이미 있으면 변경 없이 반환.
 */
export function addHit(
  progress: UserProgress,
  partId: string,
  sceneStartedAtIso: string,
  now: Date,
): UserProgress {
  if (progress.hits.some((h) => h.part_id === partId)) return progress;
  const startedMs = new Date(sceneStartedAtIso).getTime();
  const seconds = Math.max(0, Math.round((now.getTime() - startedMs) / 1000));
  const hit: HitRecord = {
    part_id: partId,
    found_at: now.toISOString(),
    seconds_to_find: seconds,
  };
  return { ...progress, hits: [...progress.hits, hit] };
}

/**
 * 현재 풍경에 속한 발견 part_id 목록.
 */
export function getFoundPartIds(progress: UserProgress, sceneParts: CatPart[]): string[] {
  const sceneIds = new Set(sceneParts.map((p) => p.part_id));
  return progress.hits.filter((h) => sceneIds.has(h.part_id)).map((h) => h.part_id);
}

/**
 * 시즌·카테고리 슬롯에 가구 박기. 같은 (season_id, category) 슬롯이 이미 있으면
 * 새 furniture로 덮어쓴다 (사용자가 재선택할 수 있는 정책).
 */
export function addHomeSlot(
  progress: UserProgress,
  slot: { season_id: string; category: FurnitureCategory; cat_id: string; furniture_id: string },
  now: Date,
): UserProgress {
  const next: HomeSlot = { ...slot, chosen_at: now.toISOString() };
  const filtered = progress.home_slots.filter(
    (s) => !(s.season_id === slot.season_id && s.category === slot.category),
  );
  return { ...progress, home_slots: [...filtered, next] };
}

/**
 * 한 시즌의 카테고리별 슬롯 맵. 빈 슬롯은 undefined.
 */
export function getSeasonSlots(
  progress: UserProgress,
  seasonId: string,
): Partial<Record<FurnitureCategory, HomeSlot>> {
  const map: Partial<Record<FurnitureCategory, HomeSlot>> = {};
  for (const s of progress.home_slots) {
    if (s.season_id === seasonId) map[s.category] = s;
  }
  return map;
}
