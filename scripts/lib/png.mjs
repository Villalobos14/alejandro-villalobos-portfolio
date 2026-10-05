/*
 * Minimal PNG writing for the pixel-art scripts: frames are 2D arrays of
 * palette keys (null is transparent), palettes map keys to [r, g, b, a].
 */
import { deflateSync } from "node:zlib";

export const hex = (value) => [
  parseInt(value.slice(1, 3), 16),
  parseInt(value.slice(3, 5), 16),
  parseInt(value.slice(5, 7), 16),
  255,
];

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

export function encodePng(width, height, rgba) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** Lays frames out on a grid, one row of the sheet per array in `rows`. */
export function renderSheet(rows, frameWidth, frameHeight, palette) {
  const columns = Math.max(...rows.map((row) => row.length));
  const width = columns * frameWidth;
  const height = rows.length * frameHeight;
  const rgba = Buffer.alloc(width * height * 4);

  rows.forEach((frames, row) => {
    frames.forEach((frame, column) => {
      frame.forEach((line, y) => {
        line.forEach((key, x) => {
          if (!key) return;
          const offset = ((row * frameHeight + y) * width + column * frameWidth + x) * 4;
          palette[key].forEach((value, channel) => {
            rgba[offset + channel] = value;
          });
        });
      });
    });
  });

  return { width, height, columns, rgba };
}

/** Nearest-neighbour enlargement, for review copies; never used in the site. */
export function upscale({ width, height, rgba }, factor) {
  const out = Buffer.alloc(width * factor * height * factor * 4);
  for (let y = 0; y < height * factor; y += 1) {
    for (let x = 0; x < width * factor; x += 1) {
      rgba.copy(out, (y * width * factor + x) * 4, ((Math.floor(y / factor) * width) + Math.floor(x / factor)) * 4, ((Math.floor(y / factor) * width) + Math.floor(x / factor)) * 4 + 4);
    }
  }
  return { width: width * factor, height: height * factor, rgba: out };
}
