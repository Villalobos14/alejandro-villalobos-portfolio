import type { Photo } from "@/lib/media";

/** Phase 3e copy from the supplied brief. Legacy copy stays in personal.ts. */
export const funHeader = {
  eyebrow: "About — Fun",
  title: ["Music on.", "Camera out."],
  deck: "Music most of the time. Cities when I can get to them. Photos and short video of whatever I don’t want to forget.",
  meta: "Spanish at home · English daily · Korean, slowly",
} as const;

export const cameraRoll = {
  eyebrow: "01 — Camera roll",
  title: "Things I didn’t want to forget.",
  gear: "Shot on Nikon D3200 · Osmo Pocket",
  coming: "photos coming",
} as const;

/** Lightbox retains the original diptychs until individual photographs exist. */
export const cameraPhotos: Photo[] = [
  {
    // TODO(content): reemplazar por foto individual
    src: "/me-and-friends.png",
    alt: "Black-and-white diptych: Alejandro at an outdoor café, and friends with guitars.",
    caption: "the café side",
    width: 2538,
    height: 1692,
  },
  {
    // TODO(content): reemplazar por foto individual
    src: "/me-and-friends.png",
    alt: "Black-and-white diptych: Alejandro at an outdoor café, and friends with guitars.",
    caption: "people I like",
    width: 2538,
    height: 1692,
  },
  {
    // TODO(content): reemplazar por foto individual
    src: "/storytelling.png",
    alt: "Black-and-white diptych: a computer classroom, and Alejandro speaking on a stage in Chiapas.",
    caption: "on a stage in Chiapas",
    width: 2568,
    height: 1577,
  },
  {
    // TODO(content): reemplazar por foto individual
    src: "/sharing-knowledge.png",
    alt: "Black-and-white diptych: people working on laptops, and a workshop group around a projector.",
    caption: "someone stuck → the room helps",
    width: 2756,
    height: 1604,
  },
  {
    // TODO(content): reemplazar por foto individual
    src: "/storytelling.png",
    alt: "Black-and-white diptych: a computer classroom, and Alejandro speaking on a stage in Chiapas.",
    caption: "half a brief, one table",
    width: 2568,
    height: 1577,
  },
];

export const japanCaption = "Japan → after the trip";

/** One song on the "On repeat" card. `query` is what the iTunes Search API is asked for. */
export interface Track {
  title: string;
  artist: string;
  query: string;
}

/** What /api/preview resolves for a track: Apple's own ~30 s preview, cover and store page. */
export interface TrackPreview {
  previewUrl: string;
  artworkUrl: string;
  trackViewUrl: string;
}

// TODO(content): reemplazar por las canciones reales del usuario (1–3). BTS — "One More Night" es un placeholder.
const tracks: readonly Track[] = [
  { title: "One More Night", artist: "BTS", query: "One More Night BTS" },
];

export const everyday = {
  eyebrow: "02 — Everyday",
  title: "The quieter part.",
  music: {
    label: "On repeat",
    title: "Something is always playing.",
    tracks,
    appleMusic: "Listen on Apple Music",
  },
  travel: {
    label: "Elsewhere",
    from: "MEX",
    fromCity: "Mexico City",
    /** The ticket as it reads without motion; the board rotates through `destinations` instead. */
    to: "TYO · SEL",
    // TODO(content): confirmar qué ciudad de USA y de Brasil quiere mostrar el usuario; NYC y RIO son placeholders.
    destinations: [
      { code: "TYO", city: "Tokyo", country: "Japan" },
      { code: "SEL", city: "Seoul", country: "South Korea" },
      { code: "NYC", city: "New York", country: "USA" },
      { code: "RIO", city: "Rio de Janeiro", country: "Brazil" },
    ],
    destinationsLabel: "Destinations",
    body: "I like learning how a city moves: trains, signs and food. Japan and Korea are the trips I keep planning around.",
    meta: [
      { label: "Status", value: "Planning" },
      { label: "Seat", value: "Window, obviously" },
      { label: "Carry-on", value: "Osmo Pocket" },
    ],
  },
  korean: {
    label: "Korean, slowly",
    wordLabel: "word of the week",
    word: "천천히",
    pronunciation: "cheon-cheon-hi — slowly",
    note: "Which is also how I’m learning it.",
  },
} as const;

export const funCta = {
  title: "Back to the way I work.",
  professional: "Professional →",
  work: "See the work →",
} as const;
