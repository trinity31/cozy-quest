export type PartType = 'fullbody' | 'tail' | 'ears' | 'paw' | 'face' | 'back';

export interface CatPart {
  part_id: string;
  type: PartType;
  x: number;         // 0~1
  y: number;         // 0~1
  radius: number;    // 0.02~0.10
}

export interface FurnitureOption {
  id: string;
  name: string;
  image_url: string;
}

export interface Cat {
  cat_id: string;
  name: string;
  personality: string;
  fullbody_image_url: string;
  furniture_options: FurnitureOption[];
  parts: CatPart[];
}

export type FurnitureCategory =
  | 'lamp'
  | 'chair'
  | 'plant'
  | 'rug'
  | 'cushion'
  | 'shelf'
  | 'bed';

/** 카테고리 7종 = 시즌 슬롯 순서 (PRD GAME_RULES K.2). */
export const FURNITURE_CATEGORIES: FurnitureCategory[] = [
  'lamp',
  'chair',
  'plant',
  'rug',
  'cushion',
  'shelf',
  'bed',
];

export interface Scene {
  scene_id: string;
  title: string;
  motif: string;
  difficulty: 1 | 2 | 3;
  image_url: string;
  release_date: string;  // YYYY-MM-DD
  season_id: string;
  day_in_season: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  furniture_category: FurnitureCategory;
  cat: Cat;
}

/**
 * 빈 방 위에 가구를 합성할 슬롯의 정규화 좌표.
 * x, y = 중심 / w, h = 가구 크기 (모두 빈 방 컨테이너 비율).
 */
export interface SlotPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Season {
  season_id: string;
  cat_id: string;
  title: string;
  room_image_url: string;
  /** 카테고리별 슬롯 좌표. 미정의 카테고리는 dark silhouette으로 표시. */
  slots: Partial<Record<FurnitureCategory, SlotPosition>>;
  scene_ids: string[];
}
