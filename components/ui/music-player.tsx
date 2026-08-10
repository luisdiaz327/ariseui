"use client";

import {
  type ComponentProps,
  type CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export type MusicTrack = {
  title: string;
  src: string;
};

export type MusicPlayerProps = Omit<ComponentProps<"div">, "onChange"> & {
  tracks?: MusicTrack[];
  defaultTrack?: number;
  onTrackChange?: (track: MusicTrack, index: number) => void;
};

const WAVEFORM_HEIGHTS = [
  10, 22, 12, 28, 48, 88, 70, 106, 68, 35, 14, 30, 80, 118, 74, 128,
  158, 82, 34, 70, 105, 175, 76, 132, 64, 36, 20, 48, 72, 36, 22, 18,
  15, 12, 20, 42, 58, 38, 28, 18, 15, 22, 34, 48, 25, 20, 14, 11,
];

export default function MusicPlayer({
  tracks = [],
  defaultTrack = 0,
  onTrackChange,
  className,
  style,
  ...props
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [trackIndex, setTrackIndex] = useState(() =>
    tracks.length ? Math.min(Math.max(defaultTrack, 0), tracks.length - 1) : 0,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const autoplayOnTrackChangeRef = useRef(false);

  const track = tracks[trackIndex];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!tracks.length) return;
    setTrackIndex((index) => Math.min(index, tracks.length - 1));
  }, [tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !autoplayOnTrackChangeRef.current) return;

    autoplayOnTrackChangeRef.current = false;
    void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [track]);

  const changeTrack = (index: number, autoplay = false) => {
    if (!tracks.length) return;
    const nextIndex = (index + tracks.length) % tracks.length;
    autoplayOnTrackChangeRef.current = autoplay;
    setTrackIndex(nextIndex);
    setProgress(0);
    onTrackChange?.(tracks[nextIndex], nextIndex);
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    if (audio.paused) {
      void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio?.duration || !Number.isFinite(audio.duration)) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const nextProgress = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
    seekTo(nextProgress);
  };

  const seekTo = (nextProgress: number) => {
    const audio = audioRef.current;
    const clampedProgress = Math.min(100, Math.max(0, nextProgress));
    if (audio?.duration && Number.isFinite(audio.duration)) {
      audio.currentTime = (clampedProgress / 100) * audio.duration;
    }
    setProgress(clampedProgress);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const player = playerRef.current;
    if (!player) return;

    const rect = player.getBoundingClientRect();
    const x = event.clientX / rect.width - rect.left / rect.width - 0.5;
    const y = event.clientY / rect.height - rect.top / rect.height - 0.5;
    player.style.transform = `perspective(1000px) rotateX(${y * -1.2}deg) rotateY(${x * 1.2}deg)`;
  };

  const activeCount = Math.round((progress / 100) * WAVEFORM_HEIGHTS.length);
  const playheadPosition = Math.min(93, Math.max(7, progress));

  return (
    <div
      ref={playerRef}
      data-slot="music-player"
      className={cn(
        "flex w-full items-center gap-2 rounded-[27px] border border-white/12 bg-[linear-gradient(145deg,#353738_0%,#292b2c_42%,#242627_100%)] p-2 shadow-[inset_0_1px_1px_rgba(255,255,255,.12),inset_0_-18px_35px_rgba(0,0,0,.20),0_25px_55px_rgba(0,0,0,.35)] transition-transform motion-reduce:transition-none sm:gap-4 sm:rounded-[42px] sm:p-3 lg:h-[340px] lg:gap-7 lg:rounded-[66px] lg:p-[18px]",
        className,
      )}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        if (playerRef.current) playerRef.current.style.transform = "";
      }}
      {...props}
    >
      <style>{`@keyframes music-player-equalize { from { transform: scaleY(.72); } to { transform: scaleY(1.08); } }`}</style>
      <div className="flex shrink-0 flex-col items-center gap-2 sm:gap-3.5">
        <div className="grid size-[125px] place-items-center rounded-full bg-[#090a0a] shadow-[inset_0_0_0_2px_rgba(255,255,255,.05),inset_0_8px_15px_rgba(0,0,0,.7),0_2px_2px_rgba(255,255,255,.06)] sm:size-[190px] lg:size-[285px]">
          <button
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            disabled={!track}
            onClick={togglePlayback}
            className="grid size-[103px] place-items-center rounded-full bg-[linear-gradient(145deg,#252627,#1e2021)] text-[#ddd] shadow-[inset_0_1px_1px_rgba(255,255,255,.09),inset_0_-12px_25px_rgba(0,0,0,.25)] transition duration-200 hover:scale-[1.035] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none sm:size-[158px] lg:size-[238px]"
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="size-[38px] fill-current sm:size-[55px] lg:size-[76px]" aria-hidden="true">
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-[38px] fill-current sm:size-[55px] lg:size-[76px]" aria-hidden="true">
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <TransportButton label="Previous track" disabled={!track} onClick={() => changeTrack(trackIndex - 1, isPlaying)}>
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
          </TransportButton>
          <TransportButton label="Next track" disabled={!track} onClick={() => changeTrack(trackIndex + 1, isPlaying)}>
            <path d="M16 6h2v12h-2zM6 6l8.5 6L6 18z" />
          </TransportButton>
        </div>
      </div>

      <div
        role="slider"
        tabIndex={track ? 0 : -1}
        aria-label="Playback progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        onClick={seek}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowDown") seekTo(progress - 5);
          if (event.key === "ArrowRight" || event.key === "ArrowUp") seekTo(progress + 5);
        }}
        className="relative h-[125px] min-w-0 flex-1 cursor-pointer overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_44%_50%,rgba(120,40,40,.15),transparent_36%),linear-gradient(105deg,#151718,#17191a_60%,#131516)] shadow-[inset_0_1px_2px_rgba(255,255,255,.06),inset_0_-12px_30px_rgba(0,0,0,.35)] outline-none focus-visible:ring-2 focus-visible:ring-[#f0545b] sm:h-[190px] sm:rounded-[36px] lg:h-[285px] lg:rounded-[54px]"
      >
        <span className="absolute left-3 top-2 z-10 max-w-[70%] truncate text-[10px] font-semibold tracking-[.04em] text-[#d8d8d8] sm:left-[18px] sm:top-3 sm:text-xs lg:left-[25px] lg:top-[17px] lg:text-sm">{track?.title ?? "No track selected"}</span>
        <div className="absolute inset-0 flex items-center justify-evenly gap-1 p-[18px_8px] sm:gap-2 sm:p-[30px_14px] lg:gap-3.5 lg:p-[55px_24px]">
          {WAVEFORM_HEIGHTS.map((height, index) => (
            <span
              key={index}
              className={cn(
                "w-[3px] shrink-0 rounded-full bg-[#3a3c3d] opacity-70 transition-[background,opacity,transform] duration-300 motion-reduce:transition-none sm:w-[5px] lg:w-[7px]",
                index < activeCount && "bg-[#f0f0f0] opacity-100",
                isPlaying && index < activeCount && "motion-safe:animate-[music-player-equalize_var(--speed)_ease-in-out_infinite_alternate]",
              )}
              style={{
                height,
                "--speed": `${0.42 + (index % 6) * 0.1}s`,
                animationDelay: `${-index * 0.055}s`,
              } as CSSProperties}
            />
          ))}
        </div>
        <span className="absolute inset-y-[-10%] z-10 w-1 rounded-full bg-[#f0545b] shadow-[0_0_10px_rgba(240,84,91,.75),0_0_24px_rgba(240,84,91,.32)] transition-[left] duration-200 motion-reduce:transition-none" style={{ left: `${playheadPosition}%` }} />
      </div>

      <audio
        ref={audioRef}
        src={track?.src}
        preload="metadata"
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
        }}
        onEnded={() => changeTrack(trackIndex + 1, true)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
}

function TransportButton({
  label,
  children,
  ...props
}: ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-[30px] place-items-center rounded-full bg-[linear-gradient(145deg,#2c2e2f,#232526)] text-[#9a9c9d] shadow-[inset_0_1px_1px_rgba(255,255,255,.08),inset_0_-8px_16px_rgba(0,0,0,.3),0_4px_10px_rgba(0,0,0,.25)] transition duration-200 hover:scale-105 hover:text-[#f0f0f0] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none sm:size-10 lg:size-[52px]"
      {...props}
    >
      <svg viewBox="0 0 24 24" className="size-[13px] fill-current sm:size-[17px] lg:size-[22px]" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}
