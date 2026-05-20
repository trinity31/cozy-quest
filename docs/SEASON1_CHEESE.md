# 🍂 Season 01 — 치즈의 일주일 (Single Source of Truth)

> 시즌 1 양산 마스터 문서. 7씬 배경 + 7카테고리×3 variant 가구 + 빈 방 인테리어 + 슬롯 좌표 + 미드저니 프롬프트 전체.
> 작성: 2026-05-20 (W21 Day 3)
> 의존: [GAME_RULES.md v1.6](./GAME_RULES.md) · [IMAGE_PROMPTS.md](./IMAGE_PROMPTS.md) · [PRD.md](./PRD.md)

---

## 0. 시즌 1 메타

| 항목 | 값 |
|------|-----|
| `season_id` | `season_001_cheese` |
| 고양이 | **치즈 (Cheese)** — warm cheese-ginger tabby with white chest patch |
| 컬러 코드 | base `#E8945C` / stripes `#C97A3E` / chest `#FFFBF0` |
| 7씬 모티프 | 시장 일주일 (시장 → 빵집 → 꽃집 → 찻집 → 어물전 → 야시장 → 우천) |
| 7 가구 카테고리 | plant · cushion · rug · chair · shelf · lamp · bed |
| 인테리어 컨셉 | **치즈의 따뜻한 시장 골목 방** — caramel orange + cream + sage + terracotta |

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

| 부위 | SIZE | 마스킹 사물 후보 |
|------|------|------------------|
| `tail` | 300×300 | 통/항아리/커튼/빵바구니 |
| `ear` | 300×300 | 바구니/지붕/상자 |
| `paw` | 300×300 | 벤치/계단/문틈 |
| `face` | 400×400 | 창문/아치/가게 입구 |
| `back` (둥근 풀바디) | 400×400 | 지붕/처마/벤치 위 |

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

> 🎁 **시즌 1 = 베이스 풀 형성**: 여기서 만든 21 variant는 **모든 시즌 영구 베이스 풀**이 됨 ([GAME_RULES K.6](./GAME_RULES.md) 옵션 C 점진 확장). 시즌 2부터는 `베이스 + 시즌 신규 1~2`로 3중 택1 구성. 14시즌 누적 풀 ~50~80 variant 목표.

### Day 1 · plant (식물) — `furniture/plant/*.png`

| # | 파일명 | 프롬프트 |
|---|--------|---------|
| 01 | `plant_01_olive_terra.png` | a terracotta pot #D96B47 holding a small olive tree with silvery sage leaves #A8C49A, three tones watercolor, no shadow background |
| 02 | `plant_02_pothos_cream.png` | a cream ceramic round pot #FAEFC8 holding a trailing pothos vine with deep sage leaves #7BA084 |
| 03 | `plant_03_primrose_clay.png` | a hand-thrown brown clay pot with three pink primrose blooms #E8B4B8 |

공통 추가:
```
[STYLE_PREFIX 풀버전]
3/4 front-side angle, single object centered, TRANSPARENT BACKGROUND, 
minimum 32px padding, soft watercolor base shadow only.
--sref [Day 1 URL] --sw 1000 --ar 1:1 --style raw --v 7
--no cat, animal, second object, scenery, text, drop shadow, 3D
```

### Day 2 · cushion (쿠션) — `furniture/cushion/*.png`

| # | 파일명 | 핵심 묘사 |
|---|--------|----------|
| 01 | `cushion_01_cream_leaf.png` | plump square linen cushion in cream #F5E5B8, small embroidered sage green #A8C49A leaf in corner |
| 02 | `cushion_02_terra_round.png` | round velvet-feel cushion in deep terracotta #D96B47, braided rope trim around edge |
| 03 | `cushion_03_sage_stripe.png` | soft cushion with vertical stripes sage #A8C49A + cream #F5E5B8, two small tassels at bottom corners |

### Day 3 · rug (러그) — `furniture/rug/*.png`

