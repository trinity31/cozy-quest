import type { Scene, Season } from './game';
import type { UserProgress } from './storage';

/**
 * 오늘 날짜(YYYY-MM-DD, 로컬 기준)의 풍경을 반환.
 * 데이터 출처(JSON · API · DB)는 호출자가 주입 — shared 는 순수 로직만.
 *
 * @deprecated release_date === today 단순 매칭. 진척이 사라지거나 어제 안 한
 * 사용자에 대해 안전망이 없음. 신규 코드는 pickActiveScene 사용.
 */
export function getTodayScene(scenes: Scene[]): Scene | null {
  const today = new Date().toISOString().split('T')[0];
  return scenes.find((s) => s.release_date === today) ?? null;
}

/**
 * 사용자 진척 기반으로 "지금 플레이할 씬"을 반환.
 * release_date <= today 인 씬을 가장 이른 순서로 훑으면서, 그 시즌·카테고리
 * 슬롯이 home_slots에 아직 없는 첫 씬을 활성 씬으로 채택.
 *
 * - 진척이 어떤 이유로 사라져도 자동으로 다시 그 씬을 풀어줌
 * - 모두 클리어한 사용자에겐 가장 최근 풀린 씬을 다시 보여줌 (회상)
 */
export function pickActiveScene(
  scenes: Scene[],
  progress: UserProgress,
  todayIso: string,
): Scene | null {
  // release_date는 게이트(아직 풀리지 않은 미래 씬 차단), 순서는 day_in_season으로 결정.
  // 같은 시즌 안에서는 day_in_season이 진실 — release_date가 동일/뒤집혀도 시퀀스 보장.
  const candidates = scenes
    .filter((s) => s.release_date <= todayIso)
    .sort((a, b) => a.day_in_season - b.day_in_season);
  for (const s of candidates) {
    const slotted = progress.home_slots.some(
      (h) => h.season_id === s.season_id && h.category === s.furniture_category,
    );
    if (!slotted) return s;
  }
  return candidates[candidates.length - 1] ?? null;
}

export function getSeason(seasons: Season[], seasonId: string): Season | null {
  return seasons.find((s) => s.season_id === seasonId) ?? null;
}
