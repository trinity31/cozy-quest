'use client';

import { useEffect, useState } from 'react';
import { IntroView } from './IntroView';
import { unlockAudio } from '@/lib/feedback';

/**
 * 인트로 게이트 — sessionStorage 기반 분기.
 * - 새 탭/새 세션: 인트로 → [시작하기] → children
 * - 같은 세션 내 풍경↔보금자리 이동: 인트로 스킵, 바로 children
 * - SSR mismatch 회피: 첫 paint = null (1프레임), useEffect 후 결정
 *
 * SEASON1_CHEESE §9 [2] Title/Intro + "BGM은 사용자 인터랙션 트리거 후 재생" (모바일 정책).
 * [시작하기] 탭이 audio unlock 트리거.
 */

const SESSION_KEY = 'intro_started_v1';

export function IntroGate({ children }: { children: React.ReactNode }) {
  const [introDone, setIntroDone] = useState<boolean | null>(null);

  useEffect(() => {
    let done = false;
    try {
      done = window.sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      // sessionStorage 차단 환경 — 인트로 안 봤다고 가정
    }
    setIntroDone(done);
  }, []);

  function handleStart() {
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // 무시 (메모리 폴백)
    }
    unlockAudio();
    setIntroDone(true);
  }

  if (introDone === null) return null;
  if (!introDone) return <IntroView onStart={handleStart} />;
  return <>{children}</>;
}