| # | 파일명 | 핵심 묘사 |
|---|--------|----------|
| 01 | `rug_01_caramel_stripe.png` | small woven rug, cream + caramel stripes #FAEFC8 #E8945C, viewed slight angle, fringe at both ends |
| 02 | `rug_02_braided_sage.png` | round braided rug in sage and olive tones #A8C49A #A6BC5C, spiral weave pattern |
| 03 | `rug_03_folk_pink.png` | folk pattern rug, diamond + flower motif in pink #E8B4B8 and terracotta #D96B47 on cream ground |

### Day 4 · chair (의자) — `furniture/chair/*.png`

| # | 파일명 | 핵심 묘사 |
|---|--------|----------|
| 01 | `chair_01_rattan.png` | hand-woven rattan armchair with curved back, natural wicker tones #B69770 |
| 02 | `chair_02_fabric.png` | small wooden chair with soft sage-green #A8C49A fabric seat cushion |
| 03 | `chair_03_rocking.png` | wooden rocking chair with cream wool throw blanket #FAEFC8 draped over the back |

### Day 5 · shelf (선반) 🆕 — `furniture/shelf/*.png`

| # | 파일명 | 핵심 묘사 |
|---|--------|----------|
| 01 | `shelf_01_books_warm.png` | small wooden bookshelf with leather-bound books in warm caramel tones #C97A3E and cream covers, two small potted plants on top |
| 02 | `shelf_02_dishes_ceramic.png` | wooden dish rack/shelf with hand-thrown ceramic mugs, plates, and bowls in cream #FAEFC8 and terracotta #D96B47 |
| 03 | `shelf_03_wallhung_simple.png` | a small wall-mounted wooden floating shelf with three small jars #F5E5B8 and a single sprig of dried lavender |

### Day 6 · lamp (등불) — `furniture/lamp/*.png`

| # | 파일명 | 핵심 묘사 |
|---|--------|----------|
| 01 | `lamp_01_honey_classic.png` | classic honey-amber cloth shade table lamp with brass-tone base, soft warm bulb glow #E8C56C |
| 02 | `lamp_02_cream_paper.png` | cream paper lantern (Japanese-style) hanging on wooden frame, soft diffuse glow #FAEFC8 |
| 03 | `lamp_03_terra_brazier.png` | terracotta clay brazier oil lamp with small flame, warm orange-red glow #D96B47 |

### Day 7 · bed (침대/베드) 🆕 — `furniture/bed/*.png`

| # | 파일명 | 핵심 묘사 |
|---|--------|----------|
| 01 | `bed_01_rattan_round.png` | round woven rattan cat bed with thick cream cushion #FAEFC8 inside, natural wicker tones #B69770 |
| 02 | `bed_02_canopy_cozy.png` | small fabric canopy bed (tent-style cat bed) in cream linen #F5E5B8 with sage trim #A8C49A |
| 03 | `bed_03_quilted_floor.png` | thick quilted floor bed/pillow in terracotta #D96B47 with cream stitching, plump round shape |

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

