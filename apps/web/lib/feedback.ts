'use client';

// 발견 피드백: 햅틱 + Web Audio 합성음. 시각 펄스는 컴포넌트에서.

const MUTED_KEY = 'cozy_quest_muted_v1';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch {
    ctx = null;
  }
  return ctx;
}

// ─── 음소거 상태 (sound + haptic 동시 토글) ─────────────────────

export function isMuted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(MUTED_KEY) === '1';
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (muted) window.localStorage.setItem(MUTED_KEY, '1');
    else window.localStorage.removeItem(MUTED_KEY);
  } catch {
    // ignore
  }
}

// ─── 햅틱 (진행도 비례 강화) ────────────────────────────────────

const VIBRATE_PATTERNS: ReadonlyArray<number | number[]> = [
  15,                            // 1번째 발견
  20,                            // 2번째
  25,                            // 3번째
  30,                            // 4번째
  [40, 60, 40, 60, 80],          // 5번째 (풀바디 해제 클라이맥스)
];

function vibrate(pattern: number | number[]): void {
  if (typeof navigator === 'undefined') return;
  const nav = navigator as Navigator & { vibrate?: (p: number | number[]) => boolean };
  if (typeof nav.vibrate !== 'function') return;
  try {
    nav.vibrate(pattern);
  } catch {
    // ignore
  }
}

// ─── Web Audio 합성 ────────────────────────────────────────────

interface ToneOpts {
  type?: OscillatorType;
  volume?: number;
}

function playTone(
  audioCtx: AudioContext,
  freq: number,
  duration: number,
  startOffset: number = 0,
  opts: ToneOpts = {},
): void {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = opts.type ?? 'sine';
  osc.frequency.value = freq;
  const start = audioCtx.currentTime + startOffset;
  const vol = opts.volume ?? 0.15;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(vol, start + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

// 펜타토닉 풍 발견음 (A-C-D-F-A)
const DISCOVERY_FREQS = [440, 523.25, 587.33, 698.46, 880];
// 클라이맥스 3음 상행 (C5-E5-G5)
const CLIMAX_FREQS = [523.25, 659.25, 783.99];

function playDiscoveryTone(discoveryIndex: number): void {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') void audioCtx.resume();

  const isClimax = discoveryIndex >= 4;
  if (isClimax) {
    const step = 0.13;
    CLIMAX_FREQS.forEach((f, i) => {
      playTone(audioCtx, f, 0.22, i * step, { volume: 0.18 });
    });
  } else {
    const f = DISCOVERY_FREQS[discoveryIndex] ?? 440;
    playTone(audioCtx, f, 0.2, 0, { volume: 0.15 });
  }
}

function playAlreadyFoundTone(): void {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  playTone(audioCtx, 220, 0.08, 0, { type: 'square', volume: 0.04 });
}

// ─── 공개 API ──────────────────────────────────────────────────

/**
 * 새 부위 발견 시. discoveryIndex = 0-based (방금 발견한 게 몇 번째인지).
 * 5/5 달성(index=4)이면 클라이맥스 패턴.
 */
export function feedbackDiscovery(discoveryIndex: number): void {
  if (isMuted()) return;
  const idx = Math.max(0, Math.min(discoveryIndex, VIBRATE_PATTERNS.length - 1));
  vibrate(VIBRATE_PATTERNS[idx]!);
  playDiscoveryTone(idx);
}

/**
 * 이미 발견한 부위를 다시 탭했을 때.
 */
export function feedbackAlreadyFound(): void {
  if (isMuted()) return;
  vibrate(5);
  playAlreadyFoundTone();
}

/**
 * 첫 user gesture에서 AudioContext 잠금 해제 (iOS Safari 대응).
 */
export function unlockAudio(): void {
  const audioCtx = getCtx();
  if (audioCtx && audioCtx.state === 'suspended') void audioCtx.resume();
}
