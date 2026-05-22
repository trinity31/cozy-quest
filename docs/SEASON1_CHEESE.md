# 🍂 Season 01 — 치즈의 일주일 (Single Source of Truth)

> 시즌 1 양산 마스터 문서. 7씬 배경 + 7카테고리×3 variant 가구 + 빈 방 인테리어 + 슬롯 좌표 + 미드저니 프롬프트 전체.
> 작성: 2026-05-20 (W21 Day 3)
> 의존: [GAME_RULES.md v1.6](./GAME_RULES.md) · [IMAGE_PROMPTS.md](./IMAGE_PROMPTS.md) · [PRD.md](./PRD.md)

---

## 0. 시즌 1 메타

| 항목            | 값                                                                          |
| --------------- | --------------------------------------------------------------------------- |
| `season_id`     | `season_001_cheese`                                                         |
| 고양이          | **치즈 (Cheese)** — warm cheese-ginger tabby with white chest patch         |
| 컬러 코드       | base `#E8945C` / stripes `#C97A3E` / chest `#FFFBF0`                        |
| 7씬 모티프      | 시장 일주일 (시장 → 빵집 → 꽃집 → 찻집 → 어물전 → 야시장 → 우천)            |
| 7 가구 카테고리 | plant · rug · cushion · chair · shelf · lamp · bed (Day 1~7 순서)           |
| 인테리어 컨셉   | **치즈의 따뜻한 시장 골목 방** — caramel orange + cream + sage + terracotta |

---

## 1. 치즈 베이스 자산 (1회 생성, 모든 씬 재활용)

### 1.1 풀바디 마스터 PNG (Cref용)

```
Children's storybook illustration in the style of Beatrix Potter meets
Studio Ghibli with the graphic clarity of Luke Pearson's "Hilda".
Hand-drawn warm-brown ink linework #5C4128, line weight ~2px with slight
organic wobble, rounded caps. Watercolor wash on visible cream paper
grain, three tones per area, highlights as bare paper white.

Subject: a single warm cheese-ginger tabby cat named Cheese (치즈),
fur base #E8945C with #C97A3E stripes, small white chest patch, soft
tabby M-mark on forehead, white chin. Curled half-asleep with paws
tucked under. 3/4 front-side angle. Eyes small and sleepy (half-closed),
mouth closed with tiny gentle smile. Personality: quiet napper who
loves sun spots.

Composition: full body of the cat centered on square canvas, isolated
character with TRANSPARENT BACKGROUND. Minimum 60px padding.

Output: PNG with alpha, 800×800 px, sRGB.

--ar 1:1 --style raw --v 7
--no flat fill, vector lines, 3D, anime, big sparkling eyes, chibi,
exposed teeth, predator, second character, human, scenery, furniture
```

→ 이 결과물을 모든 부위·씬 프롬프트에 `--cref [URL] --cw 100`로 첨부.

### 1.2 부위 5종 PNG (재활용, 1회만 생성)

| 부위                 | SIZE    | 마스킹 사물 후보        |
| -------------------- | ------- | ----------------------- |
| `tail`               | 300×300 | 통/항아리/커튼/빵바구니 |
| `ear`                | 300×300 | 바구니/지붕/상자        |
| `paw`                | 300×300 | 벤치/계단/문틈          |
| `face`               | 400×400 | 창문/아치/가게 입구     |
| `back` (둥근 풀바디) | 400×400 | 지붕/처마/벤치 위       |

프롬프트 패턴은 [IMAGE_PROMPTS.md §4](./IMAGE_PROMPTS.md) 그대로. 모든 부위 프롬프트에 `--cref [치즈 풀바디 URL] --cw 100 --sw 1000` 강제.

→ **부위 5장 = 1번만 만들고 7씬 전부 재활용** (PRD G.자산 재활용 룰).

---

## 2. 7씬 배경 미드저니 프롬프트

> 모든 씬 공통: `--sref [Day 1 시장 배경 URL]` + `--sw 1000` 으로 톤 강제 매칭. Day 1 시장 배경이 시즌 1의 톤 기준점.

### Day 1 — 시장통 광장 (새벽) — `market_dawn_001` ✅ 완료

```
A cozy european market plaza at warm dawn, viewed from a slight top-down
3/4 isometric angle. Cobblestone ground, warm cream walls #F5E5B8,
terracotta tile rooftops #D96B47, wooden market stalls with overflowing
crates of vegetables and fruits, woven straw baskets, ceramic jars,
wooden barrels, hanging lanterns, sage green #A8C49A awnings with
cream stripes, flower boxes with daisies and red poppies on windowsills,
a teal bicycle, wooden bench. Many overlapping objects creating natural
hiding spots.

[STYLE_PREFIX 풀버전]

--ar 9:16 --style raw --v 7
--no cats, animals, people, modern objects, signs with clear text
```

**완료 상태**: 배경 + 치즈 부위 5개 + 가림 화분 합성 완료 (2026-05-20).

### Day 2 — 빵집 골목 — `bakery_morning_002`

```
A cozy narrow european bakery alley at warm morning, viewed from slight
top-down 3/4 isometric angle. Stone cobblestone street, warm cream walls
#F5E5B8 #FAEFC8, terracotta tile rooftops #D96B47, wooden bakery stalls
with woven baskets overflowing with rustic loaves, croissants, baguettes,
buns. Wooden window shutters in soft sage #A8C49A, hanging wooden bakery
sign with chalkboard, vintage brass lanterns glowing softly, small flower
boxes with daisies and lavender on windowsills, wooden barrels of flour,
ceramic jars, linen sacks of grain, a wooden bench, scattered flour
dust on the ground. Many overlapping objects creating natural hiding
spots between baskets, barrels, and bread stacks.

[STYLE_PREFIX 풀버전]

--sref [Day 1 URL] --sw 1000 --ar 9:16 --style raw --v 7
--no cats, animals, people, modern objects, cars, signs with clear text
```

