import { Children, isValidElement, type ReactNode } from "react";

export interface ImpactMetric {
  value: ReactNode;
  label: string;
}

interface ImpactProps {
  children: ReactNode;
}

function ImpactMetricItem({ value, label }: ImpactMetric) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="sr-only">{label}</dt>
      <dd className="flex flex-col gap-2">
        <span className="text-display text-secondary">{value}</span>
        <span className="text-body text-gray">{label}</span>
      </dd>
    </div>
  );
}

function ImpactRoot({ children }: ImpactProps) {
  const count = Children.toArray(children).filter(isValidElement).length;

  if (count < 2 || count > 4) {
    throw new Error(`Impact expects between 2 and 4 metrics, received ${count}`);
  }

  return (
    <dl className="grid grid-cols-1 gap-stack border-y border-gray/40 py-stack sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </dl>
  );
}

const Impact = Object.assign(ImpactRoot, {
  Metric: ImpactMetricItem,
});

export default Impact;
