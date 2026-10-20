import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';

function createPng(width, height) {
  // RGBA buffer
  const rowBytes = width * 4 + 1; // 1 filter byte per scanline
  const buffer = Buffer.alloc(rowBytes * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    buffer[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      // Vibrant modern emerald gradient: from #10b981 to #059669 with a flame/leaf shape in the center
      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Rounded square background
      const isInside = (Math.abs(dx) < 0.85 && Math.abs(dy) < 0.85);

      if (isInside && dist < 0.95) {
        // Gradient color
        const r = Math.floor(16 + (x / width) * 20);
        const g = Math.floor(185 - (y / height) * 35);
        const b = Math.floor(129 + (x / width) * 20);

        // Center white flame/leaf shape
        const isFlame = (dist < 0.45 && (dy > -0.3 || Math.abs(dx) < 0.2));
        if (isFlame) {
          buffer[pixelOffset] = 255;
          buffer[pixelOffset + 1] = 255;
          buffer[pixelOffset + 2] = 255;
          buffer[pixelOffset + 3] = 255;
        } else {
          buffer[pixelOffset] = r;
          buffer[pixelOffset + 1] = g;
          buffer[pixelOffset + 2] = b;
          buffer[pixelOffset + 3] = 255;
        }
      } else {
        buffer[pixelOffset] = 0;
        buffer[pixelOffset + 1] = 0;
        buffer[pixelOffset + 2] = 0;
        buffer[pixelOffset + 3] = 0;
      }
    }
  }

  const deflated = zlib.deflateSync(buffer);

  // CRC32 table
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const chunkData = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(chunkData), 0);
    return Buffer.concat([len, chunkData, crcBuf]);
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bit
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', deflated);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdr, idat, iend]);
}

const iconsDir = path.resolve('public/icons');
fs.mkdirSync(iconsDir, { recursive: true });

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createPng(192, 192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createPng(512, 512));
fs.writeFileSync(path.resolve('public/apple-touch-icon.png'), createPng(180, 180));
fs.writeFileSync(path.resolve('public/favicon.ico'), createPng(32, 32));
console.log('Icons generated successfully!');
