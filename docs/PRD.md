# 🐈 Cozy Quest — PRD (Product Requirements Document)

> Sprint 1 (MVP 1주차) 개발용 PRD. Claude Code 에이전트가 이 문서만 보고 작업 가능하도록 자급자족.
> 작성: 2026-05-18 / v2 갱신: 2026-05-20 (GAME_RULES v1.6 정합) / 참조: `docs/GAME_RULES.md`, `docs/SEASON1_CHEESE.md`

---

## 1. 한 줄 컨셉

> **"매일 풍경 1장에 숨은 고양이 1마리를 5번 탭으로 발견하고, 한 시즌 동안 그 고양이의 보금자리(빈 방)를 채워 인테리어를 완성하는 코지 발견 게임."**

3단 Zeigarnik 엔진 (시즌 모델):
- **일간**: 오늘의 5부위 발견 → 그날의 가구 카테고리에서 선물 1개 획득 → 빈 방 슬롯에 합성
- **주간**: 1 시즌 = 1 고양이 × 7 씬 × 7 가구 카테고리 = 1 인테리어 완성
- **분기**: 100일 ≈ 14 시즌 = 14 인테리어 컬렉션 (= 도감)

---

## 2. 기술 스택 — 모노레포 (멀티 플랫폼)

### 모노레포 도구
- **pnpm workspace** + **Turborepo** (빌드 캐싱·병렬)

### 구조
```
cozy-quest/
├── apps/
│   ├── web/          # Next.js PWA (메인, TWA 베이스)
│   ├── toss/         # 토스 미니앱 (W22~)
│   └── ios/          # Capacitor wrapper (6월~)
├── packages/
│   └── shared/       # 게임 로직 + 타입 + UI
├── pnpm-workspace.yaml
└── turbo.json
```

### 플랫폼별 스택
| 플랫폼 | 스택 | 시점 |
|-------|------|------|
| **apps/web** | Next.js 14 (App Router) + TS + Tailwind | W21 (Day 1~7) |
| **apps/toss** | React + 토스 미니앱 SDK | W22 |
| **apps/ios** | Capacitor (web 그대로 wrap) | 6월 |
| **TWA** | Bubblewrap (web → 안드 앱) | W22 |

### 데이터·인증
| 시점 | 방식 |
|------|------|
| Day 1~4 | 정적 JSON + localStorage |
| Day 5~ 또는 친구 배포 직전 | DB 결정 (Supabase / D1) |

**모바일 우선** — 9:16 세로 풀스크린.

---

## 3. 핵심 게임 메커니즘

### 3.1 발견 루프 (P0 — 절대 컷 금지)

```
[풍경 1장 표시] (9:16 풀스크린)
    ↓
[사용자가 줌·팬으로 탐색]
    ↓
[5부위 위치 탭 (1개씩 발견 카운트)]
    ↓ (5/5 달성)
[CatRevealModal: 풀바디 마스킹 해제 + 등장]
    ↓
[선물 받기 클릭]
    ↓
[PickCard: 그날 카테고리 3 variant 중 1개 선택]
    ↓
[/home 라우팅: 시즌 빈 방의 해당 카테고리 슬롯에 영구 합성]
```

### 3.2 5부위 룰 (GAME_RULES.md v1.4)

- 5개 위치 중 **1개 = 풀바디 visible** (쉬운 부위)
- 나머지 4개 = 부위 분산 (꼬리·귀·발·얼굴·등 중 4종)
- 각 부위 면적 = 풍경의 1~3%
- 부위 간 거리 ≥ 화면 대각선 20%
- 5분할(좌상·우상·좌하·우하·중앙) 균등 분포
- 목표 발견 시간 = 30~45초

### 3.3 시즌 = 1 고양이의 보금자리 인테리어 (GAME_RULES K, v1.5~v1.6)

- **1 시즌 = 1 고양이 × 7 씬 × 7 가구 카테고리 = 1 인테리어 완성**
- 가구 카테고리 7종 = `lamp · chair · plant · rug · cushion · shelf · bed`
- 시즌 마스터 = 빈 방 배경 1장(미드저니, 9:16) + 카테고리별 슬롯 좌표
- 매일 발견 → 그날 카테고리의 3 variant 중 1개 선택 → **빈 방 위에 PNG 알파 합성**으로 점진적 인테리어 완성
- 미발견 카테고리 슬롯 = dark silhouette ("?" + 카테고리 라벨)
- 시즌 완료(7/7) = 도감(시즌 갤러리, W22+)에 영구 적립 + 다음 시즌 해금
- 100일 ≈ 14 시즌 = 14 인테리어