### Day 3 — 꽃집 처마 — `florist_noon_003`

```
A cozy european flower shop storefront at warm noon, viewed from slight
top-down 3/4 isometric angle. Stone cobblestone street, cream walls
#F5E5B8, terracotta tile rooftop #D96B47, a sage green #A8C49A canvas
awning with cream stripes, wooden buckets and tin pails overflowing
with bouquets of cosmos, daisies, lavender, red poppies, pink primroses,
hanging baskets of trailing ivy, wooden ladder leaning against the wall,
old watering cans, ceramic pots stacked in corners, a small wrought-iron
chair, scattered flower petals on the ground. Many overlapping floral
elements creating natural hiding spots.

[STYLE_PREFIX 풀버전]

--sref [Day 1 URL] --sw 1000 --ar 9:16 --style raw --v 7
--no cats, animals, people, modern objects, vivid neon colors, signs with text
```

### Day 4 — 찻집 정원 — `teahouse_afternoon_004`

```
A cozy european tea house outdoor garden at warm afternoon, viewed from
slight top-down 3/4 isometric angle. Stone paving with moss in cracks,
cream walls #F5E5B8 with climbing ivy, terracotta rooftop #D96B47, small
round wooden tables with linen tablecloths and ceramic teapots, rattan
chairs with sage cushions, hanging paper lanterns #FAEFC8, wooden trellis
with climbing roses, potted herbs in terracotta, a wrought iron tea
trolley with stacked cups, scattered fallen petals, soft warm afternoon
light. Many overlapping cozy objects creating natural hiding spots.

[STYLE_PREFIX 풀버전]

--sref [Day 1 URL] --sw 1000 --ar 9:16 --style raw --v 7
--no cats, animals, people, modern objects, signs with text
```

### Day 5 — 시장 골목 (어물전) — `fishmarket_evening_005`

```
A cozy european fish market alley at warm evening (golden hour), viewed
from slight top-down 3/4 isometric angle. Wet cobblestone reflecting
warm light, cream walls #F5E5B8, terracotta rooftops #D96B47, wooden
fish stalls with crushed ice and folded paper, woven baskets, hanging
glass buoys and fishing nets as decoration (no real fish in detail),
wooden crates, ceramic jars of salt, lanterns starting to glow #E8C56C,
stacked wooden barrels, a wooden ladder, scattered straw on ground.
Many overlapping cozy market elements, hiding spots between barrels
and crates.

[STYLE_PREFIX 풀버전]

--sref [Day 1 URL] --sw 1000 --ar 9:16 --style raw --v 7
--no cats, animals, people, dead fish details, gore, modern objects, signs with text
```

> 어물전 모티프이지만 "물고기 디테일 X" — 코지 톤 유지 위해 그물·부표·바구니 같은 시각 요소로 표현.

### Day 6 — 달빛 야시장 — `nightmarket_moonlit_006`

```
A cozy european night market at moonlit evening, viewed from slight
top-down 3/4 isometric angle. Stone cobblestone reflecting lantern
glow, deep indigo-violet sky with stars, cream walls #F5E5B8 in shadow,
terracotta rooftops #D96B47 in moonlight. Many warm glowing lanterns
#E8C56C #FAEFC8 — paper lanterns hanging on strings, brass lanterns
on stalls, candles in jars on tables. Wooden stalls with handmade
trinkets, ceramic bowls, fabric rolls, dried herbs. Hanging string
lights. A wooden bench. Soft warm pools of light contrasting with
cool moonlit shadows. Many overlapping market elements creating
hiding spots, dim but cozy.

[STYLE_PREFIX 풀버전 — but mood: warm intimate nighttime, cozy magic, never spooky]

--sref [Day 1 URL] --sw 1000 --ar 9:16 --style raw --v 7
--no cats, animals, people, modern objects, neon, harsh shadows, horror, scary
```

> 야간 = 명도 낮춤 + 등불 점등. 색 팔레트는 시즌 톤 유지.

### Day 7 — 비 오는 처마 — `rainy_eaves_007`

```
A cozy european street eaves view on a warm rainy day, viewed from
slight top-down 3/4 isometric angle. Wet cobblestone with gentle ripples
in puddles, cream walls #F5E5B8 with rain streaks, terracotta rooftops
#D96B47 dripping water, wooden window shutters in sage #A8C49A
half-closed, hanging brass lanterns glowing softly, potted plants
on windowsills, a wooden bench under the eaves, an old umbrella
leaning against the wall, scattered fallen leaves wet on ground,
soft diffused rainy daylight. Gentle vertical rain lines. Many
overlapping cozy elements under the dry shelter of the eaves,
hiding spots between pots and shutters.

[STYLE_PREFIX 풀버전 — mood: cozy rainy intimacy, peaceful petrichor]

--sref [Day 1 URL] --sw 1000 --ar 9:16 --style raw --v 7
--no cats, animals, people, storm, lightning, modern objects, signs with text
```

---

## 3. 7 가구 카테고리 × 3 Variant = 21개 PNG

> 모든 가구 프롬프트 공통: 1:1 square, 투명 배경, `--sref [Day 1 URL] --sw 1000 --style raw`.
> Day 1 가구 = plant 3 variant부터 생성. 이후 각 씬 진행 시 해당 카테고리 변종 생성.

