import Media, { type MediaSource } from "@/components/media/Media";

export interface MediaAsset {
  id: string;
  title: string;
  detail: string;
  recommended: string;
  ratio?: "video" | "wide" | "screen" | "portrait";
  caption?: string;
  /** Omit until the asset exists; the slot shows its placeholder meanwhile. */
  media?: MediaSource;
}

const ratioClass: Record<NonNullable<MediaAsset["ratio"]>, string> = {
  video: "aspect-[16/10]",
  wide: "aspect-[2/1]",
  screen: "aspect-[16/9]",
  portrait: "aspect-[4/5] sm:aspect-[4/3]",
};

interface MediaSlotProps {
  asset: MediaAsset;
  className?: string;
  notes?: string[];
}

export default function MediaSlot({ asset, className = "", notes }: MediaSlotProps) {
  const ratio = ratioClass[asset.ratio ?? "screen"];

  return (
    <figure className={`min-w-0 ${className}`}>
      <div className={`relative overflow-hidden border border-white/15 bg-primary ${ratio}`}>
        <Media
          source={asset.media}
          sizes="(max-width: 1024px) 100vw, 1200px"
          placeholder={{
            index: asset.id,
            title: asset.title,
            detail: asset.detail,
            footer: asset.recommended,
            seed: asset.id,
          }}
        />
        {notes && notes.length > 0 ? (
          <ul className="absolute bottom-4 left-4 z-10 flex max-w-[calc(100%-2rem)] flex-wrap gap-2">
            {notes.map((note) => (
              <li
                key={note}
                className="border border-secondary/70 bg-primary/90 px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-secondary"
              >
                {note}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {asset.caption ? (
        <figcaption className="mt-3 max-w-[42rem] text-sm leading-6 text-gray">{asset.caption}</figcaption>
      ) : null}
    </figure>
  );
}
