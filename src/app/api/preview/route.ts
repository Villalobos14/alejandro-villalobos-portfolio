import { NextResponse } from "next/server";
import { everyday, type Track, type TrackPreview } from "@/lib/fun";

/*
 * Rendered per request so an iTunes outage at build time is never frozen into
 * the response. Each search still sits in the data cache for a day.
 */
export const dynamic = "force-dynamic";

const DAY_S = 60 * 60 * 24;
const SEARCH_URL = "https://itunes.apple.com/search";

interface SearchResult {
  artistName?: string;
  trackName?: string;
  previewUrl?: string;
  artworkUrl100?: string;
  trackViewUrl?: string;
}

const normalize = (value = "") => value.toLowerCase().replace(/\s+/g, " ").trim();
const isHttps = (value?: string): value is string => typeof value === "string" && value.startsWith("https://");

/*
 * A search for "One More Night BTS" ranks Maroon 5 first, so the result has to
 * match the artist. The exact title wins over versions such as "(Remix)".
 */
async function resolve(track: Track): Promise<TrackPreview | null> {
  const url = `${SEARCH_URL}?${new URLSearchParams({ term: track.query, entity: "song", limit: "25" })}`;

  try {
    const response = await fetch(url, { next: { revalidate: DAY_S }, signal: AbortSignal.timeout(5000) });

    if (!response.ok) return null;

    const { results = [] } = (await response.json()) as { results?: SearchResult[] };
    const artist = normalize(track.artist);
    const title = normalize(track.title);
    const candidates = results.filter(
      (result) => normalize(result.artistName).includes(artist) && isHttps(result.previewUrl),
    );
    const match =
      candidates.find((result) => normalize(result.trackName) === title) ??
      candidates.find((result) => normalize(result.trackName).startsWith(title));

    if (!match || !isHttps(match.previewUrl) || !isHttps(match.artworkUrl100) || !isHttps(match.trackViewUrl)) {
      return null;
    }

    return {
      previewUrl: match.previewUrl,
      artworkUrl: match.artworkUrl100.replace("100x100", "300x300"),
      trackViewUrl: match.trackViewUrl,
    };
  } catch {
    return null;
  }
}

/**
 * Resolves every "On repeat" track on the server so the browser never calls
 * iTunes. Lookups are cached for a day; a failure is not, so the next visit
 * tries again.
 */
export async function GET() {
  const tracks = await Promise.all(everyday.music.tracks.map(resolve));
  const resolved = tracks.filter(Boolean).length;

  if (resolved === 0) {
    return NextResponse.json({ tracks }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  return NextResponse.json(
    { tracks },
    {
      headers: {
        "Cache-Control":
          resolved === tracks.length
            ? `public, max-age=3600, s-maxage=${DAY_S}, stale-while-revalidate=${DAY_S}`
            : "public, s-maxage=300",
      },
    },
  );
}
