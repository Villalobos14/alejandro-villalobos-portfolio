"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { BackwardIcon, ForwardIcon, PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import { everyday, type TrackPreview } from "@/lib/fun";
import { useCardActivity, useReducedMotionPreference } from "./card-activity";

const { music } = everyday;

/** Off screen for this long, the preview fades out over FADE_MS and pauses. */
const LEAVE_GRACE_MS = 1000;
const FADE_MS = 300;

const onInkFocus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg";

/** Decorative equalizer: each bar loops between its peaks while the preview plays, from a shared rest. */
const BARS = [
  { peaks: [0.2, 1, 0.5, 0.8], durationMs: 900 },
  { peaks: [0.2, 0.6, 0.95, 0.45], durationMs: 750 },
  { peaks: [0.2, 0.85, 0.35, 1], durationMs: 1050 },
  { peaks: [0.2, 0.5, 0.75, 0.3], durationMs: 800 },
] as const;

/** One sound at a time on the page: this player, or any other unmuted media. */
let activeAudio: HTMLAudioElement | null = null;

function claimAudio(audio: HTMLAudioElement) {
  if (activeAudio && activeAudio !== audio) activeAudio.pause();
  activeAudio = audio;
  document.querySelectorAll<HTMLMediaElement>("audio, video").forEach((media) => {
    if (media !== audio && !media.muted && !media.paused) media.pause();
  });
}

