'use client';

import { useEffect, useState } from 'react';
import { SplashView } from './SplashView';

/**
 * Splash 게이트 — 자산 preload + 최소 표시 시간 동안 SplashView, 끝나면 children.
 * SEASON1_CHEESE §9 [1] Splash/Loading 화면.
 *
 * - 같은 세션 내 재진입(라우트 이동 등)은 sessionStorage 플래그로 스킵.
 * - SSR에선 항상 SplashView 렌더 → 첫 페인트가 비지 않음.
 * - preloadImages 실패(404 등)는 무시하고 진행 — 스플래시가 사용자를 가두면 안 됨.
 */

const SESSION_KEY = 'splash_done_v1';
const MIN_DISPLAY_MS = 900;

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function SplashGate({
  preloadImages = [],
  children,
}: {
  preloadImages?: string[];
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alreadyDone = false;
    try {
      alreadyDone = window.sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      // sessionStorage 차단 환경 — 매번 보여줘도 무방
    }
    if (alreadyDone) {
      setReady(true);
      return;
    }

    let cancelled = false;
    const minDelay = new Promise<void>((resolve) =>
      window.setTimeout(resolve, MIN_DISPLAY_MS),
    );
    const loads = Promise.all(preloadImages.map(preloadImage));

    Promise.all([loads, minDelay]).then(() => {
      if (cancelled) return;
      try {
        window.sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // 무시
      }
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [preloadImages]);

  if (!ready) return <SplashView />;
  return <>{children}</>;
}
