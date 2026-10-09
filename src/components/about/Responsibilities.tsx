"use client";

import { useId, useState } from "react";
import { focusRing, tone } from "./tone";

/**
 * The bullets after the first one. From md up they are always listed; below md
 * they sit behind a disclosure button so each role stays short on a phone.
 */
export default function Responsibilities({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (items.length === 0) return null;

  return (
    <>
      <ul className={`hidden max-w-2xl flex-col gap-2 text-body md:flex ${tone.secondary}`}>
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-white/40" />
            {item}
          </li>
        ))}
      </ul>

      <div className="md:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className={`inline-flex min-h-11 items-center gap-2 rounded-full text-body uppercase tracking-[0.1em] text-white/85 ${focusRing}`}
        >
          <span
            aria-hidden="true"
            className={`inline-block text-base leading-none text-secondary transition-transform duration-200 motion-reduce:transition-none ${
              open ? "rotate-45" : ""
            }`}
          >
            +
          </span>
          {open ? "Hide responsibilities" : `${items.length} more responsibilities`}
        </button>
        {/*
          display is set only while open: a `flex` utility on a [hidden] element
          beats the browser's display:none and keeps the closed panel in the
          layout and the accessibility tree.
        */}
        <ul
          id={panelId}
          hidden={!open}
          className={`mt-2 flex-col gap-2 text-body ${open ? "flex" : "hidden"} ${tone.secondary}`}
        >
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-white/40" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