> 🎁 **시즌 1 = 해커톤 제출 범위 (2026-05-21 결정)**: Daker 해커톤(5/26 기획서 / 6/8 산출물)에는 **시즌 1만** 제출. 시즌 2 이후 출시 약속 없음 — 시장 반응 보고 결정. 시즌 1 21 variant는 향후 베이스 풀로 활용 가능하지만 시즌 수·확장 계획은 미정.
>
> 단, **해커톤 산출물 Scope는 5씬 (Day 1~5) · 5 카테고리 · 15 variant로 축소** (자세한 일정·이유 §7 참조).

### Day 1 · plant (식물) — `furniture/plant/*.png`

| #   | 파일명                       | 프롬프트                                                                                                                           |
| --- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 01  | `plant_01_olive_terra.png`   | a terracotta pot #D96B47 holding a small olive tree with silvery sage leaves #A8C49A, three tones watercolor, no shadow background |
| 02  | `plant_02_pothos_cream.png`  | a cream ceramic round pot #FAEFC8 holding a trailing pothos vine with deep sage leaves #7BA084                                     |
| 03  | `plant_03_primrose_clay.png` | a hand-thrown brown clay pot with three pink primrose blooms #E8B4B8                                                               |

공통 추가:

```
[STYLE_PREFIX 풀버전]
3/4 front-side angle, single object centered, TRANSPARENT BACKGROUND,
minimum 32px padding, soft watercolor base shadow only.
--sref [Day 1 URL] --sw 1000 --ar 1:1 --style raw --v 7
--no cat, animal, second object, scenery, text, drop shadow, 3D
```

### Day 2 · rug (러그) — `furniture/rug/*.png`

| #   | 파일명                      | 핵심 묘사                                                                                          |
| --- | --------------------------- | -------------------------------------------------------------------------------------------------- |
| 01  | `rug_01_caramel_stripe.png` | small woven rug, cream + caramel stripes #FAEFC8 #E8945C, viewed slight angle, fringe at both ends |
| 02  | `rug_02_braided_sage.png`   | round braided rug in sage and olive tones #A8C49A #A6BC5C, spiral weave pattern                    |
| 03  | `rug_03_folk_pink.png`      | folk pattern rug, diamond + flower motif in pink #E8B4B8 and terracotta #D96B47 on cream ground    |

### Day 3 · cushion (쿠션) — `furniture/cushion/*.png`

| #   | 파일명                       | 핵심 묘사                                                                                            |
| --- | ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| 01  | `cushion_01_cream_leaf.png`  | plump square linen cushion in cream #F5E5B8, small embroidered sage green #A8C49A leaf in corner     |
| 02  | `cushion_02_terra_round.png` | round velvet-feel cushion in deep terracotta #D96B47, braided rope trim around edge                  |
| 03  | `cushion_03_sage_stripe.png` | soft cushion with vertical stripes sage #A8C49A + cream #F5E5B8, two small tassels at bottom corners |

### Day 4 · chair (의자) — `furniture/chair/*.png`

| #   | 파일명                 | 핵심 묘사                                                                       |
| --- | ---------------------- | ------------------------------------------------------------------------------- |
| 01  | `chair_01_rattan.png`  | hand-woven rattan armchair with curved back, natural wicker tones #B69770       |
| 02  | `chair_02_fabric.png`  | small wooden chair with soft sage-green #A8C49A fabric seat cushion             |
| 03  | `chair_03_rocking.png` | wooden rocking chair with cream wool throw blanket #FAEFC8 draped over the back |

### Day 5 · shelf (선반) 🆕 — `furniture/shelf/*.png`

| #   | 파일명                         | 핵심 묘사                                                                                                                      |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 01  | `shelf_01_books_warm.png`      | small wooden bookshelf with leather-bound books in warm caramel tones #C97A3E and cream covers, two small potted plants on top |
| 02  | `shelf_02_dishes_ceramic.png`  | wooden dish rack/shelf with hand-thrown ceramic mugs, plates, and bowls in cream #FAEFC8 and terracotta #D96B47                |
| 03  | `shelf_03_wallhung_simple.png` | a small wall-mounted wooden floating shelf with three small jars #F5E5B8 and a single sprig of dried lavender                  |

### Day 6 · lamp (등불) — `furniture/lamp/*.png`

| #   | 파일명                      | 핵심 묘사                                                                                    |
| --- | --------------------------- | -------------------------------------------------------------------------------------------- |
| 01  | `lamp_01_honey_classic.png` | classic honey-amber cloth shade table lamp with brass-tone base, soft warm bulb glow #E8C56C |
| 02  | `lamp_02_cream_paper.png`   | cream paper lantern (Japanese-style) hanging on wooden frame, soft diffuse glow #FAEFC8      |
| 03  | `lamp_03_terra_brazier.png` | terracotta clay brazier oil lamp with small flame, warm orange-red glow #D96B47              |

### Day 7 · bed (침대/베드) 🆕 — `furniture/bed/*.png`

| #   | 파일명                     | 핵심 묘사                                                                                        |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| 01  | `bed_01_rattan_round.png`  | round woven rattan cat bed with thick cream cushion #FAEFC8 inside, natural wicker tones #B69770 |
| 02  | `bed_02_canopy_cozy.png`   | small fabric canopy bed (tent-style cat bed) in cream linen #F5E5B8 with sage trim #A8C49A       |
| 03  | `bed_03_quilted_floor.png` | thick quilted floor bed/pillow in terracotta #D96B47 with cream stitching, plump round shape     |

---

## 4. 빈 방 인테리어 — 치즈의 방

### 4.1 빈 방 배경 미드저니 프롬프트 (1장만)

