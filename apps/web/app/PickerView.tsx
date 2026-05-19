'use client';

import Image from 'next/image';
import { useState, type MouseEvent } from 'react';
import type { Scene } from '@cozy-quest/shared';

interface Pick {
  x: number;
  y: number;
}

const DEFAULT_RADIUS = 0.06;

export function PickerView({ scene }: { scene: Scene }) {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [lastPick, setLastPick] = useState<Pick | null>(null);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);

  function flashCopy(msg: string) {
    setCopyMsg(msg);
    window.setTimeout(() => setCopyMsg(null), 1200);
  }

  function copyToClipboard(text: string, successMsg: string) {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      flashCopy('clipboard 미지원');
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => flashCopy(successMsg),
      () => flashCopy('복사 실패'),
    );
  }

  function handleSurfaceClick(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const pick: Pick = {
      x: Number(x.toFixed(3)),
      y: Number(y.toFixed(3)),
    };
    setPicks((prev) => [...prev, pick]);
    setLastPick(pick);
    const single = `{ "x": ${pick.x}, "y": ${pick.y}, "radius": ${DEFAULT_RADIUS} }`;
    copyToClipboard(single, '복사됨');
    // eslint-disable-next-line no-console
    console.log('[picker]', pick, single);
  }

  function handleReset() {
    setPicks([]);
    setLastPick(null);
  }

  function handleCopyAll() {
    const items = picks
      .map(
        (p, i) =>
          `    { "part_id": "p_${String(i + 1).padStart(2, '0')}", "type": "TODO", "x": ${p.x}, "y": ${p.y}, "radius": ${DEFAULT_RADIUS} }`,
      )
      .join(',\n');
    const text = `"parts": [\n${items}\n  ]`;
    copyToClipboard(text, `${picks.length}개 복사됨`);
  }

  return (
    <main className="relative flex-1 overflow-hidden bg-black">
      <div
        onClick={handleSurfaceClick}
        className="relative aspect-[9/16] w-full cursor-crosshair select-none"
      >
        <Image
          src={scene.image_url}
          alt={scene.title}
          fill
          priority
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
          draggable={false}
        />

        {/* 누적된 pick 마커 */}
        {picks.map((p, i) => (
          <span
            key={`${i}-${p.x}-${p.y}`}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/90 px-1.5 py-0.5 text-[10px] font-bold text-black ring-2 ring-amber-300/40"
            style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
          >
            {i + 1}
          </span>
        ))}

        {/* 기본 radius 미리보기 (마지막 pick만) */}
        {lastPick && (
          <span
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/60"
            style={{
              left: `${lastPick.x * 100}%`,
              top: `${lastPick.y * 100}%`,
              width: `${DEFAULT_RADIUS * 200}%`,
              height: `${DEFAULT_RADIUS * 200}%`,
            }}
          />
        )}
      </div>

      {/* 상단 패널 */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/75 to-transparent px-4 pb-6 pt-3">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-medium text-white/90">
            좌표 picker — {scene.title}
          </h1>
          <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-bold text-black">
            PICKER
          </span>
        </div>
        {lastPick ? (
          <p className="mt-2 text-xs text-white/80 tabular-nums">
            마지막:{' '}
            <code className="rounded bg-black/40 px-1.5 py-0.5">{`{ x: ${lastPick.x}, y: ${lastPick.y} }`}</code>
            {copyMsg && (
              <span className="ml-2 text-amber-300">{copyMsg}</span>
            )}
          </p>
        ) : (
          <p className="mt-2 text-[11px] text-white/60">
            풍경을 탭하면 정규화 좌표가 클립보드에 복사됩니다 (radius = {DEFAULT_RADIUS}).
          </p>
        )}
      </header>

      {/* 하단 액션 */}
      <footer className="absolute inset-x-0 bottom-0 z-10 flex justify-center gap-2 bg-gradient-to-t from-black/75 to-transparent px-4 pb-6 pt-8">
        <button
          type="button"
          onClick={handleCopyAll}
          disabled={picks.length === 0}
          className="pointer-events-auto rounded-full bg-white/15 px-4 py-2 text-xs font-medium text-white disabled:text-white/30"
        >
          parts JSON 전체 복사 ({picks.length})
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={picks.length === 0}
          className="pointer-events-auto rounded-full bg-white/10 px-4 py-2 text-xs text-white/80 disabled:text-white/30"
        >
          초기화
        </button>
      </footer>
    </main>
  );
}
