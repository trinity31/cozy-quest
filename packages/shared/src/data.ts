import type { Scene, Season } from './game';

/**
 * 오늘 날짜(YYYY-MM-DD, 로컬 기준)의 풍경을 반환.
 * 데이터 출처(JSON · API · DB)는 호출자가 주입 — shared 는 순수 로직만.
 */
export function getTodayScene(scenes: Scene[]): Scene | null {
  const today = new Date().toISOString().split('T')[0];
  return scenes.find((s) => s.release_date === today) ?? null;
}

export function getSeason(seasons: Season[], seasonId: string): Season | null {
  return seasons.find((s) => s.season_id === seasonId) ?? null;
}
