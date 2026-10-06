import { HERO_FIELD_CONFIG as CONFIG, type ModeConfig } from "./config";
import { clamp, smoothstep } from "./math";
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
  /** Lines of small copy the field quiets around. Never used to fit paths. */
  quiet: Box[];
  /** All of `quiet`, grown by the reach, so most glyphs skip the per-line check. */
  quietBounds: Box | null;
}

export function createZones(): Zones {
  return { text: [], quiet: [], quietBounds: null };
}

/** Vertical offset of an entrance still in progress, so zones land where the text comes to rest. */
function restingShift(node: Element): number {
  const host = node.closest("[data-hero-enter]");
  const transform = host ? window.getComputedStyle(host).transform : "none";
  return transform && transform !== "none" ? new DOMMatrix(transform).m42 : 0;
}

/** One box per rendered line of every text node under `root`, so the quiet follows the words, not their block. */
function measureQuiet(root: Element, origin: DOMRect, out: Box[]): void {
  const shiftY = restingShift(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue;
    range.selectNodeContents(node);
    for (const rect of Array.from(range.getClientRects())) {
      if (rect.width < 1 || rect.height < 1) continue;
      out.push({
        left: rect.left - origin.left,
        top: rect.top - origin.top - shiftY,
        right: rect.right - origin.left,
        bottom: rect.bottom - origin.top - shiftY,
      });
    }
  }
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

  zones.quiet.length = 0;
  section?.querySelectorAll("[data-field-quiet]").forEach((node) => measureQuiet(node, origin, zones.quiet));

  const reach = CONFIG.quiet.reach;
  zones.quietBounds = zones.quiet.length
    ? zones.quiet.reduce(
        (bounds, box) => ({
          left: Math.min(bounds.left, box.left - reach),
          top: Math.min(bounds.top, box.top - reach),
          right: Math.max(bounds.right, box.right + reach),
          bottom: Math.max(bounds.bottom, box.bottom + reach),
        }),
        { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity },
      )
    : null;
}

/** `floor` on a quiet line, easing back to 1 over `reach` px around it. */
export function quietFade(zones: Zones, x: number, y: number): number {
  const bounds = zones.quietBounds;
  if (!bounds || x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) return 1;

  const { floor, reach } = CONFIG.quiet;
  let fade = 1;

  for (const box of zones.quiet) {
    const dx = x < box.left ? box.left - x : x > box.right ? x - box.right : 0;
    const dy = y < box.top ? box.top - y : y > box.bottom ? y - box.bottom : 0;
    if (dx === 0 && dy === 0) return floor;
    const distance = Math.hypot(dx, dy);
    if (distance < reach) fade = Math.min(fade, floor + smoothstep(0, reach, distance) * (1 - floor));
  }

  return fade;
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
