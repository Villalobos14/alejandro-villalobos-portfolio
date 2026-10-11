export default function Heading({ title }: { title: string }) {
  return (
    <>
      <h1 className="text-5xl uppercase font-medium text-ink-muted">
        {title}
      </h1>
    </>
  );
}
