import type { PetId, SpriteDefinition } from "./types";
import { snapScale } from "./view";

/**
 * text:       the real letter, as server-rendered
 * mascot:     the letter is transparent (it still holds its place) and the pet is drawn over it
 * dissolving: the pet is still drawn while the letter fades back in beneath it
 * released:   the pet has gone; only the letter remains
 */
export type GlyphMode = "text" | "mascot" | "dissolving" | "released";

/** A letter of the page a pet starts life in. */
export interface GlyphOrigin {
  petId: PetId;
  /** Span around the real character. It never leaves the DOM or the accessible name. */
  glyph: HTMLElement;
  /** aria-hidden element the inline sprite is painted on. */
  sprite: HTMLElement;
  character: string;
  /** `fadeMs` fades the letter in, and on release also fades out a sprite that is still showing. */
  setMode: (mode: GlyphMode, fadeMs?: number) => void;
}

export function createGlyphOrigin(
  petId: PetId,
  glyph: HTMLElement,
  sprite: HTMLElement,
  character: string,
): GlyphOrigin {
  return {
    petId,
    glyph,
    sprite,
    character,
    setMode(mode, fadeMs = 0) {
      glyph.dataset.petGlyph = mode;

      if (mode === "mascot") {
        glyph.style.transition = "";
        glyph.style.color = "transparent";
        sprite.style.transition = "";
        sprite.style.opacity = "";
        sprite.style.display = "block";
        return;
      }

      // Bring the letter back, unless it already is.
      if (glyph.style.color) {
        glyph.style.transition = fadeMs > 0 ? `color ${fadeMs}ms ease-out` : "";
        glyph.style.color = "";
      }

      if (mode === "dissolving" || sprite.style.display === "none") return;

      if (fadeMs > 0 && mode === "released") {
        sprite.style.transition = `opacity ${fadeMs}ms ease-out`;
        sprite.style.opacity = "0";
        window.setTimeout(() => {
          if (glyph.dataset.petGlyph === "released") sprite.style.display = "none";
        }, fadeMs);
        return;
      }

      sprite.style.display = "none";
    },
  };
}

export interface GlyphFit {
  /** CSS pixels per sprite pixel, a whole number of device pixels. */
  scale: number;
  /** Sprite position inside the glyph's inline box. */
  left: number;
  top: number;
}

let measure: CanvasRenderingContext2D | null = null;

/**
 * Fits the sprite's `body` box over the letter's ink: scaled as far as `fit`
 * allows by width and by height, centred on the letter and standing where
 * its ink ends at the bottom, so he sits on the baseline like the letter
 * and any extra height rises above it. The canvas measures the ink box from
 * the text's start and baseline; an inline box starts at the font's ascent
 * above the baseline, which the canvas reports as fontBoundingBoxAscent, so
 * the two line up without touching the DOM.
 */
export function fitGlyph(
  origin: GlyphOrigin,
  sprite: SpriteDefinition,
  fit: { width: number; height: number },
): GlyphFit | null {
  if (origin.glyph.getBoundingClientRect().width === 0) return null;

  measure ??= document.createElement("canvas").getContext("2d");
  if (!measure) return null;

  const style = window.getComputedStyle(origin.glyph);
  measure.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const ink = measure.measureText(origin.character);
  const body = sprite.body ?? { x: 0, y: 0, width: sprite.frameWidth, height: sprite.frameHeight };

  const inkWidth = ink.actualBoundingBoxLeft + ink.actualBoundingBoxRight;
  const inkHeight = ink.actualBoundingBoxAscent + ink.actualBoundingBoxDescent;
  const scale = snapScale(Math.min((inkWidth * fit.width) / body.width, (inkHeight * fit.height) / body.height));
  const inkCenterX = (ink.actualBoundingBoxRight - ink.actualBoundingBoxLeft) / 2;
  const inkBottom = ink.fontBoundingBoxAscent + ink.actualBoundingBoxDescent;

  return {
    scale,
    left: inkCenterX - (body.x + body.width / 2) * scale,
    top: inkBottom - (body.y + body.height) * scale,
  };
}
