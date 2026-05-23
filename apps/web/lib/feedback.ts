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
  // BGM도 같이 토글 — mute = pause, unmute = resume (이미 재생 중이었으면)
  if (bgmAudio) {
    if (muted) {
      bgmAudio.pause();
    } else {
      bgmAudio.play().catch(() => {
        // 사용자 인터랙션 전이면 autoplay 거부됨 — 무시
      });
    }
  }
}

// ─── BGM (시즌별 loopable instrumental) ──────────────────────────

let bgmAudio: HTMLAudioElement | null = null;
let bgmFadeTimer: number | null = null;

function clearBgmFade(): void {
  if (bgmFadeTimer !== null) {
    window.clearInterval(bgmFadeTimer);
    bgmFadeTimer = null;
  }
}

/**
 * BGM 페이드인 재생. 같은 URL이 이미 재생 중이면 no-op.
 * 모바일 audio 정책상 첫 사용자 인터랙션 이후에만 실제 재생됨.
 */
export function playBGM(url: string, targetVolume = 0.3, fadeMs = 1500): void {
  if (typeof window === 'undefined') return;
  if (isMuted()) return;

  // 같은 URL + 재생 중이면 그대로
  if (bgmAudio && bgmAudio.src.endsWith(url) && !bgmAudio.paused) return;

  // URL 바뀌면 기존 인스턴스 정리
  if (bgmAudio && !bgmAudio.src.endsWith(url)) {
    bgmAudio.pause();
    bgmAudio = null;
  }
  if (!bgmAudio) {
    bgmAudio = new Audio(url);
    bgmAudio.loop = true;
    bgmAudio.volume = 0;
  }

  const audio = bgmAudio;
  audio.play().catch(() => {
    // autoplay 정책 거부 — 첫 user gesture 후 다시 호출하면 됨
  });

  clearBgmFade();
  const step = 50;
  const increment = targetVolume / Math.max(1, fadeMs / step);
  bgmFadeTimer = window.setInterval(() => {
    if (!bgmAudio) {
      clearBgmFade();
      return;
    }
    const next = Math.min(targetVolume, bgmAudio.volume + increment);
    bgmAudio.volume = next;
    if (next >= targetVolume) clearBgmFade();
  }, step);
}

/**
 * BGM 페이드아웃 후 정지. 시즌 종료 또는 라우트 이탈 시 호출.
 */
export function stopBGM(fadeMs = 500): void {
  if (!bgmAudio) return;
  const audio = bgmAudio;
  clearBgmFade();
  const startVol = audio.volume;
  const step = 50;
  const decrement = startVol / Math.max(1, fadeMs / step);
  bgmFadeTimer = window.setInterval(() => {
    const next = Math.max(0, audio.volume - decrement);
    audio.volume = next;
    if (next <= 0) {
      audio.pause();
      audio.currentTime = 0;
      clearBgmFade();
    }
  }, step);
}

// ─── SFX 파일 재생 (가구 배치·UI 클릭) ──────────────────────────

const SFX_VOLUME = 0.5;
const sfxCache = new Map<string, HTMLAudioElement>();

function playSFXFile(url: string): void {
  if (typeof window === 'undefined') return;
  if (isMuted()) return;
  let audio = sfxCache.get(url);
  if (!audio) {
    audio = new Audio(url);
    audio.preload = 'auto';
    audio.volume = SFX_VOLUME;
    sfxCache.set(url, audio);
  }
  // 연타 시 처음부터 다시
  audio.currentTime = 0;
  audio.play().catch(() => {
    // 첫 user gesture 전 autoplay 거부 — 무시
  });
}

/** 가구 배치 SFX — 빈 방 슬롯에 가구 박힐 때 */
export function playPlaceSFX(): void {
  playSFXFile('/audio/sfx_place.mp3');
}

/** UI 클릭 SFX — 버튼·카드 선택 */
export function playClickSFX(): void {
  playSFXFile('/audio/sfx_click.mp3');
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
