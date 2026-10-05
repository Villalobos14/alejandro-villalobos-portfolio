/*
 * Placeholder sheets for the two pets not designed yet. Run
 * `node scripts/pet-sprites.mjs` to rewrite public/pets/pet02.png and
 * pet03.png. Their frame grid is described in
 * src/components/pet-world/world/sprites.ts; keep the two in step.
 *
 * Calcifer is drawn by scripts/calcifer-sprites.mjs.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { encodePng, hex, renderSheet } from "./lib/png.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "pets");

const grid = (width, height, fill = null) =>
  Array.from({ length: height }, () => Array(width).fill(fill));

/* ======================================================================
 * pet02 / pet03: neutral placeholder blobs
 * ==================================================================== */

function inEllipse(x, y, cx, cy, rx, ry) {
  const dx = (x + 0.5 - cx) / rx;
  const dy = (y + 0.5 - cy) / ry;
  return dx * dx + dy * dy <= 1;
}

function blob({ rx = 5.5, ry = 4.2, eyes = "open", look = 0 }) {
  const size = 16;
  const cx = 7.5;
  const cy = size - ry + 0.2;
  const frame = grid(size, size);
  const mask = grid(size, size, false);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) mask[y][x] = inEllipse(x, y, cx, cy, rx, ry);
  }

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!mask[y][x]) continue;
      const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([ox, oy]) => !mask[y + oy]?.[x + ox]);
      if (edge) frame[y][x] = "d";
      else if (inEllipse(x, y, cx - 1.6, cy - 1.6, rx * 0.35, ry * 0.3)) frame[y][x] = "h";
      else frame[y][x] = "g";
    }
  }

  const eyeY = Math.round(cy - 0.5);
  [5 + look, 10 + look].forEach((x) => {
    if (eyes === "closed") {
      frame[eyeY + 1][x] = "d";
      frame[eyeY + 1][x - 1] = "d";
    } else {
      frame[eyeY][x] = "k";
      frame[eyeY + 1][x] = "k";
    }
  });

  return frame;
}

function blobRows() {
  return [
    [blob({ ry: 4.2 }), blob({ ry: 4.0, rx: 5.6 }), blob({ ry: 4.2 }), blob({ ry: 4.4, rx: 5.4 })],
    [blob({ rx: 5.9, ry: 3.8 }), blob({ rx: 5.2, ry: 4.6 }), blob({ rx: 5.9, ry: 3.8 }), blob({ rx: 5.2, ry: 4.6 })],
    [blob({ look: 1 }), blob({ look: 1, ry: 4.4 })],
    [blob({ rx: 6.2, ry: 3.4 }), blob({ rx: 6.2, ry: 3.5 })],
    [blob({ rx: 6.2, ry: 3.2, eyes: "closed" }), blob({ rx: 6.3, ry: 3.4, eyes: "closed" })],
  ];
}

function writeSheet(name, { palette, rows, frameWidth, frameHeight }) {
  const sheet = renderSheet(rows, frameWidth, frameHeight, palette);
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, `${name}.png`), encodePng(sheet.width, sheet.height, sheet.rgba));
  console.log(`public/pets/${name}.png  ${sheet.width}x${sheet.height}  ${sheet.columns} columns x ${rows.length} rows`);
}

const BLOB = { d: hex("#868e96"), g: hex("#ced4da"), h: hex("#f1f3f5"), k: hex("#1a1b1e") };
writeSheet("pet02", { palette: BLOB, rows: blobRows(), frameWidth: 16, frameHeight: 16 });
writeSheet("pet03", {
  palette: { ...BLOB, d: hex("#8f7f63"), g: hex("#d8c7a6"), h: hex("#f3eadb") },
  rows: blobRows(),
  frameWidth: 16,
  frameHeight: 16,
});