```
A cozy small attic-style cat room interior, viewed from slight top-down
3/4 isometric angle. EMPTY ROOM with no furniture yet — just the
architectural shell waiting to be decorated. Warm cream walls #F5E5B8
with subtle hand-painted floral border near the ceiling, a single arched
window on the back wall with sage green #A8C49A shutters letting in
warm golden afternoon light, wooden plank floor #B69770 with slight
weathered texture, a small woven mat space marked subtly on the floor,
exposed warm-brown wooden ceiling beams #5C4128, one empty corner
shelf nook built into the wall, one empty wall sconce hook, a hint of
a small fireplace alcove. Soft watercolor light pooling on the floor.
Cozy storybook intimacy, peaceful, warm, inviting — ready to be filled.

[STYLE_PREFIX 풀버전]

--sref [Day 1 시장 배경 URL] --sw 1000 --ar 9:16 --style raw --v 7
--no furniture, cats, animals, people, objects on shelves, plants in
pots, lamps, cushions, beds, chairs, rugs, modern items, signs, text,
clutter
```

> "empty room" 강조 + negative에 가구 종류 명시. 슬롯 자리가 보이는 빈 방 핵심.

### 4.2 슬롯 좌표 정의 (7개)

빈 방 배경 1024×1820 기준 (9:16). `(x_ratio, y_ratio)` 0.0~1.0 정규화 + `slot_width/height` 정규화 크기.

| slot_index | 카테고리    | 위치                            | x_ratio | y_ratio | width | height |
| ---------- | ----------- | ------------------------------- | ------- | ------- | ----- | ------ |
| 0          | **plant**   | 창가 바닥                       | 0.78    | 0.30    | 0.18  | 0.20   |
| 1          | **cushion** | 의자 위 (chair 슬롯 위 겹침 OK) | 0.50    | 0.55    | 0.16  | 0.12   |
| 2          | **rug**     | 방 중앙 바닥                    | 0.50    | 0.72    | 0.55  | 0.20   |
| 3          | **chair**   | 좌측 중앙                       | 0.30    | 0.55    | 0.22  | 0.28   |
| 4          | **shelf**   | 우측 벽 (코너 nook)             | 0.85    | 0.55    | 0.22  | 0.30   |
| 5          | **lamp**    | 좌측 벽 sconce 또는 책상 위     | 0.15    | 0.40    | 0.14  | 0.22   |
| 6          | **bed**     | 좌하단 구석                     | 0.25    | 0.82    | 0.30  | 0.18   |

> 좌표는 빈 방 디자인 후 Figma에서 측정 후 미세 조정. 위 값은 1차 가이드.

### 4.3 합성 로직 (코드 측)

```typescript
// 의사 코드
function renderInterior(season_id: string, slots_filled: HomeSlot[]) {
  const emptyRoom = `/interiors/${season_id}_empty.png`;
  const layers = [
    { src: emptyRoom, z: 0 }
  ];

  // 빈 슬롯은 어두운 placeholder 실루엣
  for (const slotDef of SLOT_DEFINITIONS[season_id]) {
    const filled = slots_filled.find(s => s.slot_index === slotDef.slot_index);
    if (filled) {
      layers.push({
        src: `/furniture/${filled.furniture_id}.png`,
        x: slotDef.x_ratio,
        y: slotDef.y_ratio,
        w: slotDef.width,
        h: slotDef.height,
        z: slotDef.z_order
      });
    } else {
      // placeholder: 카테고리 실루엣 (다크 30%)
      layers.push({
        src: `/placeholders/${slotDef.category}_silhouette.png`,
        opacity: 0.3,
        ...
      });
    }
  }

  return composeLayers(layers);
}
```

z-order 기본: bed(1) → rug(2) → chair(3) → plant(4) → cushion(5) → shelf(6) → lamp(7).

### 4.4 진척 게이지 UI

빈 방 화면 상단:

```
🍂 치즈의 방 · 3/7 완성
[■■■□□□□] · 다음: 찻집 정원 · 의자 보상
```

빈 슬롯 hover/tap → "Day 5에 풀려요" tooltip.

---

## 5. scenes.json 등록 예시 (Day 1)

```json
{
  "scene_id": "market_dawn_001",
  "season_id": "season_001_cheese",
  "day_in_season": 1,
  "title": "새벽 시장통 광장",
  "motif": "market",
  "difficulty": 1,
  "image_url": "/scenes/market_dawn_001.png",
  "release_date": "2026-05-26",
  "furniture_category": "plant",
  "cat": {
    "cat_id": "cat_001_cheese",
    "name": "치즈",
    "personality": "낮잠을 좋아하는",
    "fullbody_image_url": "/cats/cat_001_cheese_fullbody.png",
    "furniture_options": [
      {
        "id": "f_plant_olive_terra",
        "name": "올리브 (테라코타)",
        "image_url": "/furniture/plant/plant_01_olive_terra.png"
      },
      {
        "id": "f_plant_pothos_cream",
        "name": "포토스 (크림)",
        "image_url": "/furniture/plant/plant_02_pothos_cream.png"
      },
      {
        "id": "f_plant_primrose_clay",
        "name": "프림로즈 (클레이)",
        "image_url": "/furniture/plant/plant_03_primrose_clay.png"
      }
    ],
    "parts": [
      {
        "part_id": "p001_fullbody",
        "type": "fullbody",
        "x": 0.78,
        "y": 0.72,
        "radius": 0.035
      },
      {
        "part_id": "p001_face",
        "type": "face",
        "x": 0.55,
        "y": 0.06,
        "radius": 0.05
      },
      {
        "part_id": "p001_tail_l",
        "type": "tail",
        "x": 0.15,
        "y": 0.18,
        "radius": 0.045
      },
      {
        "part_id": "p001_tail_c",
        "type": "tail",
        "x": 0.55,
        "y": 0.21,
        "radius": 0.045
      },
      {
        "part_id": "p001_tail_m",
        "type": "tail",
        "x": 0.2,
        "y": 0.55,
        "radius": 0.045
      }
    ]
  }
}
```

