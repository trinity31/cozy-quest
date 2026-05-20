import { getSeason, getTodayScene, type Scene, type Season } from '@cozy-quest/shared';
import scenesData from '@/public/data/scenes.json';
import seasonsData from '@/public/data/seasons.json';
import { HomeView } from './HomeView';

export default function HomePage() {
  const scene = getTodayScene(scenesData.scenes as Scene[]);
  // 오늘 풍경이 없으면 시즌 1로 fallback (모든 시즌 보금자리는 항상 접근 가능)
  const seasonId = scene?.season_id ?? 'season_001_cheese';
  const season = getSeason(seasonsData.seasons as Season[], seasonId);

  if (!season) {
    return <main className="flex-1 p-6 text-center text-text-soft">시즌 데이터 없음</main>;
  }

  return <HomeView season={season} />;
}