### 3.4 24h 박제 (P1, Day 4)

- 어제 5/5 못 찾고 다음날 새 풍경으로 넘어가면 → 못 찾은 부위는 그 자리에 **회색 박제** (정답 노출 + 진척 보존)
- 시간 압박 없이 학습 효과 + 진척감 강화

### 3.5 절대 안 함 (게임 정체성)

- ❌ 글로벌 리더보드 / 친구 비교
- ❌ 에너지·하트 / 가챠
- ❌ 광고 강제
- ❌ 콤보·점수

---

## 4. Sprint 1 범위 — W21~W22 (5/18~31)

> 진척 표기: ✅ 완료 · 🔄 진행 중 · ⏳ 예정

### W21 (Day 1~7) — Web MVP
- **Day 1 (월, 5/18)** ✅ — 모노레포 + apps/web 셋업 + 정적 JSON + 첫 풍경 표시
- **Day 2 (화, 5/19)** ✅ — 줌·팬 + 5부위 탭 + 발견 카운트 + CatRevealModal
- **Day 3 (수, 5/20)** ✅ — 선물 3중 택1 + `/home` 빈 방 + plant 합성 + 시즌 데이터 모델 (v1.6)
- **Day 4 (목, 5/21)** ⏳ — 24h 박제 + 6 카테고리 슬롯 좌표(silhouette 표시 가능) + 진척 잠금 ("Day N에 풀림" 힌트)
- **Day 5 (금, 5/22)** ⏳ — 콘텐츠 파이프라인 ⚠️ 위험 (Day 2~7 풍경 + plant 외 6 카테고리 자산 양산)
- **Day 6 (토, 5/23)** ⏳ — 시즌 완료 갤러리 + 박제·도감 폴리시 (P1)
- **Day 7 (일, 5/24)** ⏳ — Dogfood + 친구 2명 배포

### W22 (5/25~31) — 플랫폼 확장
- TWA wrap (Bubblewrap) → **플레이스토어 심의 제출**
- apps/toss 셋업 + 토스 미니앱 SDK 통합
- Vercel 배포 + 도메인

### 6월~ (W23+)
- 토스 미니앱 게임 승인 (심의 완료 후)
- apps/ios (Capacitor) — App Store 제출
- 해커톤 폴리싱 + 데모 영상 + 제출 (6/19)

---

## 5. 데이터 스키마 (정적 JSON, v1.6 정합)

### 5.1 콘텐츠 JSON

**`/public/data/scenes.json`** — 씬 마스터 + 그날의 cat + 선물 3 variant
```json
{
  "scenes": [
    {
      "scene_id": "market_dawn_001",
      "title": "새벽 시장통 광장",
      "motif": "market",
      "difficulty": 1,
      "image_url": "/scenes/market_dawn_001.png",
      "release_date": "2026-05-20",
      "season_id": "season_001_cheese",
      "day_in_season": 1,
      "furniture_category": "plant",
      "cat": {
        "cat_id": "cat_001",
        "name": "치즈",
        "personality": "낮잠을 좋아하는",
        "fullbody_image_url": "/cats/cat_001_fullbody.png",
        "furniture_options": [
          { "id": "1_plant_tulip", "name": "튤립 화분", "image_url": "/furniture/season_001/1_plant_tulip.png" },
          { "id": "1_plant_cream_pothos", "name": "크림 포토스", "image_url": "/furniture/season_001/1_plant_cream_pothos.png" },
          { "id": "1_plant_primrose_clay", "name": "프림로즈 클레이", "image_url": "/furniture/season_001/1_plant_primrose_clay.png" }
        ],
        "parts": [
          { "part_id": "p001_fullbody", "type": "fullbody", "x": 0.76, "y": 0.802, "radius": 0.07 },
          { "part_id": "p001_face", "type": "face", "x": 0.585, "y": 0.063, "radius": 0.05 },
          { "part_id": "p001_tail", "type": "tail", "x": 0.25, "y": 0.42, "radius": 0.05 },
          { "part_id": "p001_paw", "type": "paw", "x": 0.62, "y": 0.318, "radius": 0.05 },
          { "part_id": "p001_ears", "type": "ears", "x": 0.155, "y": 0.64, "radius": 0.05 }
        ]
      }
    }
  ]
}
```

