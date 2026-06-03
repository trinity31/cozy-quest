// 파비콘/앱 아이콘 생성 — 고양이 얼굴 크롭 + 둥근사각 코지 배경.
// app/icon.png (512), app/apple-icon.png (180) 생성. 일회성 스크립트.
// 실행: node apps/web/scripts/gen-icon.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const catPath = join(root, 'public', 'cats', 'cat_001_fullbody.png');

const S = 512; // 아이콘 한 변
const PAD = 24; // 배경 안쪽 여백
const RX = 116; // 둥근사각 반경

// 코지 톤 둥근사각 배경
const bg = Buffer.from(
  `<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FAEFC8"/>
        <stop offset="100%" stop-color="#F4D58A"/>
      </linearGradient>
    </defs>
    <rect x="${PAD}" y="${PAD}" width="${S - PAD * 2}" height="${S - PAD * 2}"
          rx="${RX}" fill="url(#paper)" stroke="#5C4128" stroke-width="14"/>
  </svg>`,
);

// 고양이 얼굴(+귀) 크롭 → 배경 중앙에 합성
const face = await sharp(catPath)
  .extract({ left: 82, top: 44, width: 340, height: 340 })
  .resize(404, 404)
  .png()
  .toBuffer();

const FACE_LEFT = Math.round((S - 404) / 2);
const FACE_TOP = 70; // 귀 위 여백 확보 + 살짝 위로

// 합성된 512 결과를 버퍼로 확정한 뒤 리사이즈
// (sharp는 resize를 composite보다 먼저 적용하므로 같은 파이프라인에서 줄이면 안 됨)
const icon512 = await sharp(bg)
  .composite([{ input: face, left: FACE_LEFT, top: FACE_TOP }])
  .png()
  .toBuffer();

await sharp(icon512).toFile(join(root, 'app', 'icon.png'));
await sharp(icon512).resize(180, 180).toFile(join(root, 'app', 'apple-icon.png'));

console.log('OK → app/icon.png (512), app/apple-icon.png (180)');
