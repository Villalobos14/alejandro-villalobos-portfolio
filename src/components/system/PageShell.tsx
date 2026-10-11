import type { ReactNode } from "react";
import TopBar from "@/components/system/TopBar";

/** Cutting-mat ruler, then the route. Home opts out. The dock stays in the layout. */
export default function PageShell({
  children,
  topBar = true,
}: {
  children: ReactNode;
  topBar?: boolean;
}) {
  return (
    <div className="bg-bg text-ink">
      {topBar ? <TopBar /> : null}
      {children}
    </div>
  );
}
