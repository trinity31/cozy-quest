import { type Scene, type Season } from '@cozy-quest/shared';
import scenesData from '@/public/data/scenes.json';
import seasonsData from '@/public/data/seasons.json';
import { IntroGate } from './IntroGate';
import { PickerView } from './PickerView';
import { SceneRouter } from './SceneRouter';

interface HomePageProps {
  searchParams: { picker?: string };
}

export default function HomePage({ searchParams }: HomePageProps) {
  // release_date <= today 인 씬을 server에서 후보로 추리고, 활성 씬은 client에서
  // 진척(home_slots) 기준으로 결정한다. (SceneRouter)
  const today = new Date().toISOString().split('T')[0];
  const candidates = (scenesData.scenes as Scene[])
    .filter((s) => s.release_date <= today)
    .sort((a, b) => a.day_in_season - b.day_in_season);

  if (candidates.length === 0) {
    return <EmptyState />;
  }

  // picker는 dev/디버그 도구 — 인트로/BGM 스킵
  if (searchParams.picker === '1') {
    return <PickerView scene={candidates[candidates.length - 1]} />;
  }

  // 현재 활성 씬의 시즌 BGM URL (시즌별 다름)
  const seasonId = candidates[0]!.season_id;
  const season = (seasonsData.seasons as Season[]).find((s) => s.season_id === seasonId);

  return (
    <IntroGate bgmUrl={season?.bgm_url}>
      <SceneRouter candidates={candidates} />
    </IntroGate>
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