> Day 1은 ears 생성 어려움으로 tail 3개로 대체된 상태. v1.4 룰 위반이지만 Sprint1 dogfood 한정 허용 (변경 이력 메모).

---

## 6. 자산 체크리스트

### 6.1 1회 생성 (모든 씬 재활용)

- [ ] 치즈 풀바디 master PNG ⭐ Cref용
- [ ] 치즈 부위 5종 PNG (tail / ear / paw / face / back)
- [ ] **빈 방 인테리어 배경 PNG** (치즈의 방)
- [ ] 슬롯 placeholder 실루엣 7종 (plant·cushion·rug·chair·shelf·lamp·bed)

### 6.2 씬별 생성 (Day 1~7)

- [x] Day 1 시장통 광장 배경 + plant 3 variant
- [ ] Day 2 빵집 골목 배경 + rug 3 variant
- [ ] Day 3 꽃집 처마 배경 + cushion 3 variant
- [ ] Day 4 찻집 정원 배경 + chair 3 variant
- [ ] Day 5 시장 골목 배경 + shelf 3 variant 🆕
- [ ] Day 6 달빛 야시장 배경 + lamp 3 variant
- [ ] Day 7 비 오는 처마 배경 + bed 3 variant 🆕

### 6.3 총 자산 수

- 베이스: 1(고양이) + 5(부위) + 1(빈 방) + 7(placeholder) = **14개**
- 씬: 7(배경) + 21(가구 variant) = **28개**
- **합계 = 42개 PNG**

---

## 7. 일정 v5 (2026-05-21 갱신) — 두 단계 마감 + 5씬 Scope

> **2026-05-21 사용자 결정**:
>
> 1. Daker 해커톤 마감 = **5/26 기획서** + **6/8 산출물(웹+시연영상)**
> 2. 5/26~29 아빠 병원동행·치과 → 작업 불가. 5/30~6/4만 산출물 작업 가능
> 3. 6/5~7 입주·이사청소 → 작업 불가. 사실상 6/4가 최종일
> 4. 토·일 = **half day 업무 가능** (일요일 코딩 금지 룰 폐기 — CLAUDE.md/pm-playbook.md 갱신됨)
> 5. Scope: **5씬 (Day 1~5)** · 5 카테고리 (plant·cushion·rug·chair·shelf) · 15 variant. Day 6~7 잠금 처리
> 6. **3씬 우선 완성 → 고도화 → 2씬 추가** 전략. Day 4·5는 stretch goal.

### 7.1 가용일 계산 (half-day 룰)

| 날짜        | 상태                  | 환산 |
| ----------- | --------------------- | ---- |
| 5/22 금     | ✅ 풀                 | 1.0  |
| 5/23 토     | ⏰ half               | 0.5  |
| 5/24 일     | ⏰ half               | 0.5  |
| 5/25 월     | ✅ 풀 (기획서 제출일) | 1.0  |
| 5/26~29     | ❌ 병원/치과/약속     | 0    |
| 5/30 토     | ⏰ half               | 0.5  |
| 5/31 일     | ⏰ half               | 0.5  |
| 6/1~4 월~목 | ✅ 풀                 | 4.0  |
| 6/5~7       | ❌ 이사               | 0    |
| 6/8         | 산출물 마감 10:00     | —    |

→ **Phase 1 (~5/25): 3.0 풀데이 환산**
→ **Phase 2 (5/30~6/4): 5.0 풀데이 환산**
→ **총 8 풀데이**

### 7.2 Phase 1 (5/22~5/25) — 기획서 + Day 3 완성 + 코어 메커닉 시작

| 날짜         | 작업                                                             | 목표               |
| ------------ | ---------------------------------------------------------------- | ------------------ |
| 5/22 금 (풀) | 합성 로직 v2 기본 코딩 + cushion 3종 + 타이틀 일러스트(미드저니) | Day 3 자산 완료    |
| 5/23 토 (반) | 기획서 초안 + Day 3 합성 + 모바일 프레임 셋업                    | Day 3 dogfood 가능 |
| 5/24 일 (반) | 기획서 본문 + 인트로 화면 코드 + BGM Suno 생성                   | 인트로 시작        |
| 5/25 월 (풀) | 기획서 최종 검수 + **🏆 기획서 제출** + SFX 다운로드 + 로딩 화면 | 기획서 통과        |

**5/25 제출 시점 상태**: Day 1~3 합성 완성 + 기획서 + 인트로 + 음악 1차

### 7.3 Phase 2 (5/30~6/4) — 메커닉 + Day 4·5 + 폴리시

| 날짜         | 작업                                                                  | 목표           |
| ------------ | --------------------------------------------------------------------- | -------------- |
| 5/30 토 (반) | 빈 방 인테리어 배경 + 슬롯 좌표 + **Day 4·5 미드저니 큐 병렬 돌리기** | 자산 준비      |
| 5/31 일 (반) | 시간 제한 + 타이머 + 시즌 진행 게이지                                 | 메커닉 1차     |
| 6/1 월 (풀)  | 힌트 버튼 + 발동 로직 + 치즈 등장 트랜지션                            | 메커닉 완성    |
| 6/2 화 (풀)  | 합성 로직 고도화 + breathing 애니메이션 + Day 4 합성                  | 고도화 + Day 4 |
| 6/3 수 (풀)  | Day 5 합성 + 엔딩 화면 + 공유 기능 + 튜토리얼 버블                    | 시즌 완성      |
| 6/4 목 (풀)  | 오디오 통합 + dogfood 풀세트 + 폴리시 + 시연 영상 + 배포              | 🏆 최종        |

