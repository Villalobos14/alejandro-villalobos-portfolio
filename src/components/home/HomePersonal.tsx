"use client";

import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import { homeNarrativeContent } from "@/lib/home-narrative";
import { useFinePointer } from "@/lib/fine-pointer";
import { MarkerSentence } from "./MarkerSentence";
import { usePrefersReducedMotion } from "./desktop-motion";

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const BASE_SIZE = 56;

function MemeMark() {
  const { src, alt } = homeNarrativeContent.personalMeme;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pinned = useRef(false);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const [origin, setOrigin] = useState("left top");
  const [scale, setScale] = useState(1);
  const [tilt, setTilt] = useState(1.5);
  const overlay = open && (!fine || reduced);

  const place = () => {
    const node = buttonRef.current;

    if (!node) return;

    const rect = node.getBoundingClientRect();
    const target = 300;
    const spaceRight = window.innerWidth - rect.left - 16;
    const spaceLeft = rect.right - 16;
    const growRight = spaceRight >= spaceLeft;
    const spaceX = growRight ? spaceRight : spaceLeft;
    const spaceBelow = window.innerHeight - rect.top - 16;
    const spaceAbove = rect.bottom - 16;
    const growDown = spaceBelow >= spaceAbove;
    const spaceY = growDown ? spaceBelow : spaceAbove;
    const fit = Math.max(BASE_SIZE, Math.min(target, spaceX, spaceY));

    setOrigin(`${growRight ? "left" : "right"} ${growDown ? "top" : "bottom"}`);
    setScale(fit / BASE_SIZE);
  };

  const close = () => {
    pinned.current = false;
    setOpen(false);
    setTilt(1.5);
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      close();
      buttonRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);

    if (overlay) closeRef.current?.focus();

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, overlay]);

  const visual = (
    <>
      {status !== "missing" ? (
        <img
          src={src}
          alt=""
          draggable={false}
          className={status === "ready" ? "h-full w-full object-cover" : "hidden"}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("missing")}
        />
      ) : null}
      {status !== "ready" ? (
        <span className="px-1 text-center text-[8px] font-medium uppercase leading-tight tracking-[0.12em] text-gray">
          MEME PLACEHOLDER
        </span>
      ) : null}
    </>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={alt}
        aria-expanded={open}
        className={`relative mx-1 inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray/40 bg-primary align-middle lg:size-14 ${
          open ? "z-30 shadow-[0_16px_40px_rgba(0,0,0,0.45)]" : "z-[1]"
        } ${focusStyles}`}
        style={{
          transform: open && fine && !reduced ? `scale(${scale}) rotate(${tilt}deg)` : "scale(1) rotate(1.5deg)",
          transformOrigin: origin,
          transition: reduced ? "none" : "transform 360ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        onPointerEnter={() => {
          if (!fine || reduced) return;

          place();
          window.requestAnimationFrame(() => setOpen(true));
        }}
        onPointerLeave={() => {
          if (!fine || reduced || pinned.current) return;

          close();
        }}
        onPointerMove={(event) => {
          if (!open || !fine || reduced) return;

          const rect = buttonRef.current?.getBoundingClientRect();

          if (!rect || rect.width < 1) return;

          const ratio = (event.clientX - rect.left) / rect.width - 0.5;
          setTilt(Math.max(-2, Math.min(2, ratio * 4)));
        }}
        onFocus={() => {
          if (!fine || reduced) return;

          place();
          setOpen(true);
        }}
        onBlur={() => {
          if (!fine || reduced || pinned.current) return;

          close();
        }}
        onClick={() => {
          if (!fine || reduced) {
            setOpen((value) => !value);
            return;
          }

          pinned.current = !pinned.current;
          if (pinned.current) {
            place();
            setOpen(true);
          } else {
            close();
          }
        }}
      >
        {visual}
      </button>
      {overlay ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-6"
          onClick={close}
        >
          <div
            className="relative flex h-[min(78vw,320px)] w-[min(78vw,320px)] items-center justify-center overflow-hidden rounded-md border border-gray/40 bg-primary"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className={`absolute right-3 top-3 z-10 text-sm text-white ${focusStyles}`}
              onClick={close}
            >
              Close
            </button>
            <button type="button" aria-label={alt} className="flex h-full w-full items-center justify-center" onClick={close}>
              {visual}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function HomePersonal() {
  return (
    <div className="flex flex-col gap-16">
      <MarkerSentence
        as="div"
        segments={homeNarrativeContent.personalStatement.segments}
        textClassName="text-[clamp(1.7rem,7vw,3rem)] font-medium leading-[1.12] tracking-tight lg:text-[clamp(2rem,4vw,4.25rem)]"
        meme={<MemeMark />}
      />
      <ul className="grid grid-cols-1 gap-10 px-[var(--page-gutter)] sm:grid-cols-2">
        {homeNarrativeContent.personalPreview.map((item) => (
          <li key={item.label} className="border-t border-gray/40 pt-4">
            <p className="text-body uppercase tracking-[0.18em] text-gray">{item.label}</p>
            <p className="mt-3 max-w-md text-xl text-white md:text-2xl">{item.value}</p>
          </li>
        ))}
      </ul>
      <div className="px-[var(--page-gutter)]">
        <TransitionLink
          href="/fun"
          className={`group inline-flex min-h-11 items-center gap-3 rounded-full border border-gray/40 px-5 py-3 text-label text-white transition-colors duration-300 fine:hover:border-secondary fine:hover:bg-secondary/10 ${focusStyles}`}
        >
          See the personal side
          <ArrowUpRightIcon
            aria-hidden="true"
            className="pointer-events-none size-4 transition-transform duration-300 ease-out fine:group-hover:translate-x-1 fine:group-hover:-translate-y-1"
          />
        </TransitionLink>
      </div>
    </div>
  );
}
