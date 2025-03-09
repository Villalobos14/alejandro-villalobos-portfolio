export default function Heading({ title }: { title: string }) {
  return (
    <>
      <h2 className="text-5xl uppercase font-medium text-gray">
        {title}
      </h2>
    </>
  );
}
