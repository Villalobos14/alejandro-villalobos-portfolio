export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface PersonalBlock {
  id: string;
  label: string;
  title: string;
  body?: string;
  items?: string[];
  photo?: Photo;
}

export const heroPhotos: Photo[] = [
  {
    src: "/me-and-friends.png",
    alt: "Black-and-white diptych: Alejandro seated at an outdoor café, and three people standing together with electric and acoustic guitars.",
    width: 2538,
    height: 1692,
  },
  {
    src: "/sharing-knowledge.png",
    alt: "Black-and-white diptych of a classroom workshop: people working on laptops, and a group posing around a projector.",
    width: 2756,
    height: 1604,
  },
];

export const collagePhotos: Photo[] = [
  {
    src: "/me-and-friends.png",
    alt: "Black-and-white diptych: Alejandro seated at an outdoor café, and three people standing together with electric and acoustic guitars.",
    width: 2538,
    height: 1692,
  },
  {
    src: "/leadership.png",
    alt: "Black-and-white diptych from a hackathon: a small group talking at a table, and a team posing under a tent.",
    width: 2708,
    height: 1512,
  },
  {
    src: "/storytelling.png",
    alt: "Black-and-white diptych: a classroom full of computers, and Alejandro speaking into a microphone in front of a Chiapas backdrop.",
    width: 2568,
    height: 1577,
  },
];

export const galleryPhotos: Photo[] = [
  {
    src: "/smooth-images/9.png",
    alt: "Tablet showing a GoodActions profile, a wallet balance, and a transactions list, set against dark leaves.",
    width: 1080,
    height: 1440,
  },
  {
    src: "/smooth-images/1.png",
    alt: "Two phones showing a Shohei Ohtani player profile and a Los Angeles Dodgers stats screen, over a night baseball stadium.",
    width: 1080,
    height: 1350,
  },
  {
    src: "/smooth-images/3.png",
    alt: "Tablet showing a GoodActions profile with a wallet card and a transactions list, over dark foliage.",
    width: 1080,
    height: 1350,
  },
  {
    src: "/smooth-images/4.png",
    alt: "Two Monogatari screens, a manga landing page and a catalog, floating over a night street with a red paper lantern.",
    width: 1920,
    height: 1440,
  },
  {
    src: "/smooth-images/5.png",
    alt: "Monogatari manga catalog above a landing page, over a night street with a red paper lantern and parked bicycles.",
    width: 1920,
    height: 1440,
  },
  {
    src: "/smooth-images/6.png",
    alt: "Monogatari landing page with three manga character drawings and the line Discover unique stories anytime.",
    width: 1920,
    height: 1440,
  },
  {
    src: "/smooth-images/2.png",
    alt: "Two tablet screens of the GoodActions app, a marketing page and a wallet dashboard, over dark foliage.",
    width: 1080,
    height: 1350,
  },
  {
    src: "/smooth-images/8.png",
    alt: "Two phones on a wooden table: an Ominio splash screen and a learning dashboard with a streak and weekly progress.",
    width: 1920,
    height: 1440,
  },
  {
    src: "/smooth-images/7.png",
    alt: "Browser window showing an Andanac page with a Nissan X-Trail headline, on a surface covered in leaf shadows.",
    width: 1080,
    height: 1350,
  },
  {
    src: "/smooth-images/10.png",
    alt: "Phone on a brick wall showing a realUptime welcome screen in Spanish.",
    width: 1080,
    height: 1350,
  },
];

export const funIntro = {
  label: "02 — Fun",
  title: ["Beyond", "design"],
  body:
    "Music most of the time. Cities when I can get to them. Photos and short video of whatever I don't want to forget. Spanish at home, English for the rest, and Korean in small pieces.",
} as const;

/**
 * The first two entries share the asymmetric row; the rest span the full width.
 * New topics (music, objects, reading, notes) drop in here without layout work.
 */
export const personalBlocks: PersonalBlock[] = [
  {
    id: "beyond-design",
    label: "Stories",
    title: "Beyond Design",
    body:
      "One side of this photo is a café. The other is a room with guitars. I spend a lot of time in both kinds of places, usually with people I like and something playing.",
    photo: {
      src: "/me-and-friends.png",
      alt: "Black-and-white diptych: Alejandro seated at an outdoor café, and three people standing together with electric and acoustic guitars.",
      width: 2538,
      height: 1692,
    },
  },
  {
    id: "sharing-knowledge",
    label: "Stories",
    title: "Sharing Knowledge",
    body:
      "Workshops are the part of teaching I actually like. Laptops open, someone stuck, and the room slowly getting to an answer together. The useful moment is rarely the presentation.",
    photo: {
      src: "/sharing-knowledge.png",
      alt: "Black-and-white diptych of a classroom workshop: people working on laptops, and a group posing around a projector.",
      width: 2756,
      height: 1604,
    },
  },
  {
    id: "storytelling",
    label: "Stories",
    title: "Storytelling",
    body:
      "I like saying a thing out loud until it is clear. Sometimes that is a classroom full of computers. Sometimes it is a stage, a microphone, and a wall that says Chiapas behind me.",
    photo: {
      src: "/storytelling.png",
      alt: "Black-and-white diptych: a classroom full of computers, and Alejandro speaking into a microphone in front of a Chiapas backdrop.",
      width: 2568,
      height: 1577,
    },
  },
  {
    id: "leadership",
    label: "Stories",
    title: "Hackathons",
    body:
      "Hackathons compress the messy part of making something into a day or two. Half a brief, a table, a team that still has to pick a direction. I usually end up on the design side of that.",
    photo: {
      src: "/leadership.png",
      alt: "Black-and-white diptych from a hackathon: a small group talking at a table, and a team posing under a tent.",
      width: 2708,
      height: 1512,
    },
  },
  {
    id: "on-repeat",
    label: "Music",
    title: "On repeat",
    body:
      "Something is playing most of the time. While I work, while I walk, while I try to learn a city. I am not keeping a public list of favorites. It is just on.",
  },
  {
    id: "away-from-the-screen",
    label: "Elsewhere",
    title: "Away from the screen",
    body:
      "I like being in a city I do not know yet and working out how it moves: the trains, the signs, the food. Japan and Korea are the trips I keep planning around. I take photos and short video along the way, mostly on a Nikon and, lately, an Osmo Pocket. Not as a photographer. More as a way to remember what I actually noticed. Spanish is home. English is daily. Korean is the language I am learning slowly, because I want those places to be less opaque when I get there.",
  },
];

/** Notes, readings, and objects stay hidden until there are real assets. */
export const PERSONAL_BLOCK_SLOTS = [] as const;
