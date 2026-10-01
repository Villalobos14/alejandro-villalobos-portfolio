import { Children, isValidElement, type ReactNode } from "react";

interface OutcomesProps {
  label?: string;
  children: ReactNode;
}

interface OutcomeItemProps {
  title: string;
  children?: ReactNode;
}

function OutcomeItem({ title, children }: OutcomeItemProps) {
  return (
    <li className="flex flex-col gap-2 border-t border-gray/40 pt-scale">
      <h4 className="text-label text-white">{title}</h4>
      {children ? (
        <div className="text-body text-gray">{children}</div>
      ) : null}
    </li>
  );
}

function OutcomesRoot({ label = "Results and learnings", children }: OutcomesProps) {
  const count = Children.toArray(children).filter(isValidElement).length;

  if (count === 0) {
    throw new Error("Outcomes expects at least one item");
  }

  return (
    <section className="flex flex-col gap-scale">
      <p className="text-body uppercase tracking-[0.2em] text-gray">{label}</p>
      <ul className="grid grid-cols-1 gap-scale md:grid-cols-2">{children}</ul>
    </section>
  );
}

const Outcomes = Object.assign(OutcomesRoot, { Item: OutcomeItem });

export default Outcomes;