function formatTime(seconds: number | null) {
  if (seconds === null || !Number.isFinite(seconds)) return "–:––";

  const whole = Math.max(0, Math.floor(seconds));

  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/** Where the link goes while the preview is missing: Apple Music's own search for the song. */
const searchUrl = (query: string) => `https://music.apple.com/search?term=${encodeURIComponent(query)}`;

/** Not an analyser: it moves while the preview plays on screen and rests otherwise. */
function Equalizer({ playing, moving }: { playing: boolean; moving: boolean }) {
  const barsRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotionPreference();

  useEffect(() => {
    const bars = barsRef.current;

    if (!bars || !moving || reduceMotion) return;

    const animations = Array.from(bars.children).map((bar, index) =>
      bar.animate(
        BARS[index].peaks.map((peak) => ({ transform: `scaleY(${peak})` })),
        { duration: BARS[index].durationMs, easing: "ease-in-out", iterations: Infinity, direction: "alternate" },
      ),
    );

    return () => animations.forEach((animation) => animation.cancel());
  }, [moving, reduceMotion]);

  return (
    <span ref={barsRef} aria-hidden="true" className="mt-[5px] flex h-[18px] shrink-0 items-end gap-[3px]">
      {BARS.map((_, index) => (
        <span
          key={index}
          className={`h-full w-[3px] origin-bottom scale-y-[0.2] rounded-sm ${playing ? "bg-on-ink-positive" : "bg-on-ink-secondary"}`}
        />
      ))}
    </span>
  );
}

/**
 * "On repeat": Apple's 30-second preview of each track, resolved by
 * /api/preview. Nothing plays until the reader presses play; the card keeps its
 * look and its link to Apple Music when the preview is unavailable.
 */
export default function OnRepeatCard({ className }: { className: string }) {
  const cardRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const fadeRef = useRef(0);
  const indexRef = useRef(0);
  const { inView, pageVisible } = useCardActivity(cardRef);
  const [previews, setPreviews] = useState<(TrackPreview | null)[] | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  /* Tracks whose preview file failed to load; their cover and store link still work. */
  const [broken, setBroken] = useState<number[]>([]);

  const track = music.tracks[index];
  const preview = previews?.[index] ?? null;
  const playable = Boolean(preview) && !broken.includes(index);
  const several = music.tracks.length > 1;

  indexRef.current = index;

  /* The fill follows the audio clock directly, every frame while playing. */
  const paint = useCallback(() => {
    const audio = audioRef.current;
    const total = audio && Number.isFinite(audio.duration) ? audio.duration : 0;
    const progress = audio && total > 0 ? Math.min(1, audio.currentTime / total) : 0;

    if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`;
    if (thumbRef.current) thumbRef.current.style.left = `${progress * 100}%`;
  }, []);

  const cancelFade = useCallback(() => {
    if (!fadeRef.current) return;

    cancelAnimationFrame(fadeRef.current);
    fadeRef.current = 0;
    if (audioRef.current) audioRef.current.volume = 1;
  }, []);

  const fadeOut = useCallback(() => {
    const audio = audioRef.current;

    if (!audio || audio.paused || fadeRef.current) return;

    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / FADE_MS);

      audio.volume = 1 - progress;

      if (progress < 1) {
        fadeRef.current = requestAnimationFrame(step);
        return;
      }

      fadeRef.current = 0;
      audio.pause();
      audio.volume = 1;
    };

    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const start = useCallback(
    (audio: HTMLAudioElement) => {
      cancelFade();
      claimAudio(audio);
      audio.play().catch(() => setPlaying(false));
    },
    [cancelFade],
  );

  const select = useCallback(
    (next: number, autoplay: boolean) => {
      const audio = audioRef.current;
      const nextPreview = previews?.[next] ?? null;

      setIndex(next);
      setTime(0);
      setDuration(null);

      if (!audio) return;

      cancelFade();
      audio.pause();

      if (nextPreview) {
        audio.preload = "metadata";
        audio.src = nextPreview.previewUrl;
      } else {
        audio.removeAttribute("src");
        audio.load();
      }

      paint();

      if (autoplay && nextPreview && !broken.includes(next)) start(audio);
    },
    [previews, broken, cancelFade, paint, start],
  );

  /* One <audio> for the card's lifetime; unmounting releases its source. */
  useEffect(() => {
    const audio = new Audio();

    audio.preload = "none";
    audioRef.current = audio;

    const syncPlaying = () => setPlaying(!audio.paused);
    const syncTime = () => {
      setTime(audio.currentTime);
      paint();
    };
    const syncDuration = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : null);
      paint();
    };
    const onError = () => {
      if (!audio.getAttribute("src")) return;

      const failed = indexRef.current;

      setBroken((current) => (current.includes(failed) ? current : [...current, failed]));
    };
    const onOtherMedia = (event: Event) => {
      const media = event.target;

      if (media instanceof HTMLMediaElement && media !== audio && !media.muted) audio.pause();
    };

    audio.addEventListener("play", syncPlaying);
    audio.addEventListener("pause", syncPlaying);
    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("error", onError);
    document.addEventListener("play", onOtherMedia, true);

    return () => {
      cancelAnimationFrame(fadeRef.current);
      fadeRef.current = 0;
      document.removeEventListener("play", onOtherMedia, true);
      audio.removeEventListener("play", syncPlaying);
      audio.removeEventListener("pause", syncPlaying);
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      if (activeAudio === audio) activeAudio = null;
      audioRef.current = null;
    };
  }, [paint]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/preview", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: { tracks?: unknown }) => {
        setPreviews(Array.isArray(data.tracks) ? (data.tracks as (TrackPreview | null)[]) : []);
      })
      .catch(() => {
        if (!controller.signal.aborted) setPreviews([]);
      });

    return () => controller.abort();
  }, []);

  /* Metadata (the real duration) loads once the card is first on screen. */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !preview || !inView || audio.getAttribute("src")) return;

    audio.preload = "metadata";
    audio.src = preview.previewUrl;
  }, [inView, preview]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const onEnded = () => {
      if (several) {
        select((index + 1) % music.tracks.length, true);
        return;
      }

      audio.currentTime = 0;
      setTime(0);
      paint();
    };

    audio.addEventListener("ended", onEnded);

    return () => audio.removeEventListener("ended", onEnded);
  }, [index, several, select, paint]);

  useEffect(() => {
    if (!playing) {
      paint();
      return;
    }

    let frame = requestAnimationFrame(function loop() {
      paint();
      frame = requestAnimationFrame(loop);
    });

    return () => cancelAnimationFrame(frame);
  }, [playing, paint]);

  /* Scrolled away for over a second: fade out. Back in time: carry on. */
  useEffect(() => {
    if (inView) {
      cancelFade();
      return;
    }

    if (!playing) return;

    const timer = window.setTimeout(fadeOut, LEAVE_GRACE_MS);

    return () => window.clearTimeout(timer);
  }, [inView, playing, fadeOut, cancelFade]);

  /* A hidden tab cannot run the fade, so it simply pauses. */
  useEffect(() => {
    if (pageVisible) return;

    cancelFade();
    audioRef.current?.pause();
  }, [pageVisible, cancelFade]);

  const toggle = () => {
    const audio = audioRef.current;

    if (!audio || !preview || !playable) return;

    if (!audio.paused) {
      cancelFade();
      audio.pause();
      return;
    }

    if (!audio.getAttribute("src")) {
      audio.preload = "metadata";
      audio.src = preview.previewUrl;
    }

    start(audio);
  };

  const seek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = Number(event.target.value);
    setTime(audio.currentTime);
    paint();
  };

  const step = (offset: number) => {
    const audio = audioRef.current;

    select((index + offset + music.tracks.length) % music.tracks.length, Boolean(audio && !audio.paused));
  };

  const canSeek = playable && duration !== null;

  return (
    <article ref={cardRef} className={`flex flex-col ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-mono text-bg">{music.label}</h3>
        <a
          href={preview?.trackViewUrl ?? searchUrl(track.query)}
          target="_blank"
          rel="noopener noreferrer"
          className={`-my-4 -mr-2 inline-flex min-h-11 shrink-0 items-center gap-1 rounded px-2 text-mono-s text-on-ink-secondary transition-colors fine:hover:text-bg ${onInkFocus}`}
        >
          {music.appleMusic}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <p className="mt-1 text-h3 tracking-[-0.015em] frame:whitespace-nowrap">{music.title}</p>

      <div className="mt-6 flex gap-4 frame:mt-[26px]">
        <div className="relative size-20 shrink-0 overflow-hidden rounded border border-bg/10 bg-cover-ink-raised lg:size-[104px]">
          {preview ? (
            <Image
              src={preview.artworkUrl}
              alt=""
              width={104}
              height={104}
              unoptimized
              className="size-full object-contain"
            />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-h4 text-bg">{track.title}</p>
              <p className="truncate text-body-s text-on-ink-secondary">{track.artist}</p>
            </div>
            <Equalizer playing={playing} moving={playing && inView && pageVisible} />
          </div>
          <div className="-ml-0.5 flex items-center gap-1">
            {several ? (
              <button
                type="button"
                aria-label="Previous track"
                onClick={() => step(-1)}
                className={`inline-flex size-11 items-center justify-center rounded-full text-bg transition-colors fine:hover:bg-bg/10 ${onInkFocus}`}
              >
                <BackwardIcon aria-hidden="true" className="size-5" />
              </button>
            ) : null}
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              aria-pressed={playing}
              aria-disabled={!playable}
              onClick={toggle}
              className={`inline-flex size-12 items-center justify-center rounded-full transition-colors ${
                playable ? "bg-bg text-cover-ink fine:hover:bg-bg/85" : "cursor-not-allowed bg-bg/15 text-on-ink-secondary"
              } ${onInkFocus}`}
            >
              {playing ? (
                <PauseIcon aria-hidden="true" className="size-5" />
              ) : (
                <PlayIcon aria-hidden="true" className="size-5 translate-x-px" />
              )}
            </button>
            {several ? (
              <button
                type="button"
                aria-label="Next track"
                onClick={() => step(1)}
                className={`inline-flex size-11 items-center justify-center rounded-full text-bg transition-colors fine:hover:bg-bg/10 ${onInkFocus}`}
              >
                <ForwardIcon aria-hidden="true" className="size-5" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-3 frame:mt-auto">
        <div className="group/seek relative h-11">
          <input
            type="range"
            aria-label="Seek"
            aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
            min={0}
            max={duration ?? 0}
            step={1}
            value={Math.round(time)}
            disabled={!canSeek}
            onChange={seek}
            className="peer absolute inset-0 z-10 m-0 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-default"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-bg/15 outline-offset-4 outline-bg peer-focus-visible:outline peer-focus-visible:outline-2"
          >
            <span ref={fillRef} className="block size-full origin-left scale-x-0 rounded-full bg-on-ink-positive" />
          </span>
          <span
            ref={thumbRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg opacity-0 transition-opacity peer-focus-visible:opacity-100 peer-disabled:!opacity-0 fine:group-hover/seek:opacity-100"
          />
        </div>
        <p className="-mt-2.5 flex justify-between text-mono-s text-on-ink-secondary">
          <span>{formatTime(time)}</span>
          <span>{formatTime(duration)}</span>
        </p>
      </div>
    </article>
  );
}
