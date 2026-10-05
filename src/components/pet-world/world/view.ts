import type { SpriteFrame } from "./sprites";
import type { SpriteDefinition } from "./types";

/*
 * The only code that writes pet styles. Each writer remembers what it last
 * wrote and touches the DOM only when a value changes, so a pet standing
 * still costs nothing per frame.
 */

/**
 * The nearest scale to `target` (CSS pixels per sprite pixel) that is a whole
 * number of device pixels, so every sprite pixel lands on the same number of
 * screen pixels: 2 on a standard display, 1.5 or 2 on a 2x one.
 */
export function snapScale(target: number): number {
  const ratio = window.devicePixelRatio || 1;
  return Math.max(1, Math.round(target * ratio)) / ratio;
}

export interface SpriteView {
  /** `scale` should come from snapScale. */
  paint: (frame: SpriteFrame, scale: number) => void;
}

/** Paints one frame of a sheet as a pixelated background, sized by width and height rather than a transform so pixels stay hard-edged. */
export function createSpriteView(element: HTMLElement, sprite: SpriteDefinition): SpriteView {
  let scale = Number.NaN;
  let row = -1;
  let column = -1;
  let flip: boolean | null = null;

  element.style.backgroundImage = `url("${sprite.image}")`;
  element.style.backgroundRepeat = "no-repeat";
  element.style.imageRendering = "pixelated";

  return {
    paint(frame, nextScale) {
      if (nextScale !== scale) {
        scale = nextScale;
        element.style.width = `${sprite.frameWidth * scale}px`;
        element.style.height = `${sprite.frameHeight * scale}px`;
        element.style.backgroundSize = `${sprite.columns * sprite.frameWidth * scale}px ${
          sprite.rows * sprite.frameHeight * scale
        }px`;
        row = -1;
      }

      if (frame.row !== row || frame.column !== column) {
        row = frame.row;
        column = frame.column;
        element.style.backgroundPosition = `${-column * sprite.frameWidth * scale}px ${
          -row * sprite.frameHeight * scale
        }px`;
      }

      if (frame.flip !== flip) {
        flip = frame.flip;
        element.style.transform = flip ? "scaleX(-1)" : "";
      }
    },
  };
}

export interface PetView {
  sprite: SpriteView;
  show: (visible: boolean) => void;
  /** Top-left of the frame in viewport pixels; snapped to device pixels so sprite pixels never straddle two. */
  place: (left: number, top: number) => void;
  /** Hides this many pixels off the bottom of the frame, for sinking behind an edge. */
  clip: (bottom: number) => void;
  opacity: (value: number) => void;
}

export function createPetView(root: HTMLElement, spriteElement: HTMLElement, sprite: SpriteDefinition): PetView {
  let visible: boolean | null = null;
  let x = Number.NaN;
  let y = Number.NaN;
  let clipped = -1;
  let alpha = -1;

  return {
    sprite: createSpriteView(spriteElement, sprite),
    show(next) {
      if (next === visible) return;
      visible = next;
      root.style.visibility = next ? "visible" : "hidden";
    },
    place(left, top) {
      const ratio = window.devicePixelRatio || 1;
      const nextX = Math.round(left * ratio) / ratio;
      const nextY = Math.round(top * ratio) / ratio;
      if (nextX === x && nextY === y) return;
      x = nextX;
      y = nextY;
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    clip(bottom) {
      const next = Math.max(0, Math.round(bottom));
      if (next === clipped) return;
      clipped = next;
      root.style.clipPath = next > 0 ? `inset(0 0 ${next}px 0)` : "";
    },
    opacity(value) {
      const next = Math.round(value * 100) / 100;
      if (next === alpha) return;
      alpha = next;
      root.style.opacity = next < 1 ? String(next) : "";
    },
  };
}
