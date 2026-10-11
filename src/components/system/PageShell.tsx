import type { ReactNode } from "react";
import TopBar from "@/components/system/TopBar";

/** Home frame: the cutting-mat ruler, then the route. The dock stays in the layout. */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg text-ink">
      <TopBar />
      {children}
    </div>
  );
}
