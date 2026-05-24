import { type Scene, type Season } from '@cozy-quest/shared';
import scenesData from '@/public/data/scenes.json';
import seasonsData from '@/public/data/seasons.json';
import { IntroGate } from './IntroGate';
import { PickerView } from './PickerView';
import { SceneRouter } from './SceneRouter';
import { SplashGate } from './SplashGate';
import { TutorialGate } from './TutorialGate';

interface HomePageProps {
  searchParams: { picker?: string; play?: string; scene?: string };
}

export default function HomePage({ searchParams }: HomePageProps) {
  // 전 씬을 day_in_season 순으로 정렬해 클라이언트에 넘긴다.
  // 잠금 상태(comingSoon / sequentialLocked) 판정은 Day Selection이 처리.
  const allScenes = (scenesData.scenes as Scene[])
    .slice()
    .sort((a, b) => a.day_in_season - b.day_in_season);

  if (allScenes.length === 0) {
    return <EmptyState />;
  }

  // picker는 dev/디버그 도구. ?scene=<scene_id>로 특정 씬 지정 가능, 없으면 가장 최근 활성 씬.
  if (searchParams.picker === '1') {
    if (searchParams.scene) {
      const targetScene = allScenes.find((s) => s.scene_id === searchParams.scene);
      if (targetScene) return <PickerView scene={targetScene} />;
    }
    const today = new Date().toISOString().split('T')[0];
    const released = allScenes.filter((s) => s.release_date <= today);
    return <PickerView scene={released[released.length - 1] ?? allScenes[0]!} />;
  }

  const seasonId = allScenes[0]!.season_id;
  const season = (seasonsData.seasons as Season[]).find((s) => s.season_id === seasonId);

  // Splash 단계에서 미리 받아둘 자산 — 인트로 일러스트(최우선)
  const splashPreload = ['/intro/season_001_title.png'];

  // ?play=<scene_id> 가 있으면 Day Selection 우회하고 바로 그 씬으로 진입
  // (HomeView의 [다음 풍경] CTA에서 사용)
  const initialActive = searchParams.play
    ? allScenes.find((s) => s.scene_id === searchParams.play) ?? null
    : null;

  return (
    <SplashGate preloadImages={splashPreload}>
      <IntroGate bgmUrl={season?.bgm_url}>
        <TutorialGate>
          <SceneRouter allScenes={allScenes} initialActive={initialActive} />
        </TutorialGate>
      </IntroGate>
    </SplashGate>
  );
}

function EmptyState() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-10">
      <div className="ink-line w-full max-w-[280px] rounded-modal bg-cobble-path p-7 text-center">
        <div className="wobble mx-auto flex items-center justify-center" style={{ height: 72, width: 72 }}>
          <div className="ink-line flex h-full w-full items-center justify-center rounded-full bg-paper">
            <span className="text-2xl" aria-hidden>🌅</span>
          </div>
        </div>
        <h2 className="mt-4 font-book text-h2 text-text">오늘의 풍경 준비 중</h2>
        <p className="mt-1 text-cap text-text-soft">내일 아침에 다시 와주세요</p>
        <p className="mt-3 font-mark text-xl text-cat-deep" style={{ transform: 'rotate(-2deg)' }}>
          곧 만나요
        </p>
      </div>
    </main>
  );
}
