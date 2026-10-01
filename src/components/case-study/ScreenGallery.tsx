import Image from "next/image";

export interface Screen {
  src: string;
  alt: string;
  caption?: string;
}

interface ScreenGalleryProps {
  screens: Screen[];
  columns?: 2 | 3;
  ratio?: string;
}

const COLUMN_CLASSES: Record<2 | 3, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

export default function ScreenGallery({
  screens,
  columns = 3,
  ratio = "3/4",
}: ScreenGalleryProps) {
  return (
    <ul className={`grid grid-cols-1 gap-scale ${COLUMN_CLASSES[columns]}`}>
      {screens.map((screen) => (
        <li key={screen.src} className="flex flex-col gap-3">
          <div
            className="relative w-full overflow-hidden rounded-2xl border border-gray/40"
            style={{ aspectRatio: ratio }}
          >
            <Image
              src={screen.src}
              alt={screen.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
              unoptimized={screen.src.endsWith(".svg")}
              className="object-cover"
            />
          </div>
          {screen.caption ? (
            <p className="text-body text-gray">{screen.caption}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