| slot_index | 카테고리 | 위치 | x_ratio | y_ratio | width | height |
|-----------|---------|------|---------|---------|-------|--------|
| 0 | **plant** | 창가 바닥 | 0.78 | 0.30 | 0.18 | 0.20 |
| 1 | **cushion** | 의자 위 (chair 슬롯 위 겹침 OK) | 0.50 | 0.55 | 0.16 | 0.12 |
| 2 | **rug** | 방 중앙 바닥 | 0.50 | 0.72 | 0.55 | 0.20 |
| 3 | **chair** | 좌측 중앙 | 0.30 | 0.55 | 0.22 | 0.28 |
| 4 | **shelf** | 우측 벽 (코너 nook) | 0.85 | 0.55 | 0.22 | 0.30 |
| 5 | **lamp** | 좌측 벽 sconce 또는 책상 위 | 0.15 | 0.40 | 0.14 | 0.22 |
| 6 | **bed** | 좌하단 구석 | 0.25 | 0.82 | 0.30 | 0.18 |

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
      { "id": "f_plant_olive_terra",   "name": "올리브 (테라코타)", "image_url": "/furniture/plant/plant_01_olive_terra.png" },
      { "id": "f_plant_pothos_cream",  "name": "포토스 (크림)",   "image_url": "/furniture/plant/plant_02_pothos_cream.png" },
      { "id": "f_plant_primrose_clay", "name": "프림로즈 (클레이)", "image_url": "/furniture/plant/plant_03_primrose_clay.png" }
    ],
    "parts": [
      { "part_id": "p001_fullbody", "type": "fullbody", "x": 0.78, "y": 0.72, "radius": 0.035 },
      { "part_id": "p001_face",     "type": "face",     "x": 0.55, "y": 0.06, "radius": 0.05 },
      { "part_id": "p001_tail_l",   "type": "tail",     "x": 0.15, "y": 0.18, "radius": 0.045 },
      { "part_id": "p001_tail_c",   "type": "tail",     "x": 0.55, "y": 0.21, "radius": 0.045 },
      { "part_id": "p001_tail_m",   "type": "tail",     "x": 0.20, "y": 0.55, "radius": 0.045 }
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
- [ ] Day 2 빵집 골목 배경 + cushion 3 variant
- [ ] Day 3 꽃집 처마 배경 + rug 3 variant
- [ ] Day 4 찻집 정원 배경 + chair 3 variant
- [ ] Day 5 시장 골목 배경 + shelf 3 variant 🆕
- [ ] Day 6 달빛 야시장 배경 + lamp 3 variant
- [ ] Day 7 비 오는 처마 배경 + bed 3 variant 🆕

### 6.3 총 자산 수
- 베이스: 1(고양이) + 5(부위) + 1(빈 방) + 7(placeholder) = **14개**
- 씬: 7(배경) + 21(가구 variant) = **28개**
- **합계 = 42개 PNG**

---

## 7. W21 진행 계획 (D-6, 5/20~5/26)

| Day | 작업 | 진척 목표 |
|-----|------|----------|
| 5/20 (수) Day 3 | ✅ Day 1 클로징, ⏳ Day 2 빵집 배경 + cushion 3종 | Day 2 자산 완성 |
| 5/21 (목) Day 4 | Day 3 꽃집 배경 + rug 3종 + 빈 방 디자인 시작 | Day 3 + 빈 방 1차 |
| 5/22 (금) Day 5 | Day 4 찻집 + chair 3종, 합성 로직 코딩 | Day 4 + 코드 |
| 5/23 (토) Day 6 | Day 5 어물전 + shelf 3종, dogfood Day 1~3 | Day 5 + 검증 |
| 5/24 (일) Day 7 | 일요일 회복 / 미드저니 만 (코딩 X, CLAUDE.md 룰) | Day 6 자산만 |
| 5/25 (월) Day 8 | Day 7 비 처마 + bed 3종, 인테리어 화면 통합 | 시즌 전체 자산 완성 |
| 5/26 (화) Day 9 | dogfood 풀세트 + 해커톤 제출 | 🏆 제출 |

**부분 완성 OK 룰**: 시간 부족하면 Day 1~5만 완성하고 해커톤 제출. Day 6~7은 W22 보강. **dogfood 가능한 최소선 = Day 1~3 + 인테리어 빈 방 + plant·cushion·rug 9 variant**.

---

## 8. 변경 이력

- v1.0 (2026-05-20) — 시즌 1 single source of truth 초안. 단풍이 시장 일주일 + 7카테고리×3 variant + 빈 방 인테리어 + 슬롯 좌표 + 작업 계획 박음.
- **v1.1 (2026-05-20) — 시즌 1 고양이 이름 변경**: 단풍이 → 치즈 (Cheese). season_id `season_001_danpung` → `season_001_cheese`, cat_id `cat_001_danpung` → `cat_001_cheese`, 파일경로·placeholder 모두 cheese로 변경. 파일명 `SEASON_01_DANPUNG.md` → `SEASON_01_CHEESE.md`.