"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import {
  homeNarrativeContent,
  type TimelineImageLayout,
  type TimelineItem,
} from "@/lib/home-narrative";
import { usePrefersReducedMotion } from "./desktop-motion";

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

const DESKTOP_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const CURVE_EASE = "cubic-bezier(0.22, 0.8, 0.24, 1)";
const DOT_COUNT = 30;
const CURVE_MS = 680;

const items = homeNarrativeContent.timelineItems;

function layoutsFor(id: string): TimelineImageLayout[] {
  const layouts = homeNarrativeContent.collageLayouts;

  if (id in layouts) return layouts[id as keyof typeof layouts];

  return [];
}

function useTimelineDesktop(): boolean {
  const [enabled, setEnabled] = useState(false);

  useLayoutEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setEnabled(query.matches);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  return enabled;
}

function milestoneX(index: number, count: number, width: number): number {
  const pad = Math.max(72, width * 0.08);

  if (count <= 1) return width / 2;

  return pad + (index / (count - 1)) * (width - pad * 2);
}

function curveY(x: number, activeX: number, width: number, height: number): number {
  const baseY = height * 0.8;
  const amplitude = Math.min(170, Math.max(120, height * 0.58));
  const spread = Math.max(90, width * 0.105);

  return baseY - amplitude * Math.exp(-((x - activeX) ** 2) / (2 * spread * spread));
}

function curvePath(width: number, height: number, activeX: number): string {
  const steps = Math.max(64, Math.round(width / 10));
  let path = "";

  for (let step = 0; step <= steps; step += 1) {
    const x = (step / steps) * width;
    const y = curveY(x, activeX, width, height);
    path += step === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }

  return path;
}

