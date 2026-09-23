"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export default function Video({
  src,
  isMax = false,
}: {
  src: string;
  isMax?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const handleLoaded = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    const v = videoRef.current;
    if (v && v.readyState >= 2) setLoaded(true);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const handleSeekKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 5
      );
    }
  };

  if (!isMax) {
    return (
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={handleLoaded}
        className={`h-full w-auto block pointer-events-none transition-opacity duration-500 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    );
  }

  return (
    <div className="relative group select-none flex items-center justify-center w-fit max-w-full max-h-[85svh]">
      <video
        muted
        ref={videoRef}
        src={src}
        autoPlay
        loop
        playsInline
        onClick={togglePlay}
        onLoadedData={handleLoaded}
        onTimeUpdate={() => {
          if (videoRef.current && videoRef.current.duration) {
            setProgress(
              (videoRef.current.currentTime / videoRef.current.duration) * 100
            );
          }
        }}
        className={`max-w-full max-h-[85svh] lg:max-w-4xl w-auto h-auto block cursor-pointer object-contain transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="absolute bottom-0 flex items-center gap-3 bg-black/60 backdrop-blur-md text-white/80 hover:text-white transition-opacity duration-150 ease-out w-full h-10 px-4 opacity-0 group-hover:opacity-100">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="cursor-pointer hover:opacity-80 flex items-center justify-center w-5 h-5"
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
          className="w-full h-1 bg-white/25 hover:h-1.5 rounded-full cursor-pointer relative overflow-hidden"
        >
          <div
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
