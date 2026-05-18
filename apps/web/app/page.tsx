import Image from 'next/image';
import { getTodayScene, type Scene } from '@cozy-quest/shared';
import scenesData from '@/public/data/scenes.json';

export default function HomePage() {
  const scene = getTodayScene(scenesData.scenes as Scene[]);

  if (!scene) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 text-center">
        <div>
          <p className="text-lg text-white/80">오늘의 풍경 준비 중</p>
          <p className="mt-2 text-sm text-white/40">매일 새로운 풍경이 열려요</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex-1 overflow-hidden bg-black">
      {/* 풍경 — 9:16 컨테이너를 가득 채움 */}
      <Image
        src={scene.image_url}
        alt={scene.title}
        fill
        priority
        sizes="(max-width: 480px) 100vw, 480px"
        className="object-cover"
      />

      {/* 상단 헤더 — Day 2에 발견 카운트 실연동 */}
      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 pb-6 pt-3">
        <h1 className="text-sm font-medium text-white/90">{scene.title}</h1>
        <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
          0/5 발견
        </span>
      </header>

      {/* 하단 푸터 — Day 3에 보금자리 라우팅 구현 */}
      <footer className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/60 to-transparent px-4 pb-6 pt-8">
        <button
          type="button"
          disabled
          aria-disabled
          className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white/40 backdrop-blur-sm"
        >
          🏠 보금자리
        </button>
      </footer>
    </main>
  );
}
