import type { ReactNode } from "react";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import { caseFocus, prose } from "./styles";

export function ChapterIntro({
  id,
  kicker,
  statement,
}: {
  id?: string;
  kicker: string;
  statement: string;
}) {
  return (
    <header id={id} className="scroll-mt-20 max-w-3xl pt-16 md:pt-24">
      <p className="text-xs uppercase tracking-[0.18em] text-white/55">{kicker}</p>
      <h2 className="mt-3 text-balance text-[clamp(1.7rem,3vw,2.55rem)] font-medium leading-[1.15] tracking-tight text-white">
        {statement}
      </h2>
    </header>
  );
}

export function EditorialSplit({
  kicker,
  title,
  children,
  visual,
  reverse = false,
}: {
  kicker?: string;
  title: string;
  children: ReactNode;
  visual: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-8">
      <div className={reverse ? "lg:col-span-5 lg:col-start-8" : "lg:col-span-5"}>
        {kicker ? (
          <p className="text-xs uppercase tracking-[0.18em] text-gray">{kicker}</p>
        ) : null}
        <h3 className={`${kicker ? "mt-4" : ""} text-balance text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium leading-[1.15] tracking-tight text-white`}>
          {title}
        </h3>
        <div className={`mt-6 space-y-5 ${prose}`}>{children}</div>
      </div>
      <div className={reverse ? "lg:col-span-7 lg:col-start-1 lg:row-start-1" : "lg:col-span-7"}>
        {visual}
      </div>
    </div>
  );
}

export function InsightBreak({
  kicker,
  statement,
  children,
}: {
  kicker: string;
  statement: string;
  children?: ReactNode;
}) {
  return (
    <section className="py-8 md:py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-secondary">{kicker}</p>
      <p className="mt-6 max-w-5xl text-balance text-[clamp(1.8rem,4vw,3.4rem)] font-medium leading-[1.12] tracking-tight text-white">
        {statement}
      </p>
      {children}
    </section>
  );
}

export function NextProject({
  kicker,
  index,
  title,
  framing,
  href,
}: {
  kicker: string;
  index: string;
  title: string;
  framing?: string;
  href?: string;
}) {
  const body = (
    <>
      <p className="text-xs uppercase tracking-[0.18em] text-gray">{kicker}</p>
      <p className="mt-6 text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[0.98] tracking-tight text-white">
        <span className="mr-4 text-white/45">{index}</span>
        {title}
      </p>
      {framing ? <p className={`mt-6 ${prose}`}>{framing}</p> : null}
    </>
  );

  if (!href) {
    return <section className="border-t border-gray/40 py-20 md:py-28">{body}</section>;
  }

  return (
    <TransitionLink
      href={href}
      className={`block border-t border-gray/40 py-20 md:py-28 ${caseFocus}`}
    >
      {body}
    </TransitionLink>
  );
}