**6/4 작업분 = 6/8 10:00 제출본 그대로** (이사로 6/5~7 손 못 댐)

### 7.4 자산 체크리스트 (v5)

#### 완료

- [x] Day 1 시장통 + plant 3 + 합성
- [x] Day 2 빵집 + rug 3 + 합성
- [x] Day 3 꽃집 배경

#### Phase 1 남음

- [ ] cushion 3종 (Day 3 가구)
- [ ] Day 3 합성
- [ ] 타이틀 일러스트 (미드저니 1장)
- [ ] 인트로 화면 코드
- [ ] BGM 1곡 (Suno) + SFX 5종 (가구 배치·치즈 발견·완성·클릭·인트로)
- [ ] 로딩 화면
- [ ] 모바일 프레임 고정
- [ ] **🏆 기획서 5/25 제출**

#### Phase 2 남음

- [ ] 빈 방 인테리어 배경 1장
- [ ] 합성 로직 고도화 (z-order·shadow·placeholder·micro 회전)
- [ ] 시간 제한 + 타이머
- [ ] 힌트 버튼 (씬당 2회) + 글로우 발동
- [ ] 시즌 진행 게이지
- [ ] 치즈 등장 트랜지션 + breathing 애니메이션
- [ ] Day 4 찻집 배경 + chair 3 + 합성
- [ ] Day 5 어물전 배경 + shelf 3 + 합성 _(stretch goal — Day 6·7은 잠금 처리)_
- [ ] 엔딩 화면 + 시즌 맵 + Coming Soon 카드
- [ ] 공유 기능 (html2canvas)
- [ ] 튜토리얼 버블 (첫 접속)
- [ ] 오디오 통합 + 볼륨 컨트롤
- [ ] 시연 영상 (1분) + 웹 배포
- [ ] **🏆 6/4 최종 작업 → 6/8 제출**

### 7.5 부분 완성 룰 (Stretch Goal)

- **Day 4·5는 stretch goal**. 6/2·3에 합성 시간 부족 시 **즉시 잘라내기**
- 잘라낸 Day는 시즌 맵에서 "잠금 + 곧 공개" 처리 → 자연스러운 UX
- 최저 보장선: **Day 1~3 + 인테리어 + 합성 고도화 + 메커닉 풀세트** = 데모로 충분히 강함

---

## 9. 게임 흐름 (User Journey)

> 2026-05-21 정의. 첫 접속부터 시즌 1 완료까지 단일 흐름.

```
[1] Splash/Loading 화면
    ├ Cozy Quest 로고 + 자산 preload spinner
    └ 자산 다 로드되면 자동 다음
[2] Title/Intro 화면
    ├ 타이틀 일러스트 (미드저니 1장, 시즌 1 치즈 풀바디 + 코지 분위기)
    ├ Cozy Quest 로고
    ├ "Season 1: 치즈의 일주일" 서브타이틀
    ├ [시작하기] 버튼
    └ BGM 시작 (사용자 인터랙션 트리거 후 재생)
[3] (첫 접속만) Tutorial 버블
    ├ 말풍선 "숨어있는 고양이들을 찾아보세요"
    └ localStorage 플래그로 두번째 접속부터 스킵
[4] Day Selection / Season Progress Map
    ├ 시즌 1 진행 맵 (Day 1·2·3 활성, Day 4·5는 클리어 후 해금, Day 6·7 잠금)
    ├ 각 Day 카드 = 모티프 일러스트 thumbnail + 완료 체크
    └ 인테리어 미리보기 (N/7 가구 완성됨)
[5] Scene Play
    ├ 시간 제한 타이머 (씬당 60~90초, 상단)
    ├ 힌트 버튼 (씬당 2회, 우측 하단)
    ├ 부위 5개 발견 진행 표시 (상단)
    ├ 탭 → 발견 시 SFX + 부위 카운트 증가
    ├ 시간 초과 → 미발견 부위 자동 노출 + 다음 단계 진행
    └ 5/5 발견 → Scene Complete
[6] Scene Complete + 가구 보상
    ├ 치즈 풀바디 등장 (또는 살짝 보이기)
    ├ 가구 3중 택1 모달 (해당 Day의 카테고리)
    ├ 선택 → 인테리어 슬롯 업데이트 (애니메이션)
    └ SFX (가구 배치)
[7] 인테리어 화면
    ├ 빈 방 배경 + 채워진 가구 (실시간 합성)
    ├ 진행 게이지 (N/7 카테고리 완성)
    ├ 빈 슬롯 placeholder (회색 실루엣 30% opacity)
    └ [다음 Day로] 또는 [메인 메뉴]
[8] 다음 Day 반복 → 모든 Day 클리어
[9] 시즌 완성 트리거
    ├ 모든 가구 채워짐
    ├ 치즈가 인테리어 가운데 등장 (페이드인)
    ├ Breathing 애니메이션 시작 (살아있는 듯)
    └ 축하 SFX + 완성 메시지
[10] Ending 화면
    ├ "치즈의 일주일 클리어!"
    ├ 시즌 맵 (모든 Day 완료 체크)
    ├ "다음 시즌 Coming Soon" 카드 1장
    ├ [공유하기] 버튼 → html2canvas로 인테리어 캡처 → 다운로드/Web Share
    └ [다시 보기] → 인테리어 화면으로 복귀
```

