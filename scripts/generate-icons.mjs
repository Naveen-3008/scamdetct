import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// CRC32 helper for PNG chunk encoding
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function insideShield(nx, ny) {
  // Normalized coordinates [-1, 1] centered at shield
  if (ny < -0.68 || ny > 0.72) return false;
  let halfWidth;
  if (ny < -0.42) {
    // Top roof slope from (0, -0.68) to (+/-0.54, -0.42)
    const t = (ny - -0.68) / (-0.42 - -0.68);
    halfWidth = 0.54 * t;
  } else if (ny <= 0.05) {
    halfWidth = 0.54;
  } else {
    // Curved bottom taper to (0, 0.72)
    const t = (ny - 0.05) / (0.72 - 0.05);
    halfWidth = 0.54 * Math.pow(Math.max(0, 1 - t * t), 0.68);
  }
  return Math.abs(nx) <= halfWidth;
}

function renderIcon(size, maskable = false) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  const teal = [15, 118, 110]; // #0F766E
  const white = [255, 255, 255];
  const scale = maskable ? 0.72 : 0.88;

  for (let y = 0; y < size; y++) {
    const rowOffset = y * (size * 4 + 1);
    raw[rowOffset] = 0; // filter type 0
    for (let x = 0; x < size; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Normalized [-1, 1]
      const ux = ((x + 0.5) / size) * 2 - 1;
      const uy = ((y + 0.5) / size) * 2 - 1;

      // Rounded rect clip for non-maskable, full bleed for maskable
      let inBg = true;
      if (!maskable) {
        const r = 0.42;
        const qx = Math.max(0, Math.abs(ux) - (1 - r));
        const qy = Math.max(0, Math.abs(uy) - (1 - r));
        inBg = Math.hypot(qx, qy) <= r;
      }

      if (!inBg) {
        raw[pxOffset] = 0;
        raw[pxOffset + 1] = 0;
        raw[pxOffset + 2] = 0;
        raw[pxOffset + 3] = 0;
        continue;
      }

      const sx = ux / scale;
      const sy = uy / scale;

      const isShield = insideShield(sx, sy);

      // Checkmark segments in shield space
      const d1 = distToSegment(sx, sy, -0.22, 0.02, -0.05, 0.19);
      const d2 = distToSegment(sx, sy, -0.05, 0.19, 0.25, -0.14);
      const isCheck = Math.min(d1, d2) <= 0.075;

      let color = teal;
      if (isShield && !isCheck) {
        color = white;
      }

      raw[pxOffset] = color[0];
      raw[pxOffset + 1] = color[1];
      raw[pxOffset + 2] = color[2];
      raw[pxOffset + 3] = 255;
    }
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = zlib.deflateSync(raw, { level: 9 });
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idat),
    makeChunk('IEND', iend),
  ]);
}

const outDir = path.resolve('public');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), renderIcon(192, false));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), renderIcon(512, false));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), renderIcon(512, true));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), renderIcon(180, true));
console.log('Generated ElderShield PNG icons successfully.');
