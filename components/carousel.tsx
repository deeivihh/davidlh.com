"use client";

import { useRef, useState, useEffect } from "react";

export type MediaItem = {
  type: "video" | "img";
  src: string;
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

  const stopDrag = () => {
    drag.current.isDown = false;
    setIsDragging(false);
    setTimeout(() => (drag.current.moved = false), 50);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseDown = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      if (e.clientY >= rect.top + el.clientHeight) return;
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
      className={`flex gap-2.5 overflow-x-auto w-full overscroll-x-contain pb-3 pr-6 custom-scrollbar select-none ${
        isDragging ? "cursor-grabbing [&_*]:cursor-grabbing" : "cursor-grab"
      }`}
    >
      {media.map((item) => (
        <button
          key={item.src}
          type="button"
          onClick={() => !drag.current.moved && setActive(item)}
          className={`h-32 sm:h-40 shrink-0 p-0 border-0 bg-transparent text-left cursor-pointer ${
            isDragging ? "cursor-grabbing" : ""
          }`}
        >
          {renderMedia(item)}
        </button>
      ))}
    </div>
  );
}
