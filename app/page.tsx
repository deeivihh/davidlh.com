"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import Video from "@/components/video";
import Carousel, { type MediaItem } from "@/components/carousel";

const projects = [
  {
    title: "¿Me puedo quedar?",
    description:
      "A web platform that helps people evaluate whether a municipality in Castilla y León fits their needs by combining public data on services, connectivity, education, healthcare, housing, and local opportunities.",
    media: [
      { type: "video", src: "/projects/mepuedoquedar-es/video.mp4" },
      { type: "img", src: "/projects/mepuedoquedar-es/0.jpg" },
      { type: "img", src: "/projects/mepuedoquedar-es/1.jpg" },
      { type: "img", src: "/projects/mepuedoquedar-es/2.jpg" },
    ] as MediaItem[],
  },
  {
    title: "Dione",
    description:
      "A platform designed to simplify how people interact with AI. Whether you're a developer, researcher, or just curious, Dione lets you discover, preview, and install AI apps instantly, without the need for complex setup or infrastructure.",
    media: [
      { type: "img", src: "/projects/dione/0.jpg" },
      { type: "video", src: "/projects/dione/video.mp4" },
      { type: "img", src: "/projects/dione/1.jpg" },
      { type: "img", src: "/projects/dione/2.jpg" },
      { type: "img", src: "/projects/dione/3.jpg" },
    ] as MediaItem[],
  },
  {
    title: "Applio",
    description:
      "A powerful voice conversion tool focused on simplicity, quality, and performance. Applio offers a straightforward platform for high-quality voice transformations. Its flexible design allows for customization through plugins and configurations, catering to a wide range of projects.",
    media: [
      { type: "img", src: "/projects/applio/1.jpg" },
      { type: "img", src: "/projects/applio/2.jpg" }
    ] as MediaItem[],
  },
];

export default function Home() {
  const [active, setActive] = useState<MediaItem | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const renderMedia = (item: MediaItem, isMax = false) =>
    item.type === "video" ? (
      <Video src={item.src} isMax={isMax} />
    ) : (
      <img
        src={item.src}
        alt="Media"
        className="w-full h-full max-w-5xl"
      />
    );

  return (
    <LazyMotion features={domAnimation}>
      <main className="mt-[10svh] pb-10 max-w-[75ch] flex flex-col gap-10 justify-start items-start mx-auto">
        <section>
          <div className="flex flex-col gap-2 w-full">
            <h1 className="text-5xl">David Lahoz</h1>
            <h3 className="text-xl px-0.5">is a <span className="italic font-medium">frontend developer</span> and <span className="italic font-medium">marketing student</span> working across digital products, data, AI and brand experiences.</h3>
          </div>
        </section>
        <section className="px-0.5 w-full">
          <div className="flex flex-col gap-6 w-full">
            <span className="uppercase font-bold text-sm">Projects</span>
            <ul className="grid gap-6 w-full">
              {projects.map((project) => (
                <li key={project.title} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 w-full">
                    <span className="text-xl">{project.title}</span>
                    <span className="text-xs">{project.description}</span>
                  </div>
                  <div className="relative w-full">
                    <Carousel
                      media={project.media}
                      setActive={setActive}
                      renderMedia={renderMedia}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <AnimatePresence>
          {active && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setActive(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActive(null);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Close preview"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-zoom-out bg-black/80 backdrop-blur-md"
            >
              <m.div
                initial={{
                  scale: shouldReduceMotion ? 1 : 0.93,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    duration: 0.32,
                    bounce: 0.08,
                  },
                }}
                exit={{
                  scale: shouldReduceMotion ? 1 : 0.93,
                  opacity: 0,
                  transition: {
                    duration: 0.18,
                    ease: [0.23, 1, 0.32, 1],
                  },
                }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                className="relative z-10 cursor-default overflow-hidden"
              >
                {renderMedia(active, true)}
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </main>
    </LazyMotion>
  );
}
