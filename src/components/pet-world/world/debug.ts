import type { WorldSnapshot } from "./world";

/*
 * Development-only overlay, loaded on demand (see PETWORLD_DEBUG). Draws
 * registered surfaces, hero origins, each pet's anchor, state and target, and
 * a readout in the corner. It reads every surface rect each frame, which the
 * real loop never does.
 */

export interface DebugOverlay {
  draw: (snapshot: WorldSnapshot) => void;
  destroy: () => void;
}

const GREEN = "#3dd964";
const GREY = "#777";
const YELLOW = "#ffd43b";
const RED = "#ff6b6b";
const BLUE = "#74c0fc";

export function createDebugOverlay(layer: HTMLElement): DebugOverlay {
  const root = document.createElement("div");
  root.style.cssText = "position:absolute;inset:0;font:10px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace;";
  layer.appendChild(root);

  const readout = document.createElement("pre");
  readout.style.cssText = `position:absolute;left:8px;top:8px;margin:0;padding:6px 8px;background:rgba(0,0,0,.7);color:${GREEN};`;
  root.appendChild(readout);

  const nodes = new Map<string, HTMLElement>();
  let seen = new Set<string>();

  const node = (key: string, css: string) => {
    seen.add(key);
    let element = nodes.get(key);
    if (!element) {
      element = document.createElement("div");
      element.style.cssText = `position:absolute;left:0;top:0;box-sizing:border-box;white-space:nowrap;${css}`;
      root.appendChild(element);
      nodes.set(key, element);
    }
    return element;
  };

  const box = (key: string, rect: DOMRect, color: string, label: string) => {
    const element = node(key, `border:1px dashed ${color};color:${color};padding:1px 3px;`);
    element.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
    element.style.width = `${rect.width}px`;
    element.style.height = `${rect.height}px`;
    element.textContent = label;
  };

  const dot = (key: string, x: number, y: number, color: string, label: string) => {
    const element = node(key, `color:${color};`);
    element.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
    element.innerHTML = `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${color}"></span> ${label}`;
  };

  return {
    draw(snapshot) {
      seen = new Set();

      snapshot.surfaces.forEach((surface) => {
        box(`s:${surface.id}`, surface.rect, surface.visible ? GREEN : GREY, `${surface.type} · ${surface.id}`);
      });
      snapshot.origins.forEach((origin) =>
        box(`o:${origin.id}`, origin.rect, YELLOW, `${origin.id} · ${origin.step}${origin.onScreen ? "" : " (paused)"}`),
      );
      snapshot.pets.forEach((pet) => {
        if (pet.behavior === "hidden" || pet.behavior === "inline") return;
        dot(`p:${pet.id}`, pet.x, pet.y, RED, `${pet.id} · ${pet.behavior}`);
        if (pet.target) dot(`t:${pet.id}`, pet.target.x, pet.target.y, BLUE, `${pet.id} target`);
      });

      nodes.forEach((element, key) => {
        if (seen.has(key)) return;
        element.remove();
        nodes.delete(key);
      });

      readout.textContent = [
        `petworld · ${snapshot.tier}${snapshot.reduced ? " · reduced" : ""}`,
        ...snapshot.pets.map(
          (pet) =>
            `${pet.id.padEnd(9)}${pet.behavior.padEnd(10)}${pet.animation.padEnd(12)}${pet.surface ?? "-"}  ×${pet.scale}  ${
              pet.facing > 0 ? "→" : "←"
            }${pet.script.length ? `  next: ${pet.script.join(", ")}` : ""}`,
        ),
      ].join("\n");
    },
    destroy() {
      root.remove();
      nodes.clear();
    },
  };
}
