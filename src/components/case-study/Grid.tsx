import type { ReactNode } from "react";

interface GridProps {
  columns?: 2 | 3;
  children: ReactNode;
}

const COLUMN_CLASSES: Record<2 | 3, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

export default function Grid({ columns = 3, children }: GridProps) {
  return (
    <div className={`grid grid-cols-1 gap-stack ${COLUMN_CLASSES[columns]}`}>
      {children}
    </div>
  );
}