**`/public/data/seasons.json`** — 시즌 마스터 + 빈 방 + 슬롯 좌표
```json
{
  "seasons": [
    {
      "season_id": "season_001_cheese",
      "cat_id": "cat_001",
      "title": "치즈의 시장 일주일",
      "room_image_url": "/rooms/season_001.png",
      "slots": {
        "plant":   { "x": 0.62, "y": 0.62, "w": 0.26, "h": 0.18 }
        // 나머지 6 카테고리는 Day 4~7 진행하며 정의
      },
      "scene_ids": ["market_dawn_001"]
    }
  ]
}
```

### 5.2 TypeScript 타입 (`packages/shared/src/game.ts`)

```ts
export type PartType = 'fullbody' | 'tail' | 'ears' | 'paw' | 'face' | 'back';

export type FurnitureCategory =
  | 'lamp' | 'chair' | 'plant' | 'rug' | 'cushion' | 'shelf' | 'bed';

export const FURNITURE_CATEGORIES: FurnitureCategory[] = [
  'lamp', 'chair', 'plant', 'rug', 'cushion', 'shelf', 'bed',
];

export interface CatPart {
  part_id: string;
  type: PartType;
  x: number;        // 0~1
  y: number;        // 0~1
  radius: number;   // 0.02~0.10
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
  release_date: string;        // YYYY-MM-DD
  season_id: string;
  day_in_season: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  furniture_category: FurnitureCategory;
  cat: Cat;
}

export interface SlotPosition {
  x: number; y: number; w: number; h: number; // 빈 방 정규화 좌표/크기
}

export interface Season {
  season_id: string;
  cat_id: string;
  title: string;
  room_image_url: string;
  slots: Partial<Record<FurnitureCategory, SlotPosition>>;
  scene_ids: string[];
}
```

### 5.3 localStorage 스키마 (`packages/shared/src/storage.ts`)

```ts
interface HitRecord {
  part_id: string;
  found_at: string;            // ISO timestamp
  seconds_to_find: number;
}

interface HomeSlot {
  season_id: string;
  category: FurnitureCategory;
  cat_id: string;
  furniture_id: string;
  chosen_at: string;
}

interface UserProgress {
  hits: HitRecord[];
  home_slots: HomeSlot[];
  scene_started_at: { [scene_id: string]: string };
}

const KEY = 'cozy_quest_progress_v1';
```

→ DB 마이그레이션 시 (Day 5+) 같은 모양으로 Supabase/D1 테이블로 이관.

### 5.4 자산 디렉토리 규칙

```
apps/web/public/
├── scenes/{scene_id}.png            # 9:16, ≤4MB (다운샘플 권장)
├── cats/{cat_id}_fullbody.png       # 투명 PNG, ~500px
├── rooms/{season_id}.png            # 9:16 빈 방, ≤2MB
└── furniture/season_NNN/
    └── {N}_{category}_{variant}.png # 시즌별 분리, 투명 PNG, ~200px
```

시즌별 디렉토리 = 시즌마다 카테고리당 3 variant를 다시 그림 (자산 비용 vs 시각적 다양성 트레이드오프, Trinity 결정).

---

## 6. 페이지 구조

```
apps/web/app/
├── layout.tsx
├── page.tsx                    # 홈 = 오늘의 풍경 (Server)
│   └── DiscoveryView           # 줌·팬 + 5부위 탭 + RewardModal (Client)
│   └── PickerView              # ?picker=1 = 좌표 픽업 도구 (Client)
└── home/
    └── page.tsx                # 시즌 보금자리 (Server)
        └── HomeView            # 빈 방 + 슬롯 합성 + 진척 게이지 (Client)
```

### 6.1 홈 페이지 (`app/page.tsx`)
- 9:16 풀스크린 컨테이너
- `getTodayScene()`에서 오늘 풍경 선택 (없으면 EmptyState)
- 풍경 + 5 invisible 버튼 (정규화 좌표)
- 5/5 + 미수령 시 `RewardModal` (reveal → pick 두 phase)
- 하단 `🏠 보금자리` 링크

### 6.2 보금자리 (`app/home/page.tsx`)
- 시즌 빈 방 배경 + 7 카테고리 슬롯
- 선택한 가구 = `<Image fill object-contain>`로 합성
- 미발견 슬롯 = SlotSilhouette (점선 박스 + "?" + 카테고리 라벨)
- 상단: 시즌 타이틀 + N/7 게이지
- 우상단: `← 풍경` 링크