### 9.1 모바일 프레임 고정

- 모바일 전용 게임. 데스크탑 브라우저에서도 **모바일 프레임 안에서 보이게** 처리
- `max-width: 420px` 컨테이너, 양옆은 배경 (코지 톤 그라데이션 또는 단색)
- viewport: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no`
- 세로 모드 고정 (9:16 비율 유지)

### 9.2 언어

- **한국어 전용**. 영어 미지원
- 텍스트는 한 곳에 모아두기 (`/locales/ko.json` 또는 `constants/strings.ts`) — 추후 다국어 확장 대비

---

## 10. 사운드 (BGM + SFX)

### 10.1 BGM

| 항목          | 값                                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 곡 수         | **1곡** (시즌 1 공통)                                                                                                                    |
| 길이          | 1~2분, 루프 가능                                                                                                                         |
| 톤            | 어쿠스틱 코지 — 가벼운 ukulele/piano/kalimba, 빠르지 않은 4/4 또는 3/4                                                                   |
| 생성 도구     | **Suno AI** (또는 Udio)                                                                                                                  |
| 프롬프트 후보 | "cozy lo-fi acoustic, gentle ukulele, soft piano, warm autumn afternoon, peaceful, no vocals, slow tempo 70 BPM, loopable, instrumental" |
| 트리거        | Title 화면에서 [시작하기] 탭 시 페이드인                                                                                                 |
| 볼륨 컨트롤   | 설정 화면 또는 상단 아이콘                                                                                                               |

### 10.2 SFX (5종 핵심)

| #   | 이름                | 트리거              | 톤                          |
| --- | ------------------- | ------------------- | --------------------------- |
| 1   | `furniture_place`   | 가구 배치 완료      | 폭신한 "퐁" + 살짝 종소리   |
| 2   | `cat_found`         | 부위 탭 성공        | 짧은 야옹 또는 종소리 chime |
| 3   | `interior_complete` | 시즌 모든 가구 채움 | 따뜻한 chime 코드           |
| 4   | `button_tap`        | 모든 버튼 탭        | 짧고 부드러운 click         |
| 5   | `hint_activated`    | 힌트 발동           | 반짝이는 sparkle            |

추가 후순위(P1): `time_warning` (10초 남음 알림), `time_up` (시간 초과), `intro_start` (인트로 진입)

### 10.3 SFX 소스

- **무료 라이브러리**: Pixabay, Freesound, YouTube Audio Library
- 라이센스: CC0 또는 CC-BY (출처 표기 필요한 경우 크레딧 화면에)

### 10.4 오디오 구현

- HTML5 `<audio>` 또는 Web Audio API
- preload: BGM은 metadata, SFX는 auto
- 모바일 정책: 사용자 첫 인터랙션(탭) 이후만 재생 (Safari/Chrome 모바일 정책)
- 음소거 상태 localStorage 저장 (시연 시 음소거 가능 필수)

---

## 11. 인테리어 합성 고도화 룰

> 2026-05-21 결정. "방 인테리어 = 게임의 진짜 목적." 합성을 자연스럽게 + 살아있는 느낌으로.

### 11.1 합성 레이어 z-order

```
z=0: 빈 방 배경
z=1: bed       (가장 아래, 가장 큰 가구)
z=2: rug       (바닥에 깔림)
z=3: chair     (rug 위)
z=4: plant     (창가 또는 코너)
z=5: cushion   (의자 위 또는 단독)
z=6: shelf     (벽면)
z=7: lamp      (가장 위, 빛 발산)
z=8: 치즈      (모든 가구 채워진 후 등장, 가장 위)
```

### 11.2 자연스러운 합성 5요소

1. **Soft Drop Shadow** — 각 가구에 watercolor 톤의 부드러운 그림자 (PNG 알파에 그림자 미리 합성 또는 CSS `filter: drop-shadow(0 2px 4px rgba(92,65,40,0.15))`)
2. **Micro 회전** — 슬롯마다 `rotate(-2deg ~ +2deg)` 랜덤 (load 시 1회 결정, "손으로 둔 듯" 자연스러움)
3. **Slot Placeholder** — 빈 슬롯은 카테고리별 회색 실루엣 PNG (30% opacity) — 시각 단서
4. **Hover Lift (P1)** — 마우스/터치 hover 시 `translateY(-3px)` + 그림자 deepen
5. **Spring 트랜지션** — 가구 놓을 때 `framer-motion spring` 또는 CSS `cubic-bezier(0.34, 1.56, 0.64, 1)` 0.4s

### 11.3 슬롯 좌표 (5씬 Scope 기준)

빈 방 배경 1024×1820 (9:16) 기준 정규화 좌표 (0.0~1.0):

| slot_index | 카테고리                                 | x    | y    | width | height |
| ---------- | ---------------------------------------- | ---- | ---- | ----- | ------ |
| 0          | **plant**                                | 0.78 | 0.30 | 0.18  | 0.20   |
| 1          | **cushion**                              | 0.50 | 0.55 | 0.16  | 0.12   |
| 2          | **rug**                                  | 0.50 | 0.72 | 0.55  | 0.20   |
| 3          | **chair**                                | 0.30 | 0.55 | 0.22  | 0.28   |
| 4          | **shelf**                                | 0.85 | 0.55 | 0.22  | 0.30   |
| 5          | **lamp** _(Phase 2 stretch, Day 6 잠금)_ | 0.15 | 0.40 | 0.14  | 0.22   |
| 6          | **bed** _(Phase 2 stretch, Day 7 잠금)_  | 0.25 | 0.82 | 0.30  | 0.18   |

→ 빈 방 디자인 확정 후 Figma에서 미세 조정.

### 11.4 치즈 등장 트랜지션

- 모든 활성 슬롯(5/5) 채워지면 트리거
- 치즈 등장 위치: rug 위 가운데 (slot_index=2 좌표 기준)
- 트랜지션: opacity 0 → 1 (1.2s) + scale 0.8 → 1 (spring) + 살짝 들썩 (CSS keyframe)
- 등장 직후 SFX `interior_complete` 재생
- 등장 후 즉시 **breathing 애니메이션** 시작 (영구 루프)

### 11.5 Breathing 애니메이션 (치즈 idle)

- 부위 분리 PNG 활용:
  - `cheese_body.png` (몸통, 메인)
  - `cheese_tail.png` (꼬리)
  - `cheese_head.png` (머리, P1)
- **Breathing (P0)**: 몸통 `scale(1 ↔ 1.02)` 3초 주기 ease-in-out 무한 루프
- **Tail wag (P1)**: 꼬리 `rotate(-3deg ↔ +3deg)` 2초 주기 무한 루프 (transform-origin: 꼬리 뿌리)
- **Yawn / Stretch (P2)**: 시간 되면 추가, 8~12초 간격 랜덤 트리거

### 11.6 구현 도구 권고

- **CSS keyframe + transform** (가성비 최고, P0)
- framer-motion (React, spring 효과)
- Lottie / Rive 후순위 (P2)

---

## 12. 게임 메커닉 (시간 제한 + 힌트 + 진행 게이지)

> 2026-05-21 결정. 긴박감 + 광고 수익화 시드.

### 12.1 시간 제한

- **씬당 제한 시간**: 60~90초 (난이도별 조정 가능)
  - Day 1·2 = 60초 (쉬움)
  - Day 3·4 = 75초
  - Day 5 = 90초 (어려움)
- **타이머 UI**: 상단 진행 바 (남은 시간 시각화) + 숫자 (잔여 초)
- **남은 시간 10초**: 색상 변경 (붉은 톤) + SFX `time_warning` (P1)
- **시간 초과 처리**:
  - 미발견 부위 자동 노출 (글로우)
  - 발견한 부위 수에 따라 별 등급 (P2: 1~3별)
  - 다음 단계(Scene Complete) 진행 — 게임 오버 X

### 12.2 힌트 시스템

- **기본 힌트 횟수**: 씬당 **2회**
- **힌트 버튼 위치**: 우측 하단, 전구 아이콘 (남은 횟수 숫자 표시)
- **발동 효과**: 미발견 부위 중 1개 랜덤 위치에 약한 글로우 (3초간) + SFX `hint_activated`
- **광고 확장 (Phase 3)**: 0회 남으면 [광고 시청 후 +1] 버튼 — 해커톤 데모에선 비활성, 향후 수익화 시드

### 12.3 시즌 진행 게이지

- 위치: 상단 (씬 안에서는 잠시 숨김)
- 표시: `Day {n}/{total} · 인테리어 {filled}/{slots} 완성`
- 예: `Day 3/5 · 인테리어 2/5 완성`
- 빈 슬롯 hover/tap → "Day N에 풀려요" tooltip (P1)

### 12.4 메커닉 데이터 (data 모델 확장)

```typescript
// scenes.json 추가 필드
{
  ...
  "time_limit_seconds": 75,
  "hint_count_default": 2,
}