function easeOut(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

function ProfileLink() {
  return (
    <TransitionLink
      href="/about"
      className={`inline-flex min-h-11 items-center text-body text-ink ${focusStyles}`}
    >
      Explore the professional profile ↗
    </TransitionLink>
  );
}

function Photo({ src, label }: { src: string; label: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-end bg-ink/10 p-3 text-[15px] font-medium uppercase tracking-[0.08em] text-ink">
        {label}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function CollageFrame({
  item,
  layouts,
  exiting,
  reduced,
  boxWidth,
}: {
  item: TimelineItem;
  layouts: TimelineImageLayout[];
  exiting: boolean;
  reduced: boolean;
  boxWidth: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root || reduced) return;

    const photos = Array.from(root.querySelectorAll<HTMLElement>("[data-photo-motion]"));

    photos.forEach((photo, index) => {
      const enterY = index % 2 === 0 ? 36 : -28;
      photo.animate(
        exiting
          ? [
              { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
              { opacity: 0, transform: `translate3d(0, ${enterY}px, 0) scale(0.94)` },
            ]
          : [
              { opacity: 0, transform: `translate3d(0, ${enterY}px, 0) scale(0.93)` },
              { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
            ],
        {
          duration: exiting ? 320 : 560,
          delay: exiting ? 0 : index * 55,
          easing: CURVE_EASE,
          fill: exiting ? "forwards" : "backwards",
        },
      );
    });
  }, [exiting, reduced, item.id]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      {item.images.map((src, index) => {
        const layout = layouts[index];

        if (!layout || boxWidth < 1) return null;

        const width = (layout.width / 100) * boxWidth;
        const height = Math.min(width / layout.aspectRatio, boxWidth > 800 ? 210 : 240);
        const rotation = hovered === index ? layout.rotation * 0.2 : layout.rotation;

        return (
          <div
            key={`${item.id}-${index}`}
            className="absolute"
            style={{
              left: `${layout.x}%`,
              top: `${layout.y}%`,
              width,
              height,
              zIndex: hovered === index ? 30 : layout.zIndex,
            }}
          >
            <div data-photo-motion className="h-full w-full">
              <div data-drift="" className="h-full w-full">
                <div
                  className="h-full w-full overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
                  style={{
                    borderRadius: 22 + (index % 4) * 4,
                    transform: `rotate(${rotation}deg) scale(${hovered === index ? 1.03 : 1})`,
                    transition: reduced ? "none" : "transform 320ms cubic-bezier(0.22, 0.8, 0.24, 1)",
                  }}
                  onPointerEnter={() => setHovered(index)}
                  onPointerLeave={() => setHovered(null)}
                >
                  <Photo src={src} label={item.fallback} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MilestoneCopy({
  item,
  reduced,
  lift = true,
  size = "desktop",
}: {
  item: TimelineItem;
  reduced: boolean;
  lift?: boolean;
  size?: "desktop" | "mobile";
}) {
  // Every chapter shares one grid cell, so the cell is always as tall as the
  // tallest chapter at the current width (resize and font loads included).
  return (
    <div aria-live="polite" className="grid max-w-[400px]">
      {items.map((entry) => {
        const isActive = entry.id === item.id;

        return (
          <div
            key={entry.id}
            aria-hidden={isActive ? undefined : true}
            className="col-start-1 row-start-1"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive || !lift ? "translate3d(0, 0, 0)" : "translate3d(0, 10px, 0)",
              pointerEvents: isActive ? undefined : "none",
              userSelect: isActive ? undefined : "none",
              transition: reduced ? "none" : "opacity 220ms ease, transform 220ms ease",
            }}
          >
            <p className="text-mono-s text-ink-muted">{entry.shortLabel}</p>
            <p
              className={`mt-2 font-medium leading-snug text-ink ${
                size === "mobile" ? "text-[22px]" : "text-[24px]"
              }`}
            >
              {entry.title}
            </p>
            <p
              className={`mt-2 text-ink-secondary ${
                size === "mobile" ? "text-[15px] leading-snug" : "text-body"
              }`}
            >
              {entry.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function DesktopScene({ reduced }: { reduced: boolean }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const zonesRef = useRef({ titleBottom: 0, limitBottom: 0, width: 0, xs: [] as number[] });
  const activeXRef = useRef(0);
  const pointerLockRef = useRef(0);
  const animRef = useRef<{ from: number; to: number; start: number } | null>(null);
  const frameRef = useRef(0);
  const outgoingTimerRef = useRef(0);
  const [active, setActive] = useState(0);
  const [outgoingId, setOutgoingId] = useState<string | null>(null);
  const [boxWidth, setBoxWidth] = useState(0);
  const activeRef = useRef(0);

  useEffect(
    () => () => {
      window.clearTimeout(outgoingTimerRef.current);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      animRef.current = null;
    },
    [],
  );

  const draw = useCallback((xPos: number) => {
    const curve = curveRef.current;
    const path = pathRef.current;

    if (!curve || !path) return;

    const width = curve.clientWidth;
    const height = curve.clientHeight;

    if (width < 2 || height < 2) return;

    const svg = path.ownerSVGElement;
    svg?.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg?.setAttribute("preserveAspectRatio", "none");
    path.setAttribute("d", curvePath(width, height, xPos));

    const dots = curve.querySelectorAll<HTMLElement>("[data-curve-dot]");

    dots.forEach((dot, index) => {
      const x = ((index + 0.5) / dots.length) * width;
      const y = curveY(x, xPos, width, height);
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    });

    const buttons = curve.querySelectorAll<HTMLElement>("[data-milestone]");

    buttons.forEach((button, index) => {
      const x = milestoneX(index, items.length, width);
      const y = curveY(x, xPos, width, height);
      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
    });

    const years = curve.querySelectorAll<HTMLElement>("[data-year]");
    const baseY = height * 0.8;

    years.forEach((year, index) => {
      const x = milestoneX(index, items.length, width);
      year.style.left = `${x}px`;
      year.style.top = `${baseY + 36}px`;
    });

  }, []);

  const startLoop = useCallback(() => {
    if (frameRef.current) return;

    const tick = (now: number) => {
      frameRef.current = 0;
      const anim = animRef.current;

      if (!anim) return;

      const progress = Math.min(1, (now - anim.start) / CURVE_MS);
      activeXRef.current = anim.from + (anim.to - anim.from) * easeOut(progress);
      draw(activeXRef.current);

      if (progress < 1 && !document.hidden) {
        frameRef.current = window.requestAnimationFrame(tick);
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);
  }, [draw]);

  const moveHill = useCallback(
    (index: number, immediate: boolean) => {
      const curve = curveRef.current;

      if (!curve) return;

      const next = milestoneX(index, items.length, curve.clientWidth);

      if (immediate || reduced) {
        animRef.current = null;
        activeXRef.current = next;
        draw(next);
        return;
      }

      animRef.current = {
        from: activeXRef.current,
        to: next,
        start: performance.now(),
      };
      startLoop();
    },
    [draw, reduced, startLoop],
  );

  const activate = useCallback(
    (index: number, focusButton = false, fromPointer = false) => {
      const next = Math.min(items.length - 1, Math.max(0, index));

      if (next === activeRef.current) return;

      if (!fromPointer) pointerLockRef.current = performance.now() + 80;

      const previous = items[activeRef.current];

      if (previous) {
        setOutgoingId(previous.id);
        window.clearTimeout(outgoingTimerRef.current);
        outgoingTimerRef.current = window.setTimeout(() => {
          setOutgoingId((currentId) => (currentId === previous.id ? null : currentId));
        }, reduced ? 0 : 420);
      }

      activeRef.current = next;
      setActive(next);

      moveHill(next, false);

      if (focusButton) {
        curveRef.current?.querySelectorAll<HTMLButtonElement>("[data-milestone]")[next]?.focus();
      }
    },
    [moveHill, reduced],
  );

  useLayoutEffect(() => {
    const curve = curveRef.current;
    const collage = collageRef.current;

    if (!curve) return;

    const measure = () => {
      if (collage) setBoxWidth(collage.clientWidth);

      const scene = sceneRef.current;
      const title = titleRef.current;

      if (scene && title) {
        const width = curve.clientWidth;
        zonesRef.current = {
          titleBottom: title.offsetTop + title.offsetHeight,
          limitBottom: scene.clientHeight - 88,
          width,
          xs: items.map((_, index) => milestoneX(index, items.length, width)),
        };
      }

      const x = milestoneX(activeRef.current, items.length, curve.clientWidth);

      if (animRef.current) {
        animRef.current = {
          from: activeXRef.current,
          to: x,
          start: performance.now(),
        };
        startLoop();
        return;
      }

      activeXRef.current = x;
      draw(x);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(curve);
    if (sceneRef.current) observer.observe(sceneRef.current);
    if (titleRef.current) observer.observe(titleRef.current);
    if (collage) observer.observe(collage);
    if (copyRef.current) observer.observe(copyRef.current);

    let disposed = false;
    document.fonts?.ready.then(() => {
      if (!disposed) measure();
    });

    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [draw, startLoop]);

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) return;

    let frame = 0;
    const point = { x: 0, y: 0, ignore: false };

    const resolve = () => {
      frame = 0;

      if (point.ignore || performance.now() < pointerLockRef.current) return;

      const rect = scene.getBoundingClientRect();
      const localX = point.x - rect.left;
      const localY = point.y - rect.top;
      const zones = zonesRef.current;

      if (localY <= zones.titleBottom || localY >= zones.limitBottom) return;
      if (localX < 0 || localX > zones.width) return;

      let next = activeRef.current;

      for (let index = 0; index < zones.xs.length; index += 1) {
        const x = zones.xs[index] ?? 0;
        const previous = zones.xs[index - 1] ?? 0;
        const following = zones.xs[index + 1] ?? zones.width;
        const left = index === 0 ? 0 : (previous + x) / 2;
        const right = index === zones.xs.length - 1 ? zones.width : (x + following) / 2;

        if (localX >= left && localX < right) {
          next = index;
          break;
        }
      }

      if (next !== activeRef.current) activate(next, false, true);
    };

    const onMove = (event: PointerEvent) => {
      const target = event.target;
      point.ignore = target instanceof Element && Boolean(target.closest("a"));
      point.x = event.clientX;
      point.y = event.clientY;

      if (frame) return;

      frame = window.requestAnimationFrame(resolve);
    };

    scene.addEventListener("pointermove", onMove);

    return () => {
      scene.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [activate]);

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene || reduced) return;

    let frame = 0;
    let visible = true;

    const drifts = () => Array.from(scene.querySelectorAll<HTMLElement>("[data-drift]"));

    const loop = (now: number) => {
      if (!visible || document.hidden) {
        frame = 0;
        return;
      }

      drifts().forEach((node, index) => {
        const x = Math.cos(now / 1700 + index * 0.8) * 4;
        const y = Math.sin(now / 1400 + index * 1.1) * 6;
        node.style.translate = `${x}px ${y}px`;
      });
      frame = window.requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);

      if (visible) {
        if (!frame) frame = window.requestAnimationFrame(loop);
      } else if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    });

    const onVisibility = () => {
      if (document.hidden && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else if (!document.hidden && visible && !frame) {
        frame = window.requestAnimationFrame(loop);
      }
    };

    observer.observe(scene);
    frame = window.requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced, active]);

  useEffect(() => {
    const neighbors = [items[active - 1], items[active + 1]];

    neighbors.forEach((item) => {
      item?.images.forEach((src) => {
        const image = new Image();
        image.src = src;
      });
    });
  }, [active]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      activate(Math.min(items.length - 1, index + 1), true);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      activate(Math.max(0, index - 1), true);
    } else if (event.key === "Home") {
      event.preventDefault();
      activate(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      activate(items.length - 1, true);
    }
  };

  const current = items[active] ?? items[0];
  const outgoing = items.find((item) => item.id === outgoingId);

  if (!current) return null;

  return (
    <div ref={sceneRef} className="relative flex min-h-[100svh] w-full flex-col overflow-x-clip">
      <div ref={titleRef} className="h-0 shrink-0" />
      <div ref={collageRef} aria-hidden="true" className="relative mt-6 h-[34vh] min-h-[200px] shrink-0 overflow-visible">
        {outgoing ? (
          <CollageFrame
            item={outgoing}
            layouts={layoutsFor(outgoing.id)}
            exiting
            reduced={reduced}
            boxWidth={boxWidth}
          />
        ) : null}
        <CollageFrame
          item={current}
          layouts={layoutsFor(current.id)}
          exiting={false}
          reduced={reduced}
          boxWidth={boxWidth}
        />
      </div>
      <div ref={copyRef} className="relative z-[4] mx-auto mt-8 w-[min(420px,calc(100%-3rem))]">
        <MilestoneCopy item={current} reduced={reduced} />
      </div>
      <div ref={curveRef} className="relative z-[2] mt-12 h-[220px] w-full shrink-0">
        <svg className="pointer-events-none absolute inset-0 z-[2] h-full w-full" aria-hidden="true">
          <path ref={pathRef} fill="none" stroke="rgb(var(--accent))" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {Array.from({ length: DOT_COUNT }, (_, index) => (
          <span
            key={index}
            data-curve-dot
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 size-1 rounded-full bg-ink-muted"
          />
        ))}
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            data-milestone
            aria-current={index === active ? "step" : undefined}
            aria-label={`${item.year}. ${item.title}`}
            tabIndex={index === active ? 0 : -1}
            className={`absolute left-0 top-0 z-30 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full ${focusStyles}`}
            onPointerEnter={() => activate(index)}
            onFocus={() => activate(index)}
            onClick={() => activate(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span
              aria-hidden="true"
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                index === active ? "size-2 bg-accent" : "size-1 bg-ink-muted"
              }`}
            />
          </button>
        ))}
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            data-year
            tabIndex={-1}
            className={`absolute min-h-11 -translate-x-1/2 px-2 font-sans text-[14px] font-medium tracking-normal ${focusStyles} ${
              index === active ? "text-accent" : "text-ink-muted"
            }`}
            onClick={() => activate(index)}
          >
            {item.year}
          </button>
        ))}
      </div>
    </div>
  );
}

function MobileCurve({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (index: number) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const widthRef = useRef(0);
  const activeRef = useRef(active);
  const gestureRef = useRef({ x: 0, y: 0, dragging: false });

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const draw = useCallback((index: number) => {
    const width = widthRef.current;
    const path = pathRef.current;
    const box = boxRef.current;

    if (!path || !box || width < 1) return;

    const height = box.clientHeight;
    const x = milestoneX(index, items.length, width);

    path.setAttribute("d", curvePath(width, height, x));

    box.querySelectorAll<HTMLElement>("[data-curve-dot]").forEach((dot, dotIndex) => {
      const px = (dotIndex / (DOT_COUNT - 1)) * width;
      const py = curveY(px, x, width, height);
      dot.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;
    });
  }, []);

  useLayoutEffect(() => {
    const box = boxRef.current;

    if (!box) return;

    const measure = () => {
      widthRef.current = box.clientWidth;
      draw(activeRef.current);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);

    return () => observer.disconnect();
  }, [draw]);

  useEffect(() => {
    draw(active);
  }, [active, draw]);

  const pick = (clientX: number) => {
    const box = boxRef.current;

    if (!box) return;

    const rect = box.getBoundingClientRect();
    const localX = clientX - rect.left;
    const width = rect.width;
    const xs = items.map((_, index) => milestoneX(index, items.length, width));
    let next = activeRef.current;

    for (let index = 0; index < xs.length; index += 1) {
      const x = xs[index] ?? 0;
      const previous = xs[index - 1] ?? 0;
      const following = xs[index + 1] ?? width;
      const left = index === 0 ? 0 : (previous + x) / 2;
      const right = index === xs.length - 1 ? width : (x + following) / 2;

      if (localX >= left && localX < right) {
        next = index;
        break;
      }
    }

    if (next !== activeRef.current) onSelect(next);
  };

  return (
    <div
      ref={boxRef}
      className="relative h-[132px] w-full touch-pan-y overflow-hidden"
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        gestureRef.current = { x: event.clientX, y: event.clientY, dragging: false };
      }}
      onPointerMove={(event) => {
        const gesture = gestureRef.current;
        const dx = event.clientX - gesture.x;
        const dy = event.clientY - gesture.y;

        if (!gesture.dragging) {
          if (Math.hypot(dx, dy) < 6) return;
          if (Math.abs(dy) > Math.abs(dx)) return;

          gesture.dragging = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }

        pick(event.clientX);
      }}
      onPointerUp={() => {
        gestureRef.current.dragging = false;
      }}
      onPointerCancel={() => {
        gestureRef.current.dragging = false;
      }}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <path ref={pathRef} fill="none" stroke="rgb(var(--accent))" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {Array.from({ length: DOT_COUNT }, (_, index) => (
        <span
          key={index}
          data-curve-dot
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 size-1 rounded-full bg-ink-muted"
        />
      ))}
    </div>
  );
}

function MobileScene({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  if (!current) return null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 pt-2">
      <div className="mobile-bleed flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
        {current.images.map((src, index) => (
          <div
            key={`${current.id}-${index}`}
            className="h-[150px] w-[46%] shrink-0 snap-start overflow-hidden rounded-[22px]"
          >
            <div
              className="h-full w-full"
              style={{ transform: `rotate(${index % 2 === 0 ? -2.5 : 2}deg) scale(1.08)` }}
            >
              <Photo src={src} label={current.fallback} />
            </div>
          </div>
        ))}
      </div>
      <MilestoneCopy item={current} reduced={reduced} lift={false} size="mobile" />
      <MobileCurve active={active} onSelect={setActive} />
      <div role="group" aria-label="Timeline years" className="flex justify-between gap-1">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-current={index === active ? "step" : undefined}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center px-1 font-sans text-[14px] font-medium tracking-normal ${focusStyles} ${
              index === active ? "text-accent" : "text-ink-muted"
            }`}
            onClick={() => setActive(index)}
          >
            {item.year}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HomeTimeline() {
  const desktop = useTimelineDesktop();
  const reduced = usePrefersReducedMotion();

  return (
    <div className="min-w-0">
      {desktop ? <DesktopScene reduced={reduced} /> : <MobileScene reduced={reduced} />}
      <div className="pb-2 pt-3 md:pb-4 md:pt-8">
        <ProfileLink />
      </div>
    </div>
  );
}
