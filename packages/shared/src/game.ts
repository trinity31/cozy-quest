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

export interface Scene {
  scene_id: string;
  title: string;
  motif: string;
  difficulty: 1 | 2 | 3;
  image_url: string;
  release_date: string;  // YYYY-MM-DD
  cat: Cat;
}
