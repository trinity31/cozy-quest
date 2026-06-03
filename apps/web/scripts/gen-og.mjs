// OG 카드 생성 — 1200×630, 코지 톤 (paper/ink/cat). 일회성 스크립트.
// 실행: node apps/web/scripts/gen-og.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, '..', 'public');
const catPath = join(pub, 'cats', 'cat_001_fullbody.png');
const outPath = join(pub, 'og.png');

const W = 1200;
const H = 630;
const FONT = "'Apple SD Gothic Neo', 'AppleGothic', sans-serif";

// 고양이 원판 배치
const DISC_CX = 905;
const DISC_CY = 312;
const DISC_R = 212;
const CAT = 392; // 고양이 이미지 한 변 (원판보다 약간 작게)

const bg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FAEFC8"/>
      <stop offset="100%" stop-color="#EAD09A"/>
    </linearGradient>
    <radialGradient id="glow" cx="75%" cy="42%" r="42%">
      <stop offset="0%" stop-color="#F4B98A" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#F4B98A" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#paper)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- 둥근 ink 프레임 (게임 모달 톤) -->
  <rect x="22" y="22" width="${W - 44}" height="${H - 44}" rx="44"
        fill="none" stroke="#5C4128" stroke-width="6"/>

  <!-- 고양이 원판 -->
  <circle cx="${DISC_CX}" cy="${DISC_CY}" r="${DISC_R}" fill="#F4B98A"/>
  <circle cx="${DISC_CX}" cy="${DISC_CY}" r="${DISC_R}" fill="none" stroke="#5C4128" stroke-width="6"/>

  <!-- 타이틀 -->
  <text x="96" y="256" font-family="${FONT}" font-size="104" font-weight="800"
        fill="#3A2B1C">Cozy Quest</text>

  <!-- 서브카피 -->
  <text x="100" y="332" font-family="${FONT}" font-size="35" font-weight="600"
        fill="#5C4128">아늑한 풍경 속에 숨은 고양이</text>
  <text x="100" y="382" font-family="${FONT}" font-size="35" font-weight="600"
        fill="#5C4128">다섯 마리를 찾는 발견 게임</text>

  <!-- 칩 라벨 -->
  <rect x="100" y="448" width="424" height="64" rx="32"
        fill="#E8945C" stroke="#5C4128" stroke-width="5"/>
  <text x="312" y="489" font-family="${FONT}" font-size="30" font-weight="700"
        fill="#FFFBF0" text-anchor="middle">오늘의 고양이를 만나러 가요</text>
</svg>`;

// 고양이를 원형으로 마스킹
const mask = Buffer.from(
  `<svg width="${CAT}" height="${CAT}"><circle cx="${CAT / 2}" cy="${CAT / 2}" r="${CAT / 2}" fill="#fff"/></svg>`,
);
const cat = await sharp(catPath)
  .resize(CAT, CAT, { fit: 'cover' })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer();

await sharp(Buffer.from(bg))
  .composite([
    { input: cat, left: Math.round(DISC_CX - CAT / 2), top: Math.round(DISC_CY - CAT / 2) },
  ])
  .png()
  .toFile(outPath);

console.log('OK →', outPath);
