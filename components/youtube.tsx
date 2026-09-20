"use client";

import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const loadYouTubeAPI = (): Promise<any> => {
  if (typeof window === "undefined") return Promise.reject();
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);

  return new Promise((resolve) => {
    const existingScript = document.getElementById("yt-iframe-api");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "yt-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT);
    };
  });
};

export default function YouTubeEmbed({
  videoId,
}: {
  videoId: string;
  title?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerInstance = useRef<any>(null);
  const initialVolumeSet = useRef(false);
  const prevVolume = useRef(50);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeAPI()
      .then((yt) => {
        if (cancelled || !containerRef.current) return;

        playerInstance.current = new yt.Player(containerRef.current, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event: any) => {
              if (cancelled) return;
              try {
                event.target.unMute?.();
                event.target.setVolume?.(50);
                setIsMuted(false);
                setVolume(50);
              } catch {}
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (cancelled) return;
              if (event.data === yt.PlayerState.PLAYING) {
                setIsPlaying(true);
                if (!initialVolumeSet.current) {
                  initialVolumeSet.current = true;
                  try {
                    event.target.unMute?.();
                    event.target.setVolume?.(50);
                    setIsMuted(false);
                    setVolume(50);
                  } catch {}
                }
              } else if (
                event.data === yt.PlayerState.PAUSED ||
                event.data === yt.PlayerState.ENDED
              ) {
                setIsPlaying(false);
              }
            },
          },
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      try {
        playerInstance.current?.destroy?.();
      } catch {}
      playerInstance.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const player = playerInstance.current;
      if (
        player &&
        typeof player.getCurrentTime === "function" &&
        typeof player.getDuration === "function"
      ) {
        const current = player.getCurrentTime() || 0;
        const duration = player.getDuration() || 0;
        if (duration > 0) {
          setProgress((current / duration) * 100);
        }
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    const player = playerInstance.current;
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
    } else {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  const changeVolume = (newVol: number) => {
    const player = playerInstance.current;
    const clamped = Math.max(0, Math.min(100, Math.round(newVol)));
    setVolume(clamped);
    if (player) {
      try {
        if (clamped === 0) {
          player.mute?.();
          setIsMuted(true);
        } else {
          if (isMuted) {
            player.unMute?.();
            setIsMuted(false);
          }
          player.setVolume?.(clamped);
        }
      } catch {}
    }
    if (clamped > 0) {
      prevVolume.current = clamped;
    }
  };

  const toggleMute = () => {
    const player = playerInstance.current;
    if (!player) return;
    try {
      if (isMuted || volume === 0) {
        player.unMute?.();
        const restoreVol = prevVolume.current || 50;
        player.setVolume?.(restoreVol);
        setVolume(restoreVol);
        setIsMuted(false);
      } else {
        prevVolume.current = volume;
        player.mute?.();
        setIsMuted(true);
      }
    } catch {}
  };


  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const player = playerInstance.current;
    if (!player || typeof player.getDuration !== "function") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const duration = player.getDuration() || 0;
    player.seekTo(pos * duration, true);
    setProgress(pos * 100);
  };

  const handleSeekKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const player = playerInstance.current;
    if (!player || typeof player.getCurrentTime !== "function") return;
    const current = player.getCurrentTime() || 0;
    const duration =
      (typeof player.getDuration === "function" ? player.getDuration() : 0) ||
      0;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      player.seekTo(Math.max(0, current - 5), true);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      player.seekTo(
        duration ? Math.min(duration, current + 5) : current + 5,
        true
      );
    }
  };

  return (
    <div className="relative group select-none flex items-center justify-center w-[min(90vw,calc(90svh*16/9))] max-w-[90vw] max-h-[90svh] aspect-video overflow-hidden bg-black [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:block [&_iframe]:border-0">
      <div ref={containerRef} className="w-full h-full pointer-events-none" />

      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={togglePlay}
      />

      <div className="absolute bottom-0 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md text-white/80 hover:text-white transition-opacity duration-150 ease-out w-full h-15 px-4 opacity-0 group-hover:opacity-100">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="cursor-pointer hover:opacity-80 flex items-center justify-center w-5 h-5 shrink-0"
        >
          {isPlaying ? (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="5" y="4" width="4" height="16" rx="1" />
              <rect x="15" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="6,4 20,12 6,20" />
            </svg>
          )}
        </button>

        <div
          role="slider"
          tabIndex={0}
          aria-label="Seek video"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          onClick={handleSeek}
          onKeyDown={handleSeekKeyDown}
          className="flex-1 h-1 bg-white/25 hover:h-1.5 rounded-full cursor-pointer relative overflow-hidden transition-[height] duration-150"
        >
          <div
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
            className="cursor-pointer hover:opacity-80 flex items-center justify-center w-5 h-5"
          >
            {isMuted || volume === 0 ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon
                  points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                  fill="currentColor"
                />
                <line x1="22" y1="9" x2="16" y2="15" />
                <line x1="16" y1="9" x2="22" y2="15" />
              </svg>
            ) : volume <= 50 ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon
                  points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                  fill="currentColor"
                />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon
                  points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                  fill="currentColor"
                />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={isMuted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            aria-label="Volume"
            style={{
              background: `linear-gradient(to right, rgba(255,255,255,0.9) ${
                isMuted ? 0 : volume
              }%, rgba(255,255,255,0.25) ${isMuted ? 0 : volume}%)`,
            }}
            className="w-14 sm:w-20 h-1 rounded-full cursor-pointer appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
          />
        </div>
      </div>
    </div>
  );
}