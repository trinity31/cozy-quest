'use client';

import { useState } from 'react';
import { type Scene } from '@cozy-quest/shared';
import { DaySelection } from './DaySelection';
import { DiscoveryView } from './DiscoveryView';

/**
 * 기획서 §3 흐름: Day Selection → Scene (DiscoveryView) → 가구 모달 → Interior(/home).
 * 기본은 Day Selection. 사용자가 Day 카드 탭 → 해당 씬 DiscoveryView로 전환.
 *
 * initialActive: HomeView의 [다음 풍경] CTA에서 ?play=<scene_id>로 들어오면
 *   Day Selection 우회하고 바로 그 씬으로 진입한다.
 */
export function SceneRouter({
  allScenes,
  initialActive,
}: {
  allScenes: Scene[];
  initialActive?: Scene | null;
}) {
  const [active, setActive] = useState<Scene | null>(initialActive ?? null);

  if (active) {
    return <DiscoveryView scene={active} key={active.scene_id} />;
  }

  return <DaySelection scenes={allScenes} onPick={setActive} />;
}
