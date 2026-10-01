"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, type ComponentProps, type MouseEvent } from "react";
import { isSamePath, useCurtain } from "./CurtainProvider";

function hrefToString(href: ComponentProps<typeof NextLink>["href"]): string {
  if (typeof href === "string") return href;

  const path = href.pathname ?? "";
  const hash = href.hash ? href.hash.replace(/^#/, "") : "";

  return hash ? `${path}#${hash}` : path;
}

function readHash(href: string): string {
  const index = href.indexOf("#");

  return index === -1 ? "" : href.slice(index + 1);
}

function isHashOnly(href: string): boolean {
  return href.startsWith("#");
}

function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:|tel:|\/\/)/i.test(href);
}

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  const target = event.currentTarget.getAttribute("target");

  return (
    (target !== null && target !== "_self") ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.nativeEvent.button === 1
  );
}

export function TransitionLink(props: ComponentProps<typeof NextLink>) {
  const pathname = usePathname();
  const { isTransitioning, prefersReducedMotion, navigateWithCurtain } =
    useCurtain();
  const { href, onClick } = props;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      if (isModifiedClick(event)) return;

      const destination = hrefToString(href);
      if (!destination || isHashOnly(destination) || isExternalHref(destination)) {
        return;
      }

      const hash = readHash(destination);

      if (isSamePath(destination, pathname)) {
        if (!hash) {
          event.preventDefault();
          return;
        }

        const target = document.getElementById(hash);

        if (!target) return;

        event.preventDefault();
        window.history.replaceState(null, "", `#${hash}`);
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
        return;
      }

      if (prefersReducedMotion) return;

      event.preventDefault();
      if (isTransitioning) return;
      navigateWithCurtain(destination);
    },
    [
      href,
      isTransitioning,
      navigateWithCurtain,
      onClick,
      pathname,
      prefersReducedMotion,
    ],
  );

  return <NextLink {...props} onClick={handleClick} />;
}
