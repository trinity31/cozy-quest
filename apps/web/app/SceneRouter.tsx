'use client';

import { useEffect, useState } from 'react';
import { getProgress, pickActiveScene, type Scene } from '@cozy-quest/shared';
import { DiscoveryView } from './DiscoveryView';

/**
 * 클라이언트에서 home_slots 진척을 읽어 활성 씬을 결정한다.
 * - SSR 초기 페인트: candidates 중 가장 이른 씬 (진척 모름)
 * - 하이드레이션 후: pickActiveScene 결과로 교체
 * scene_id를 key로 줘서 씬이 바뀌면 DiscoveryView가 깨끗하게 리마운트되도록 함.
 */
export function SceneRouter({ candidates }: { candidates: Scene[] }) {
  const [active, setActive] = useState<Scene | null>(candidates[0] ?? null);

  useEffect(() => {
    if (candidates.length === 0) return;
    const today = new Date().toISOString().split('T')[0];
    setActive(pickActiveScene(candidates, getProgress(), today));
  }, [candidates]);

  if (!active) {
    return (
      <main className="flex flex-1 items-center justify-center p-6 text-center text-text-soft">
        <p>아직 풀린 풍경이 없어요</p>
      </main>
    );
  }

  return <DiscoveryView scene={active} key={active.scene_id} />;
}
