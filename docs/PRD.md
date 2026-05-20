# 🐈 Cozy Quest — PRD (Product Requirements Document)

> Sprint 1 (MVP 1주차) 개발용 PRD. Claude Code 에이전트가 이 문서만 보고 작업 가능하도록 자급자족.
> 작성: 2026-05-18 / 참조: `Sprint1.md`, `GAME_RULES.md`

---

## 1. 한 줄 컨셉

> **"매일 풍경 1장에 숨은 고양이 1마리를 5번 탭으로 발견하고, 보금자리를 채우는 코지 발견 게임."**

3단 Zeigarnik 엔진:
- **일간**: 오늘의 고양이 찾기 → 가구 1개 획득
- **주간**: 마을 점등 (씬 5~7 클리어) → 새 동네 해금
- **분기**: 보금자리 자라기 → 영구 진척

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
[풀바디 마스킹 해제 + 등장 애니메이션]
    ↓
[가구 3중 택1 선택]
    ↓
[보금자리에 영구 박힘]
```

### 3.2 5부위 룰 (GAME_RULES.md v1.4)

- 5개 위치 중 **1개 = 풀바디 visible** (쉬운 부위)
- 나머지 4개 = 부위 분산 (꼬리·귀·발·얼굴·등 중 4종)
- 각 부위 면적 = 풍경의 1~3%
- 부위 간 거리 ≥ 화면 대각선 20%
- 5분할(좌상·우상·좌하·우하·중앙) 균등 분포
- 목표 발견 시간 = 30~45초

### 3.3 보금자리

- 슬롯 5개 (가구 영구 박힘)
- 발견한 고양이 = 보금자리에 거주 (앉기 스프라이트 1종 P0, 자기 v2)
- 24시간 후 어제 못 찾은 부위 회색 박제 (P1, 시간 되면)

### 3.4 절대 안 함 (게임 정체성)

- ❌ 글로벌 리더보드 / 친구 비교
- ❌ 에너지·하트 / 가챠
- ❌ 광고 강제
- ❌ 콤보·점수

---

## 4. Sprint 1 범위 — W21~W22 (5/18~31)

### W21 (Day 1~7) — Web MVP
- **Day 1 (월=오늘)** — 모노레포 + apps/web 셋업 + 정적 JSON + 첫 풍경 표시 ⭐
- Day 2 (화) — 줌·팬 + 5부위 탭 + 발견 카운트
- Day 3 (수) — 보금자리 + 가구 3중 택1
- Day 4 (목) — 24h 박제 + 도감
- Day 5 (금) — 콘텐츠 파이프라인 ⚠️ 위험
- Day 6 (토) — 마을 점등 (P1)
- Day 7 (일) — Dogfood + 친구 2명 배포

### W22 (5/25~31) — 플랫폼 확장
- TWA wrap (Bubblewrap) → **플레이스토어 심의 제출**
- apps/toss 셋업 + 토스 미니앱 SDK 통합
- Vercel 배포 + 도메인

### 6월~ (W23+)
- 토스 미니앱 게임 승인 (심의 완료 후)
- apps/ios (Capacitor) — App Store 제출
- 해커톤 폴리싱 + 데모 영상 + 제출 (6/19)

---

## 5. 데이터 스키마 (정적 JSON, Day 1 핵심)

### 5.1 콘텐츠 JSON (`/public/data/scenes.json`)

```json
{
  "scenes": [
    {
      "scene_id": "market_dawn_001",
      "title": "새벽 시장통 광장",
      "motif": "market",
      "difficulty": 1,
      "image_url": "/scenes/market_dawn_001.png",
      "release_date": "2026-05-18",
      "cat": {
        "cat_id": "cat_001",
        "name": "단팥",
        "personality": "낮잠을 좋아하는",
        "fullbody_image_url": "/cats/cat_001_fullbody.png",
        "furniture_options": [
          { "id": "f_chair_rattan", "name": "등나무 의자", "image_url": "/furniture/chair_rattan.png" },
          { "id": "f_chair_fabric", "name": "패브릭 의자", "image_url": "/furniture/chair_fabric.png" },
          { "id": "f_chair_rocking", "name": "흔들의자", "image_url": "/furniture/chair_rocking.png" }
        ],
        "parts": [
          { "part_id": "p001_fullbody", "type": "fullbody", "x": 0.50, "y": 0.50, "radius": 0.10 },
          { "part_id": "p001_tail", "type": "tail", "x": 0.20, "y": 0.80, "radius": 0.06 },
          { "part_id": "p001_ears", "type": "ears", "x": 0.75, "y": 0.25, "radius": 0.06 },
          { "part_id": "p001_paw", "type": "paw", "x": 0.50, "y": 0.90, "radius": 0.06 },
          { "part_id": "p001_face", "type": "face", "x": 0.25, "y": 0.20, "radius": 0.06 }
        ]
      }
    }
  ]
}
```

### 5.2 TypeScript 타입 (`types/game.ts`)

```ts
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
```

### 5.3 localStorage 스키마 (`lib/storage.ts`)

```ts
// 사용자 진척 (단일 사용자, MVP)
interface UserProgress {
  hits: {
    part_id: string;
    found_at: string;     // ISO timestamp
    seconds_to_find: number;
  }[];
  home_slots: {
    slot_index: number;   // 0~4
    cat_id: string;
    furniture_id: string;
    chosen_at: string;
  }[];
  scene_started_at: { [scene_id: string]: string };  // 발견 시간 측정용
}

