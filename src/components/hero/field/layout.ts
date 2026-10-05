import type { ModeConfig } from "./config";
import { clamp } from "./math";
import type { VerticalMap } from "./paths";

export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** Where the headline sits over the field, in canvas coordinates. */
export interface Zones {
  /** Headline lines: the background dims under them and paths are drawn against them. */
  text: Box[];
}

export function createZones(): Zones {
  return { text: [] };
}

export function measureZones(canvas: HTMLCanvasElement, zones: Zones): void {
  const origin = canvas.getBoundingClientRect();
  zones.text.length = 0;

  const section = canvas.closest("section");
  section?.querySelectorAll("h1 > span > span").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rect = range.getBoundingClientRect();
    const transform = window.getComputedStyle(node).transform;
    // Lines may still be mid reveal; measure where they come to rest.
    const shiftY = transform && transform !== "none" ? new DOMMatrix(transform).m42 : 0;
    zones.text.push({
      left: rect.left - origin.left,
      top: rect.top - origin.top - shiftY,
      right: rect.right - origin.left,
      bottom: rect.bottom - origin.top - shiftY,
    });
  });
}

/** 1 in the open, easing down to `floor` within 32px of a headline line and under it. */
export function textFade(zones: Zones, x: number, y: number, floor: number): number {
  let fade = 1;

  for (const box of zones.text) {
    const dx = x < box.left ? box.left - x : x > box.right ? x - box.right : 0;
    const dy = y < box.top ? box.top - y : y > box.bottom ? y - box.bottom : 0;
    if (dx === 0 && dy === 0) return floor;
    const distance = Math.hypot(dx, dy);
    if (distance < 32) fade = Math.min(fade, floor + (distance / 32) * (1 - floor));
  }

  return fade;
}

/** Stretches path heights so what was drawn above, across or below the headline stays there. */
export function verticalMap(zones: Zones, mode: ModeConfig, height: number): VerticalMap {
  const { top: refTop, bottom: refBottom } = mode.textRef;
  let top = Number.POSITIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;
  for (const box of zones.text) {
    top = Math.min(top, box.top);
    bottom = Math.max(bottom, box.bottom);
  }
  if (!Number.isFinite(top) || height <= 0 || bottom - top < 8) return { refTop, refBottom, top: refTop, bottom: refBottom };
  const start = clamp(top / height, 0.05, 0.9);
  return { refTop, refBottom, top: start, bottom: clamp(bottom / height, start + 0.02, 0.98) };
}
