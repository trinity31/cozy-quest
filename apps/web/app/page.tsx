import { getTodayScene, type Scene } from '@cozy-quest/shared';
import scenesData from '@/public/data/scenes.json';
import { DiscoveryView } from './DiscoveryView';
import { PickerView } from './PickerView';

interface HomePageProps {
  searchParams: { picker?: string };
}

export default function HomePage({ searchParams }: HomePageProps) {
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

  const isPicker = searchParams.picker === '1';
  return isPicker ? <PickerView scene={scene} /> : <DiscoveryView scene={scene} />;
}
