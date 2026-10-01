"use client";

import { motion } from "framer-motion";
import { CURTAIN_DURATION_MS, CURTAIN_EASE } from "./timing";

export type CurtainPhase = "entering" | "waiting" | "exiting";

interface CurtainPanelProps {
  phase: CurtainPhase;
  onAnimationComplete: (phase: CurtainPhase) => void;
}

const RADIUS = "40vw";

const covering = {
  y: "0%",
  borderRadius: "0vw 0vw 0vw 0vw",
};

const fromBelow = {
  y: "100%",
  borderRadius: `${RADIUS} ${RADIUS} 0vw 0vw`,
};

const toAbove = {
  y: "-100%",
  borderRadius: `0vw 0vw ${RADIUS} ${RADIUS}`,
};

export default function CurtainPanel({
  phase,
  onAnimationComplete,
}: CurtainPanelProps) {
  const isCovering = phase === "waiting";

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[2147483646]"
      initial={fromBelow}
      animate={phase === "exiting" ? toAbove : covering}
      transition={{
        duration: CURTAIN_DURATION_MS / 1000,
        ease: CURTAIN_EASE,
      }}
      onAnimationComplete={() => onAnimationComplete(phase)}
      style={{
        backgroundColor: "rgb(var(--bg))",
        pointerEvents: isCovering ? "auto" : "none",
      }}
    />
  );
}
