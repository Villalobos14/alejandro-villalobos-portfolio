const MONO =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

const ROWS = 34;
const COLS = 92;

/** Edges fade out so the glyph block reads as a field, not a pasted rectangle. */
const FIELD_MASK =
  "radial-gradient(120% 100% at 50% 45%, #000 0%, #000 52%, rgba(0,0,0,0.45) 78%, transparent 100%)";

export interface MediaPlaceholderProps {
  /** Slot index, shown top-left. */
  index?: string;
  /** What the slot will hold once the asset exists. */
  title?: string;
  /** One supporting line under the title. */
  detail?: string;
  /** Short chips along the bottom edge. */
  tags?: string[];
  /** Status line at the bottom. */
  footer?: string;
  /** Varies the field so two slots on one page do not look identical. */
  seed?: string;
  className?: string;
}

function hashSeed(seed: string): number {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/** Deterministic so the server and client render the same field. */
function makeRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds two aligned glyph layers from the hero's `· + * #` vocabulary: a dim
 * base and a sparse accent pass. Density follows a soft centre and a diagonal
 * band so the field has structure rather than flat noise.
 */
function buildField(seed: string): { base: string; accent: string } {
  const random = makeRandom(hashSeed(seed));
  const centreX = 0.3 + random() * 0.4;
  const centreY = 0.32 + random() * 0.36;
  const tilt = (random() - 0.5) * 1.4;
  const baseRows: string[] = [];
  const accentRows: string[] = [];

  for (let row = 0; row < ROWS; row += 1) {
    let baseRow = "";
    let accentRow = "";

    for (let col = 0; col < COLS; col += 1) {
      const u = col / (COLS - 1);
      const v = row / (ROWS - 1);
      const core = Math.exp(
        -((u - centreX) ** 2 / 0.2 + (v - centreY) ** 2 / 0.1),
      );
      const band = 0.5 + 0.5 * Math.sin((u * 3.1 + v * tilt) * Math.PI);
      const density = core * 0.78 + band * 0.26;
      const roll = random();

      let glyph = " ";

      if (roll < density * 0.1) glyph = "#";
      else if (roll < density * 0.28) glyph = "*";
      else if (roll < density * 0.56) glyph = "+";
      else if (roll < density * 0.95) glyph = "·";

      const accented = glyph === "#" && random() < 0.26;

      baseRow += accented ? "  " : `${glyph} `;
      accentRow += accented ? `${glyph} ` : "  ";
    }

    baseRows.push(baseRow);
    accentRows.push(accentRow);
  }

  return { base: baseRows.join("\n"), accent: accentRows.join("\n") };
}

/**
 * The resting state of any media slot whose asset does not exist yet. Absence is
 * the normal case here: nothing about this renders as a failure, and a slot
 * becomes an image the moment a `src` is handed to `Media`.
 */
export default function MediaPlaceholder({
  index,
  title,
  detail,
  tags,
  footer,
  seed = "slot",
  className = "",
}: MediaPlaceholderProps) {
  const field = buildField(seed);
  const layerStyles =
    "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-pre text-[clamp(7px,1vw,11px)] leading-[1.45]";
  const layerStyle = {
    fontFamily: MONO,
    WebkitMaskImage: FIELD_MASK,
    maskImage: FIELD_MASK,
  } as const;

  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden bg-primary p-5 sm:p-7 ${className}`}
    >
      <div aria-hidden="true">
        <pre className={`${layerStyles} text-white/[0.14]`} style={layerStyle}>
          {field.base}
        </pre>
        <pre className={`${layerStyles} text-secondary/40`} style={layerStyle}>
          {field.accent}
        </pre>
      </div>

      {index ? (
        <p className="relative text-xs uppercase tracking-[0.18em] text-secondary">
          {index}
        </p>
      ) : (
        <span aria-hidden="true" />
      )}

      {title || detail ? (
        <div className="relative max-w-xl">
          {title ? (
            <p className="text-[clamp(1.25rem,2.4vw,2rem)] font-medium leading-tight tracking-tight text-white">
              {title}
            </p>
          ) : null}
          {detail ? (
            <p className="mt-3 max-w-md text-sm leading-6 text-gray">{detail}</p>
          ) : null}
        </div>
      ) : null}

      <div className="relative flex flex-wrap items-center gap-2">
        {tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-gray/50 bg-primary/70 px-3 py-1 text-body text-gray"
          >
            {tag}
          </span>
        ))}
        {footer ? (
          <span className="text-xs uppercase tracking-[0.16em] text-gray">
            {footer}
          </span>
        ) : null}
      </div>
    </div>
  );
}
