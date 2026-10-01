function Step({ index, label }: { index: string; label: string }) {
  return (
    <li className="flex items-baseline gap-4 border-t border-white/15 py-3">
      <span className="w-8 shrink-0 text-xs tracking-[0.14em] text-white/45">{index}</span>
      <span className="text-sm text-white">{label}</span>
    </li>
  );
}

export function SystemDiagram() {
  return (
    <figure className="max-w-3xl">
      <figcaption className="text-sm leading-6 text-white/70">
        Analyzers can differ internally. The interface only needs a shared description of what a result means.
      </figcaption>
      <ol className="mt-6">
        <Step index="01" label="Repository" />
        <Step index="02" label="Shared analysis context — one parse, reused by every analyzer" />
        <Step index="03" label="Independent analyzers — Pylint, Radon, cohesion, and structure checks" />
        <Step index="04" label="AnalysisResult — severity, file diagnosis, evidence, recommendation" />
        <Step index="05" label="The same results experience, whichever analyzer produced the finding" />
      </ol>
    </figure>
  );
}
