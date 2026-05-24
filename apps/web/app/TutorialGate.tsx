'use client';

import { useEffect, useState } from 'react';
import { TutorialOverlay } from './TutorialOverlay';

/**
 * Tutorial 게이트 — 기획서 §5 [3]. localStorage 플래그로 영구 1회.
 * IntroGate가 [시작하기]를 처리한 이후, Day Selection 진입 전에 끼어든다.
 * SSR/하이드레이션 첫 페인트는 children — 튜토리얼이 깜빡이지 않도록.
 */
const LOCAL_KEY = 'tutorial_seen_v1';

export function TutorialGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'pending' | 'show' | 'done'>('pending');

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(LOCAL_KEY) === '1';
    } catch {
      // localStorage 차단 환경 — 매번 보여줘도 무방
    }
    setPhase(seen ? 'done' : 'show');
  }, []);

  function finish() {
    try {
      window.localStorage.setItem(LOCAL_KEY, '1');
    } catch {
      // 무시
    }
    setPhase('done');
  }

  // pending(첫 paint) 단계에선 children 그대로 — hydration mismatch 없도록.
  // show가 결정되면 overlay로 가린다.
  if (phase === 'show') return <TutorialOverlay onFinish={finish} />;
  return <>{children}</>;
}
