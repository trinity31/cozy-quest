// PRD 5.3 — localStorage 스키마 + 헬퍼

export interface HitRecord {
  part_id: string;
  found_at: string;          // ISO timestamp
  seconds_to_find: number;
}

export interface HomeSlot {
  slot_index: number;        // 0~4
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