### 6.3 데이터 로더 (`packages/shared/src/data.ts`)
```ts
export function getTodayScene(scenes: Scene[]): Scene | null;
export function getSeason(seasons: Season[], seasonId: string): Season | null;
```

### 6.4 환경 변수
**Day 1~4: 필요 없음.** 정적 JSON만 사용. Day 5+ DB 도입 시 환경 변수 추가.

---

## 7. 시즌 1 시드 데이터 (단풍이/치즈 시즌)

- 1 cat: `cat_001 = 치즈` (낮잠을 좋아하는 치즈태비)
- 1 season: `season_001_cheese = "치즈의 시장 일주일"`
- 7 scenes: Day 1 시장 ✅ / Day 2~7 빵집·꽃집·찻집·어물전·야시장·우천 (자산 미정)
- 7 카테고리 × 3 variant = 21 furniture PNG (Day 1 plant 3종 ✅)

> ⚠️ `docs/GAME_RULES.md` K.3은 "단풍이"로 표기됐으나 실제 코드/시즌 메타에서는 **치즈**로 통일됨 (Trinity 결정, 2026-05-20). GAME_RULES.md K.3 표기는 다음 v1.7에서 정합 예정.

---

## 8. Sprint 1 DoD (Definition of Done)

### Day 1 ✅
- [x] `pnpm dev` 홈에 풍경 1장 표시
- [x] `/public/data/scenes.json` 1세트
- [x] `types/game.ts` 타입 정의
- [x] `getTodayScene()` 작동
- [x] 모바일 9:16 풀스크린

### Day 2 ✅
- [x] react-zoom-pan-pinch 줌·팬 (1~4배, 더블탭 reset)
- [x] 5 invisible 버튼 (정규화 좌표 hit-box)
- [x] 발견 카운트 0→5 + 흰색 stroke 정원 표시
- [x] localStorage 영속 (`hits`, `scene_started_at`)
- [x] 햅틱 + Web Audio 합성음 + 음소거 토글
- [x] 좌표 picker (`?picker=1`)

### Day 3 ✅
- [x] 시즌 데이터 모델 (Season, SlotPosition, FurnitureCategory)
- [x] `seasons.json` 신규
- [x] Scene에 `season_id` / `day_in_season` / `furniture_category` 필드
- [x] `RewardModal` reveal → pick phase 전환
- [x] PickCard 3 variant 그리드
- [x] `/home` 페이지: 빈 방 + plant 슬롯 합성
- [x] localStorage `home_slots` 영속 + 덮어쓰기
- [x] 이미 수령 시 모달 미표시

### Day 4 ⏳
- [ ] 24h 박제 로직 (어제 못 찾은 부위 회색 표시)
- [ ] 나머지 6 카테고리 슬롯 좌표 정의 (`seasons.json`)
- [ ] 모든 슬롯 silhouette 표시 (Day N에 풀림 힌트 포함)
- [ ] 풍경 완료 시 시각적 강조 (5/5 완료 라벨 또는 보금자리 강조 CTA)

### Day 5 ⏳ (콘텐츠 파이프라인)
- [ ] Day 2~7 풍경 6장 생성 + 좌표 추출
- [ ] 6 카테고리 × 3 variant PNG (총 18장) 생성
- [ ] scenes.json Day 2~7 추가

### Day 6 ⏳ (P1)
- [ ] 시즌 7/7 완료 시 갤러리 화면
- [ ] 도감(시즌 컬렉션) 진입점

### Day 7 ⏳
- [ ] dogfood: 친구 2명 설치 → 시즌 1 1일 클리어 확인

---

## 9. v2 백로그 (Sprint 1 컷 리스트)

- 마을 점등 (씬 5~7 클리어 = 동네 해금) — P2
- 희귀 등급 (2단계)
- 푸시 알림 (저녁 8시 "오늘의 고양이 만나러 오세요")
- 고양이 스프라이트 자기 자세 (현재 풀바디 외 추가)
- 친구 도감 비교 / 공유
- 슬롯 가구 재선택 (현재는 덮어쓰기만 자동)
- 보금자리 시즌별 디자인 패턴화 (W22+)

---

## 10. 참조 문서

- 본 PRD: `docs/PRD.md`
- 게임 룰 (단일 진실 소스): `docs/GAME_RULES.md`
- 시즌 1 콘텐츠 명세: `docs/SEASON1_CHEESE.md`