const KEY = 'cozy_quest_progress_v1';
```

→ Day 5/배포 직전에 이 구조 그대로 DB로 마이그레이션. JSON·localStorage 모두 동일 스키마 유지.

---

## 6. Day 1 구조 — 모노레포

```
cozy-quest/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx              # 홈 = 오늘의 풍경
│       │   └── globals.css
│       ├── public/
│       │   ├── data/scenes.json      # 콘텐츠 (PRD 5.1)
│       │   ├── scenes/*.png          # placeholder
│       │   ├── cats/*.png
│       │   └── furniture/*.png
│       ├── next.config.js
│       ├── tailwind.config.ts
│       └── package.json
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── types/game.ts         # PRD 5.2
│       │   ├── data.ts               # getTodayScene()
│       │   └── storage.ts            # localStorage 헬퍼
│       └── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── package.json (root)
```

### apps/web/app/page.tsx
- Server Component
- `import { getTodayScene } from '@cozy-quest/shared'`
- 9:16 풀스크린 컨테이너 (max-w-[480px], bg-black)
- 풍경 1장 `<Image fill>` 표시
- 상단: "0/5 발견", 하단: "🏠 보금자리" (disabled)

### 6.1 홈 페이지 (`app/page.tsx`)

- 9:16 풀스크린 컨테이너
- `lib/data.ts`에서 오늘 날짜 기준 scene 1건 선택
- `image_url` 표시 (next/image, fill)
- 풍경 위 5부위 좌표는 invisible div 5개 (탭 영역, Day 2에 구현)
- 상단: 발견 카운트 "0/5" (Day 2)
- 하단: "보금자리" 링크 (Day 3)

### 6.2 데이터 로더 (`lib/data.ts`)

```ts
import scenesData from '@/public/data/scenes.json';
import type { Scene } from '@/types/game';

export function getTodayScene(): Scene | null {
  const today = new Date().toISOString().split('T')[0];  // YYYY-MM-DD
  return scenesData.scenes.find((s) => s.release_date === today) as Scene | null;
}
```

### 6.3 환경 변수

**필요 없음.** Day 1은 정적 JSON만 사용.

---

## 7. Day 1 시드 데이터

`/public/data/scenes.json` 한 파일에 PRD 5.1 JSON 그대로 저장.
placeholder 이미지 5장만 함께 생성.

---

## 8. Day 1 DoD (Definition of Done)

- [ ] `pnpm dev` 실행 시 홈 페이지에 풍경 1장 표시
- [ ] `/public/data/scenes.json` 1세트 작성됨
- [ ] `types/game.ts` 타입 정의됨
- [ ] `lib/data.ts` 오늘 풍경 선택 작동
- [ ] placeholder 이미지 5장 (`/public/scenes/`, `/cats/`, `/furniture/`)
- [ ] 모바일 9:16 비율로 풍경이 풀스크린 표시됨 (Chrome DevTools mobile view 확인)

---

## 9. v2 백로그 (Sprint 1 컷 리스트)

- 마을 점등 (Day 6)
- 희귀 등급 (2단계)
- 푸시 알림
- 고양이 스프라이트 자기 자세
- 친구 도감 비교 / 공유

---

## 10. 참조 문서

- 본 PRD: `Projects/코지퀘스트/PRD.md`
- Sprint 계획: `Projects/코지퀘스트/Sprint1.md`
- 게임 룰: `Projects/코지퀘스트/GAME_RULES.md`
- 원본 컨셉: `Projects/앱아이디어_백로그/_아카이브/2026-05-09_코지퀘스트.md`