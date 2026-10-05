import { createAmbient, drawAmbient, type AmbientFrame } from "./ambient";
import { HERO_FIELD_CONFIG as CONFIG } from "./config";
import { createZones, measureZones, textFade, verticalMap } from "./layout";
import { clamp } from "./math";
import { createOrganism, drawOrganism, stepGlyphs, type FrameEnv } from "./organism";
import { stepTimeline } from "./timeline";
import { fitOrganism, stepTravel } from "./travel";

export const WIDE_QUERY = "(min-width: 1024px)";

export interface FieldMode {
  /** Three organisms at full density; otherwise two, lighter and slower. */
  wide: boolean;
  /** Fine pointer: parallax and glyph displacement near the cursor. */
  pointer: boolean;
  /** One still frame: no travel, no morphing, no motion, no pointer. */
  reduced: boolean;
}

export interface GlyphField {
  resize: () => void;
  /** Re-measures the headline and refits the paths to it. */
  measure: () => void;
  start: () => void;
  stop: () => void;
  pointer: (clientX: number, clientY: number) => void;
}

export function createGlyphField(canvas: HTMLCanvasElement, mode: FieldMode): GlyphField | null {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return null;
  const ctx = context;

  const config = mode.wide ? CONFIG.modes.wide : CONFIG.modes.compact;
  const entities = mode.reduced ? config.entities.filter((entity) => entity.still) : config.entities;
  const organisms = entities.map((entity, index) => createOrganism(entity, index, 17 + index * 1009, config));
  const ambient = createAmbient(config.ambient);
  const zones = createZones();
  const fade = (x: number, y: number) => textFade(zones, x, y, 0.07);
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, cx: -9999, cy: -9999, last: 0 };

  const env: FrameEnv = {
    time: 0,
    dt: 0,
    width: 0,
    height: 0,
    timing: config.timing,
    motion: mode.reduced ? 0 : config.motion,
    rotation: config.rotation,
    intro: !mode.reduced,
    parallaxX: 0,
    parallaxY: 0,
    pointer: false,
    pointerX: -9999,
    pointerY: -9999,
    veil: (x, y) => textFade(zones, x, y, CONFIG.veil),
    horizon: 0.46,
  };

  const ambientFrame: AmbientFrame = {
    time: 0,
    width: 0,
    height: 0,
    shiftX: 0,
    shiftY: 0,
    pointerX: -9999,
    pointerY: -9999,
    fade,
    organisms,
  };

  let width = 0;
  let height = 0;
  let frame = 0;
  let elapsed = 0;
  let lastNow = 0;

  const draw = (time: number, dt: number) => {
    if (width < 2 || height < 2) return;

    if (mode.pointer && !mode.reduced) {
      if (performance.now() - pointer.last > 160) {
        pointer.targetX += (0 - pointer.targetX) * 0.08;
        pointer.targetY += (0 - pointer.targetY) * 0.08;
      }
      pointer.x += (pointer.targetX - pointer.x) * 0.07;
      pointer.y += (pointer.targetY - pointer.y) * 0.07;
    }

    env.time = time;
    env.dt = dt;
    env.width = width;
    env.height = height;
    env.parallaxX = pointer.x;
    env.parallaxY = pointer.y;
    env.pointer = mode.pointer && !mode.reduced && pointer.cx > -9000;
    env.pointerX = pointer.cx;
    env.pointerY = pointer.cy;
    for (const organism of organisms) {
      stepTimeline(organism, env, organisms);
      stepTravel(organism, env, organisms);
      stepGlyphs(organism, env);
    }

    ctx.clearRect(0, 0, width, height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ambientFrame.time = time;
    ambientFrame.width = width;
    ambientFrame.height = height;
    ambientFrame.shiftX = pointer.x * 2.5;
    ambientFrame.shiftY = pointer.y * 2.2;
    ambientFrame.pointerX = env.pointer ? pointer.cx : -9999;
    ambientFrame.pointerY = env.pointer ? pointer.cy : -9999;
    drawAmbient(ctx, ambient, ambientFrame);

    ctx.fillStyle = "#ffffff";
    for (const organism of organisms) drawOrganism(ctx, organism);
    ctx.globalAlpha = 1;
  };

  const measure = () => {
    measureZones(canvas, zones);
    const map = verticalMap(zones, config, height);
    env.horizon = clamp((map.top + map.bottom) / 2, CONFIG.camera.horizon[0], CONFIG.camera.horizon[1]);
    const r = config.radius;
    const base = clamp(Math.min(width * r.width, height * r.height), r.min, r.max);
    for (const organism of organisms) fitOrganism(organism, width, height, map, base, mode.reduced);
    if (mode.reduced) draw(0, 0);
  };

  const loop = (now: number) => {
    frame = window.requestAnimationFrame(loop);
    // Accumulate only visible time so a hidden tab resumes where it left off.
    const dt = lastNow ? Math.min(0.1, (now - lastNow) / 1000) : 1 / 60;
    lastNow = now;
    elapsed += dt;
    draw(elapsed, dt);
  };

  return {
    resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bufferWidth = Math.floor(width * dpr);
      const bufferHeight = Math.floor(height * dpr);
      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth;
        canvas.height = bufferHeight;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      measure();
    },
    measure,
    start() {
      if (mode.reduced || frame !== 0) return;
      lastNow = 0;
      frame = window.requestAnimationFrame(loop);
    },
    stop() {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = 0;
    },
    pointer(clientX, clientY) {
      if (!mode.pointer || mode.reduced) return;
      const origin = canvas.getBoundingClientRect();
      pointer.targetX = (clientX / (window.innerWidth || 1) - 0.5) * 2;
      pointer.targetY = (clientY / (window.innerHeight || 1) - 0.5) * 2;
      pointer.cx = clientX - origin.left;
      pointer.cy = clientY - origin.top;
      pointer.last = performance.now();
    },
  };
}
