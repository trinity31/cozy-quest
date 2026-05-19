import type { CatPart } from './game';

/**
 * 정규화 좌표(0~1)가 part의 hit 영역에 들어왔는지 판정.
 * radius는 컨테이너 짧은변 기준 비율 (PRD 5.1 — 정사각 가정).
 */
export function isPartHit(part: CatPart, nx: number, ny: number): boolean {
  const dx = nx - part.x;
  const dy = ny - part.y;
  return dx * dx + dy * dy <= part.radius * part.radius;
}

/**
 * 탭 좌표(정규화)에 가장 먼저 매치되는 part 반환.
 * GAME_RULES B(부위간 거리 ≥ 대각선 20%) 덕분에 겹침은 없으나,
 * 안전을 위해 중심 거리 가장 가까운 것을 선택.
 */
export function findHitPart(parts: CatPart[], nx: number, ny: number): CatPart | null {
  let best: { part: CatPart; dist2: number } | null = null;
  for (const part of parts) {
    if (!isPartHit(part, nx, ny)) continue;
    const dx = nx - part.x;
    const dy = ny - part.y;
    const dist2 = dx * dx + dy * dy;
    if (!best || dist2 < best.dist2) best = { part, dist2 };
  }
  return best?.part ?? null;
}

export interface DiscoveryState {
  found: number;
  total: number;
  isComplete: boolean;
  remainingPartIds: string[];
}

export function getDiscoveryState(parts: CatPart[], foundPartIds: string[]): DiscoveryState {
  const foundSet = new Set(foundPartIds);
  const remaining = parts.filter((p) => !foundSet.has(p.part_id)).map((p) => p.part_id);
  const foundInScene = parts.length - remaining.length;
  return {
    found: foundInScene,
    total: parts.length,
    isComplete: foundInScene === parts.length && parts.length > 0,
    remainingPartIds: remaining,
  };
}
