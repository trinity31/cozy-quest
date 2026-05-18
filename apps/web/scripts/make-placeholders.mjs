// Day 1 placeholder 생성 — 외부 의존성 없이 zlib + Buffer로 PNG 5장 작성
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[i] = c >>> 0;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}
function makeSolidPng(w, h, r, g, b) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;   // 8-bit depth
  ihdr[9] = 2;   // truecolor RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const stride = 1 + w * 3;
  const raw = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    raw[y * stride] = 0; // filter: none
    for (let x = 0; x < w; x++) {
      const p = y * stride + 1 + x * 3;
      raw[p] = r;
      raw[p + 1] = g;
      raw[p + 2] = b;
    }
  }
  const idat = zlib.deflateSync(raw);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// 색상은 PRD 의도(베이지 풍경, 오렌지 단팥 등)에 맞춰 구분만 되게.
// 실제 크기는 next/image fill로 늘어나므로 작은 비율 유지 크기로 충분.
const targets = [
  { rel: 'public/scenes/market_dawn_001.png',  w: 108, h: 192, rgb: [240, 220, 180] }, // 9:16 베이지
  { rel: 'public/cats/cat_001_fullbody.png',   w: 64,  h: 64,  rgb: [240, 140,  60] }, // 1:1 오렌지(단팥)
  { rel: 'public/furniture/chair_rattan.png',  w: 64,  h: 64,  rgb: [180, 140,  80] }, // 등나무 브라운
  { rel: 'public/furniture/chair_fabric.png',  w: 64,  h: 64,  rgb: [120, 160, 200] }, // 패브릭 블루
  { rel: 'public/furniture/chair_rocking.png', w: 64,  h: 64,  rgb: [180, 100, 100] }, // 흔들 코럴
];

for (const t of targets) {
  const full = path.join(root, t.rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  const buf = makeSolidPng(t.w, t.h, ...t.rgb);
  fs.writeFileSync(full, buf);
  console.log('wrote', t.rel, `${buf.length}B (${t.w}x${t.h})`);
}
