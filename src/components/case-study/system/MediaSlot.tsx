import Image from "next/image";

export interface MediaAsset {
  id: string;
  title: string;
  detail: string;
  recommended: string;
  ratio?: "video" | "wide" | "screen" | "portrait";
  caption?: string;
  src?: string;
  alt?: string;
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
        {asset.src ? (
          <Image
            src={asset.src}
            alt={asset.alt ?? asset.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover"
          />
        ) : (
          <div className="relative flex h-full flex-col justify-between p-5 sm:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">{asset.id}</p>
            <div className="max-w-xl">
              <p className="text-[clamp(1.25rem,2.4vw,2rem)] font-medium leading-tight tracking-tight text-white">
                {asset.title}
              </p>
              <p className="mt-3 max-w-md text-sm leading-6 text-gray">{asset.detail}</p>
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-gray">{asset.recommended}</p>
          </div>
        )}
        {notes && notes.length > 0 ? (
          <ul className="absolute bottom-4 left-4 flex max-w-[calc(100%-2rem)] flex-wrap gap-2">
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
