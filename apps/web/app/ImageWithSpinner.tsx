'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

/**
 * next/image 위에 로딩 스피너 오버레이.
 * 부모는 position(absolute/relative) + 크기 보유 필수 (`fill` 모드 사용 시).
 * onLoad / onError 발생 시 spinner를 fade-out 하고 이미지가 fade-in 한다.
 */
export function ImageWithSpinner(props: ImageProps) {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Image
        {...props}
        onLoad={(e) => {
          setReady(true);
          props.onLoad?.(e);
        }}
        onError={(e) => {
          // 에러 시에도 스피너는 치움 — 무한 회전 방지
          setReady(true);
          props.onError?.(e);
        }}
        className={`${props.className ?? ''} transition-opacity duration-300 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {!ready && <ImageSpinner />}
    </>
  );
}

function ImageSpinner() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-paper-soft"
      role="status"
      aria-label="이미지 불러오는 중"
    >
      <div className="flex gap-1.5">
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-cat"
          style={{ animationDelay: '0ms', animationDuration: '900ms' }}
        />
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-cat"
          style={{ animationDelay: '150ms', animationDuration: '900ms' }}
        />
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-cat"
          style={{ animationDelay: '300ms', animationDuration: '900ms' }}
        />
      </div>
    </div>
  );
}
