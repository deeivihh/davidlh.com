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
  if (window.YT?.Player) return Promise.resolve(window.YT);

  return new Promise((resolve) => {
    if (!document.getElementById("yt-iframe-api")) {
      const script = document.createElement("script");
      script.id = "yt-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
  });
};

const isMobileDevice = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

const getSavedVolume = (): number => {
  if (typeof window === "undefined") return 50;
  try {
    const saved = Number(localStorage.getItem("yt_volume"));
    return !isNaN(saved) && saved >= 0 && saved <= 100 ? saved : 50;
  } catch {
    return 50;
  }
};

const setSavedVolume = (val: number) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("yt_volume", String(val));
  } catch { }
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
  const prevVolume = useRef(getSavedVolume());
  const tracksRef = useRef<any[]>([]);

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(() => getSavedVolume());
  const [isMuted, setIsMuted] = useState(() =>
    typeof window !== "undefined" ? isMobileDevice() : false
  );
  const [isCaptionsEnabled, setIsCaptionsEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const isMobile = isMobileDevice();
    setIsCaptionsEnabled(false);
    tracksRef.current = [];

    if (isMobile) setIsMuted(true);

    const updateTracks = (target: any) => {
      try {
        const tracks = target?.getOption?.("captions", "tracklist");
        if (Array.isArray(tracks) && tracks.length > 0) {
          tracksRef.current = tracks;
        }
      } catch { }
    };

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
            cc_lang_pref: "en",
            hl: "en",
            mute: isMobile ? 1 : 0,
            origin:
              typeof window !== "undefined" ? window.location.origin : undefined,
          },
          events: {
            onReady: (event: any) => {
              if (cancelled) return;
              try {
                event.target.loadModule?.("captions");
                event.target.getIframe?.()?.setAttribute(
                  "allow",
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                );
              } catch { }

              const initialVol = getSavedVolume();
              try {
                if (isMobile) {
                  event.target.mute?.();
                } else {
                  event.target.unMute?.();
                }
                event.target.setVolume?.(initialVol);
                setIsMuted(isMobile);
                setVolume(initialVol);
              } catch { }
              event.target.playVideo();
            },
            onApiChange: (event: any) => {
              if (!cancelled) updateTracks(event.target);
            },
            onStateChange: (event: any) => {
              if (cancelled) return;
              if (event.data === yt.PlayerState.PLAYING) {
                setIsPlaying(true);
                try { event.target.loadModule?.("captions"); } catch { }
                setTimeout(() => {
                  if (!cancelled) updateTracks(playerInstance.current);
                }, 400);

                if (!isMobile && !initialVolumeSet.current) {
                  initialVolumeSet.current = true;
                  const initialVol = getSavedVolume();
                  try {
                    event.target.unMute?.();
                    event.target.setVolume?.(initialVol);
                    setIsMuted(false);
                    setVolume(initialVol);
                  } catch { }
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
      .catch(() => { });

    return () => {
      cancelled = true;
      try { playerInstance.current?.destroy?.(); } catch { }
      playerInstance.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const player = playerInstance.current;
      const cur = player?.getCurrentTime?.() || 0;
      const dur = player?.getDuration?.() || 0;
      if (dur > 0) setProgress((cur / dur) * 100);
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
    const clamped = Math.max(0, Math.min(100, Math.round(newVol)));
    setVolume(clamped);
    if (clamped > 0) {
      prevVolume.current = clamped;
      setSavedVolume(clamped);
    }
    const player = playerInstance.current;
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
      } catch { }
    }
  };

  const toggleMute = () => {
    const player = playerInstance.current;
    if (!player) return;
    try {
      if (isMuted || volume === 0) {
        player.unMute?.();
        const restoreVol = prevVolume.current || getSavedVolume() || 50;
        player.setVolume?.(restoreVol);
        setVolume(restoreVol);
        setIsMuted(false);
      } else {
        prevVolume.current = volume;
        player.mute?.();
        setIsMuted(true);
      }
    } catch { }
  };

  const toggleCaptions = () => {
    const player = playerInstance.current;
    if (!player) return;

    if (isCaptionsEnabled) {
      try {
        player.setOption?.("captions", "track", {});
        player.unloadModule?.("captions");
      } catch { }
      setIsCaptionsEnabled(false);
      return;
    }

    try { player.loadModule?.("captions"); } catch { }

    const applyEnglishTrack = () => {
      const tracks = tracksRef.current.length
        ? tracksRef.current
        : player.getOption?.("captions", "tracklist") || [];

      if (Array.isArray(tracks) && tracks.length > 0) {
        tracksRef.current = tracks;
        const chosen =
          tracks.find((t: any) =>
            (t?.languageCode || t?.lang || t?.vss_id || "")
              .toLowerCase()
              .includes("en")
          ) || tracks[0];

        try {
          player.setOption?.("captions", "track", chosen);
          if (chosen?.languageCode) {
            player.setOption?.("captions", "track", {
              languageCode: chosen.languageCode,
            });
          }
        } catch { }
      } else {
        try {
          player.setOption?.("captions", "track", { languageCode: "en" });
        } catch { }
      }
    };

    applyEnglishTrack();
    setTimeout(applyEnglishTrack, 300);
    setIsCaptionsEnabled(true);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const player = playerInstance.current;
    const dur = player?.getDuration?.();
    if (!player || !dur) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    player.seekTo(pos * dur, true);
    setProgress(pos * 100);
  };

  const handleSeekKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const player = playerInstance.current;
    if (!player) return;
    const cur = player.getCurrentTime?.() || 0;
    const dur = player.getDuration?.() || 0;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      player.seekTo(Math.max(0, cur - 5), true);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      player.seekTo(dur ? Math.min(dur, cur + 5) : cur + 5, true);
    }
  };

  return (
    <div className="select-none w-[min(90vw,calc(80svh*16/9))] max-w-[90vw] aspect-video">
      <div className="flex items-center justify-center w-full h-full overflow-hidden bg-black [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:block [&_iframe]:border-0">
        <div ref={containerRef} className="w-full h-full pointer-events-none" />

        <button
          type="button"
          aria-label={isPlaying ? "Pause video" : "Play video"}
          onClick={togglePlay}
          className="absolute inset-0 z-10 cursor-pointer w-full h-full bg-transparent border-0"
        />
      </div>

      <div className="absolute top-full inset-x-0 w-[50%] mx-auto mt-4 flex items-center gap-3 bg-black/60 backdrop-blur-md text-white/80 hover:text-white h-10 px-4">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="cursor-pointer hover:opacity-80 flex items-center justify-center w-5 h-5 shrink-0"
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="5" y="4" width="4" height="16" rx="1" />
              <rect x="15" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
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
            onClick={toggleCaptions}
            aria-label={isCaptionsEnabled ? "Desactivar subtítulos" : "Activar subtítulos"}
            className={`cursor-pointer flex flex-col items-center justify-center w-5 h-5 relative transition-opacity duration-150 ${isCaptionsEnabled ? "opacity-100 text-white" : "opacity-40 hover:opacity-80 text-white"
              }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M10 9.5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5a2 2 0 0 0 2 2 2 2 0 0 0 2-2" />
              <path d="M18 9.5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5a2 2 0 0 0 2 2 2 2 0 0 0 2-2" />
            </svg>
            {isCaptionsEnabled && (
              <span className="absolute -bottom-1 w-3 h-0.5 bg-white rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
            className="cursor-pointer hover:opacity-80 flex items-center justify-center w-5 h-5"
          >
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
              {isMuted || volume === 0 ? (
                <>
                  <line x1="22" y1="9" x2="16" y2="15" />
                  <line x1="16" y1="9" x2="22" y2="15" />
                </>
              ) : volume <= 50 ? (
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              ) : (
                <>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </>
              )}
            </svg>
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
              background: `linear-gradient(to right, rgba(255,255,255,0.9) ${isMuted ? 0 : volume
                }%, rgba(255,255,255,0.25) ${isMuted ? 0 : volume}%)`,
            }}
            className="w-14 sm:w-20 h-1 rounded-full cursor-pointer appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
          />
        </div>
      </div>
    </div>
  );
}