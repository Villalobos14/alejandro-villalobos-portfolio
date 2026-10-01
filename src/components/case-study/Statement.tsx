import type { ElementType, ReactNode } from "react";

interface StatementProps {
  children: ReactNode;
}

interface StatementHeadlineProps extends StatementProps {
  as?: ElementType;
}

function StatementRoot({ children }: StatementProps) {
  return <div className="flex flex-col gap-scale">{children}</div>;
}

function StatementHeadline({
  as: Tag = "h3",
  children,
}: StatementHeadlineProps) {
  return <Tag className="max-w-3xl text-body-lg text-white">{children}</Tag>;
}

function StatementBody({ children }: StatementProps) {
  return (
    <div className="max-w-3xl text-body text-gray">{children}</div>
  );
}

const Statement = Object.assign(StatementRoot, {
  Headline: StatementHeadline,
  Body: StatementBody,
});

export default Statement;
