const IS_PRODUCTION = process.env.NODE_ENV === "production";

interface PlaceholderProps {
  label: string;
}

/** Content slot marker. Renders nothing in production builds. */
export default function Placeholder({ label }: PlaceholderProps) {
  if (IS_PRODUCTION) return null;

  return (
    <p className="rounded-lg border border-dashed border-gray px-3 py-2 text-body text-gray">
      Pendiente: {label}
    </p>
  );
}

export { IS_PRODUCTION };
