// Placeholder content: replace with Alejandro's final copy and dates.

export interface NarrativeSegment {
  text: string;
  highlight?: boolean;
  meme?: boolean;
}

export interface TimelineImageLayout {
  x: number;
  y: number;
  width: number;
  rotation: number;
  aspectRatio: number;
  zIndex: number;
}

export interface TimelineItem {
  id: string;
  year: string;
  shortLabel: string;
  title: string;
  description: string;
  logo: string | null;
  images: string[];
  fallback: string;
}

export interface PersonalPreviewItem {
  label: string;
  value: string;
}

export const homeNarrativeContent = {
  professionalStatement: {
    segments: [
      { text: "I’ve worked on 0 → 1 products, internal tools and " },
      { text: "complex services", highlight: true },
      { text: " across financial services, commerce and AI-assisted workflows." },
    ] satisfies NarrativeSegment[],
  },
  timelineIntro: {
    segments: [
      { text: "So, how did I get here? A quick tour, 2002 to now." },
    ] satisfies NarrativeSegment[],
  },
  // Placeholder timeline content and images.
  // Replace with Alejandro's final dates, copy and media.
  timelineItems: [
    {
      id: "early-years",
      year: "2002",
      shortLabel: "Early years",
      title: "Curiosity came first",
      description:
        "A temporary chapter about the interests, places and small obsessions that shaped how I see the world.",
      logo: null,
      images: [
        "/smooth-images/1.png",
        "/smooth-images/2.png",
        "/smooth-images/3.png",
        "/smooth-images/4.png",
        "/smooth-images/5.png",
      ],
      fallback: "EARLY YEARS 01",
    },
    {
      id: "education",
      year: "2018",
      shortLabel: "Learning",
      title: "Finding design through making",
      description:
        "A placeholder for education, early experiments and the moment interfaces started becoming a language.",
      logo: null,
      images: ["/smooth-images/6.png", "/smooth-images/7.png", "/smooth-images/8.png", "/smooth-images/9.png"],
      fallback: "EDUCATION 02",
    },
    {
      id: "dacodes",
      year: "2020",
      shortLabel: "DaCodes",
      title: "Learning by building products",
      description:
        "A temporary description for early professional work, client collaboration and shipping real digital experiences.",
      logo: null,
      images: ["/smooth-images/2.png", "/smooth-images/5.png", "/smooth-images/7.png", "/smooth-images/10.png"],
      fallback: "DACODES 03",
    },
    {
      id: "orium",
      year: "2022",
      shortLabel: "Orium",
      title: "Designing within larger systems",
      description:
        "A temporary chapter about commerce, systems thinking and close collaboration with product and engineering.",
      logo: null,
      images: ["/smooth-images/1.png", "/smooth-images/4.png", "/smooth-images/8.png", "/smooth-images/9.png"],
      fallback: "ORIUM 04",
    },
    {
      id: "hsbc",
      year: "2024",
      shortLabel: "HSBC",
      title: "Creating clarity for complex work",
      description: "A temporary chapter about financial services, internal tools and operational workflows.",
      logo: null,
      images: ["/smooth-images/3.png", "/smooth-images/6.png", "/smooth-images/9.png", "/smooth-images/10.png"],
      fallback: "HSBC 05",
    },
    {
      id: "now",
      year: "Now",
      shortLabel: "Now",
      title: "Product design, engineering and AI",
      description:
        "Exploring how thoughtful interfaces can make intelligent systems more understandable and useful for people.",
      logo: null,
      images: ["/smooth-images/1.png", "/smooth-images/5.png", "/smooth-images/8.png", "/smooth-images/10.png"],
      fallback: "NOW 06",
    },
  ] satisfies TimelineItem[],
  collageLayouts: {
    "early-years": [
      { x: 1, y: 8, width: 16, rotation: -5, aspectRatio: 0.76, zIndex: 2 },
      { x: 18, y: 22, width: 18, rotation: 4, aspectRatio: 0.84, zIndex: 3 },
      { x: 40, y: 6, width: 13, rotation: -3, aspectRatio: 1, zIndex: 1 },
      { x: 58, y: 28, width: 15, rotation: 6, aspectRatio: 0.8, zIndex: 4 },
      { x: 78, y: 10, width: 16, rotation: -4, aspectRatio: 1.12, zIndex: 2 },
    ],
    education: [
      { x: 4, y: 26, width: 18, rotation: 5, aspectRatio: 0.72, zIndex: 3 },
      { x: 28, y: 6, width: 14, rotation: -6, aspectRatio: 1, zIndex: 2 },
      { x: 52, y: 24, width: 17, rotation: 3, aspectRatio: 0.88, zIndex: 4 },
      { x: 76, y: 8, width: 15, rotation: -2, aspectRatio: 0.78, zIndex: 1 },
    ],
    dacodes: [
      { x: 2, y: 12, width: 15, rotation: -4, aspectRatio: 1.15, zIndex: 2 },
      { x: 22, y: 30, width: 17, rotation: 6, aspectRatio: 0.74, zIndex: 4 },
      { x: 48, y: 8, width: 14, rotation: -5, aspectRatio: 0.82, zIndex: 3 },
      { x: 70, y: 22, width: 18, rotation: 3, aspectRatio: 0.9, zIndex: 2 },
    ],
    orium: [
      { x: 6, y: 18, width: 14, rotation: 4, aspectRatio: 0.8, zIndex: 2 },
      { x: 24, y: 4, width: 16, rotation: -3, aspectRatio: 1.05, zIndex: 3 },
      { x: 48, y: 26, width: 18, rotation: 5, aspectRatio: 0.72, zIndex: 4 },
      { x: 74, y: 12, width: 15, rotation: -6, aspectRatio: 0.86, zIndex: 1 },
    ],
    hsbc: [
      { x: 3, y: 28, width: 17, rotation: -5, aspectRatio: 0.78, zIndex: 3 },
      { x: 26, y: 8, width: 14, rotation: 4, aspectRatio: 1, zIndex: 2 },
      { x: 50, y: 22, width: 16, rotation: 2, aspectRatio: 0.9, zIndex: 4 },
      { x: 74, y: 6, width: 17, rotation: -3, aspectRatio: 0.74, zIndex: 1 },
    ],
    now: [
      { x: 2, y: 10, width: 16, rotation: 3, aspectRatio: 0.84, zIndex: 2 },
      { x: 24, y: 28, width: 15, rotation: -4, aspectRatio: 0.76, zIndex: 3 },
      { x: 46, y: 6, width: 18, rotation: 6, aspectRatio: 1.08, zIndex: 4 },
      { x: 72, y: 24, width: 16, rotation: -2, aspectRatio: 0.8, zIndex: 1 },
    ],
  } satisfies Record<string, TimelineImageLayout[]>,
  personalStatement: {
    segments: [
      { text: "And for the " },
      { text: "things I don’t keep on my résumé", highlight: true, meme: true },
      { text: ": I collect images, play guitar, save loose notes, run, and turn " },
      { text: "small obsessions", highlight: true },
      { text: " into side projects." },
    ] satisfies NarrativeSegment[],
  },
  personalMeme: {
    src: "/images/fun/meme-placeholder.webp",
    alt: "Temporary meme placeholder",
  },
  personalPreview: [
    {
      label: "Listening",
      value: "Guitars, live sessions and songs on repeat",
    },
    {
      label: "Collecting",
      value: "Images, notes, objects and visual references",
    },
    {
      label: "Outside",
      value: "Running, walking and time away from the screen",
    },
    {
      label: "Making",
      value: "Experiments, prototypes and side projects",
    },
  ] satisfies PersonalPreviewItem[],
};
