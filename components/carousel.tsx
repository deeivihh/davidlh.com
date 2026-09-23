"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export type MediaItem = {
  type: "video" | "img" | "youtube";
  src: string;
  title?: string;
};

type CarouselProps = {
  media: MediaItem[];
  setActive: (item: MediaItem) => void;
  renderMedia: (item: MediaItem, isMax?: boolean) => React.ReactNode;
};

export default function Carousel({
  media,
  setActive,
  renderMedia,
}: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ isDown: false, startX: 0, scroll: 0, moved: false });
  const [isDragging, setIsDragging] = useState(false);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);
  const [loadedSet, setLoadedSet] = useState<Set<string>>(() => new Set());
  const [timedOut, setTimedOut] = useState(false);

  const stopDrag = () => {
    drag.current.isDown = false;
    setIsDragging(false);
    setTimeout(() => (drag.current.moved = false), 50);
  };

  const handleItemLoaded = useCallback((src: string) => {
    setLoadedSet((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  const targetMedia = media.slice(0, Math.min(media.length, 3));
  const isCarouselReady =
    timedOut || (targetMedia.length > 0 && targetMedia.every((item) => loadedSet.has(item.src)));

  useEffect(() => {
    setLoadedSet(new Set());
    setTimedOut(false);
    const timer = setTimeout(() => setTimedOut(true), 600);
    return () => clearTimeout(timer);
  }, [media]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateMaxWidth = () => {
      const buttons = Array.from(
        el.querySelectorAll(":scope > button")
      ) as HTMLElement[];
      const targetButtons = buttons.slice(0, Math.min(media.length, 3));
      if (targetButtons.length === 0) return;
      if (!targetButtons.every((btn) => btn.offsetWidth > 0)) return;

      const gap = parseFloat(window.getComputedStyle(el).gap) || 10;
      const totalWidth =
        targetButtons.reduce((sum, btn) => sum + btn.offsetWidth, 0) +
        (targetButtons.length - 1) * gap;

      const parentWidth = el.parentElement?.clientWidth || window.innerWidth;
      setMaxWidth(Math.ceil(Math.min(totalWidth, parentWidth)));
    };

    updateMaxWidth();

    const resizeObserver = new ResizeObserver(updateMaxWidth);
    const buttons = el.querySelectorAll(":scope > button");
    buttons.forEach((btn) => resizeObserver.observe(btn));

    window.addEventListener("resize", updateMaxWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMaxWidth);
    };
  }, [media, isCarouselReady]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseDown = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      if (e.clientY >= rect.top + el.clientHeight) return;
      if (el.scrollWidth <= el.clientWidth) return;
      drag.current = { isDown: true, startX: e.pageX, scroll: el.scrollLeft, moved: false };
      setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!drag.current.isDown) return;
      const walk = e.pageX - drag.current.startX;
      if (Math.abs(walk) > 4) drag.current.moved = true;
      el.scrollLeft = drag.current.scroll - walk;
    };

    const handleGlobalMouseUp = () => {
      if (drag.current.isDown) stopDrag();
    };

    const handleDragStart = (e: DragEvent) => e.preventDefault();

    el.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    el.addEventListener("dragstart", handleDragStart);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      el.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: maxWidth ? `${maxWidth}px` : undefined,
      }}
      className={`flex gap-2.5 overflow-x-auto w-fit max-w-full overscroll-x-contain pb-3 custom-scrollbar select-none min-h-[8.75rem] sm:min-h-[10.75rem] ${
        isDragging ? "cursor-grabbing [&_*]:cursor-grabbing" : "cursor-grab"
      }`}
    >
      {media.map((item) => (
        <CarouselItem
          key={item.src}
          item={item}
          isDragging={isDragging}
          drag={drag}
          setActive={setActive}
          renderMedia={renderMedia}
          isCarouselReady={isCarouselReady}
          onLoaded={handleItemLoaded}
        />
      ))}
    </div>
  );
}

function CarouselItem({
  item,
  isDragging,
  drag,
  setActive,
  renderMedia,
  isCarouselReady,
  onLoaded,
}: {
  item: MediaItem;
  isDragging: boolean;
  drag: React.MutableRefObject<{ isDown: boolean; startX: number; scroll: number; moved: boolean }>;
  setActive: (item: MediaItem) => void;
  renderMedia: (item: MediaItem, isMax?: boolean) => React.ReactNode;
  isCarouselReady: boolean;
  onLoaded: (src: string) => void;
}) {
  const wrapperRef = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);

  const handleLoaded = useCallback(() => {
    setLoaded(true);
    onLoaded(item.src);
  }, [item.src, onLoaded]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    el.addEventListener("load", handleLoaded, true);
    el.addEventListener("loadeddata", handleLoaded, true);

    const imgs = Array.from(el.querySelectorAll("img"));
    const videos = Array.from(el.querySelectorAll("video"));
    const hasMedia = imgs.length > 0 || videos.length > 0;
    const imgsReady = imgs.every((img) => img.complete && img.naturalWidth > 0);
    const videosReady = videos.every((v) => v.readyState >= 2);
    if (!hasMedia || (imgs.length > 0 ? imgsReady : true) && (videos.length > 0 ? videosReady : true)) {
      setLoaded(true);
    }

    return () => {
      el.removeEventListener("load", handleLoaded, true);
      el.removeEventListener("loadeddata", handleLoaded, true);
    };
  }, [handleLoaded]);

  return (
    <button
      ref={wrapperRef}
      key={item.src}
      type="button"
      onClick={() => !drag.current.moved && setActive(item)}
      className={`shrink-0 h-32 sm:h-40 w-auto p-0 border-0 bg-neutral-100 text-left cursor-pointer overflow-hidden [&>img]:h-full [&>img]:w-auto [&>img]:object-cover [&>video]:h-full [&>video]:w-auto transition-opacity duration-500 ease-out ${
        isCarouselReady ? "opacity-100" : "opacity-0 pointer-events-none"
      } ${
        isDragging ? "cursor-grabbing" : ""
      }`}
    >
      {renderMedia(item)}
    </button>
  );
}