// 게임 진행 상태 (localStorage)
{
  "current_season": "season_001_cheese",
  "current_day": 3,
  "scene_progress": {
    "market_dawn_001": { "completed": true, "time_used_seconds": 38, "hints_used": 0, "stars": 3 },
    "bakery_morning_002": { "completed": true, ... },
    ...
  },
  "interior_slots": {
    "0_plant": "f_plant_pothos_cream",
    "1_cushion": "f_cushion_terra_round",
    ...
  },
  "tutorial_seen": true,
  "audio_muted": false
}
```

---

## 13. 변경 이력

- v1.0 (2026-05-20) — 시즌 1 single source of truth 초안. 단풍이 시장 일주일 + 7카테고리×3 variant + 빈 방 인테리어 + 슬롯 좌표 + 작업 계획 박음.
- **v1.1 (2026-05-20) — 시즌 1 고양이 이름 변경**: 단풍이 → 치즈 (Cheese). season_id `season_001_danpung` → `season_001_cheese`, cat_id `cat_001_danpung` → `cat_001_cheese`, 파일경로·placeholder 모두 cheese로 변경. 파일명 `SEASON_01_DANPUNG.md` → `SEASON_01_CHEESE.md`.
- **v1.2 (2026-05-21) — 해커톤 Scope 확정 + 메커닉 추가** ⭐
  - §3 "14시즌" 자의적 표현 정정 → 시즌 1만 해커톤 제출, 확장 미정
  - §7 일정 전면 갱신 v5: 5/26 기획서 / 6/8 산출물 두 단계, 5씬 Scope, 3씬 우선 + 2씬 stretch, half-day 룰 반영
  - §9 게임 흐름 신설 (Splash → Title → Tutorial → Scene → Interior → Ending)
  - §10 사운드 신설 (BGM 1곡 Suno + SFX 5종)
  - §11 인테리어 합성 고도화 룰 신설 (z-order·shadow·micro 회전·placeholder·hover lift·spring 트랜지션·치즈 등장·breathing)
  - §12 게임 메커닉 신설 (시간 제한 60~90초·힌트 씬당 2회·진행 게이지·광고 수익화 시드)
  - 모바일 프레임 고정 + 한국어 전용 명시
