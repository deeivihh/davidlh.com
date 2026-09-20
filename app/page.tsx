"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import Video from "@/components/video";
import Carousel, { type MediaItem } from "@/components/carousel";

const projects = [
  {
    title: "¿Me puedo quedar?",
    description:
      "A web platform that helps people evaluate whether a municipality in Castilla y León fits their needs by combining public data on services, connectivity, education, healthcare, housing, and local opportunities.",
    href: "https://mepuedoquedar.es",
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
    href: "https://github.com/dioneapp/dioneapp",
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
    href: "https://github.com/iahispano/Applio",
    media: [
      { type: "img", src: "/projects/applio/1.jpg" },
      { type: "img", src: "/projects/applio/2.jpg" }
    ] as MediaItem[],
  },
];

export default function Home() {
  const [active, setActive] = useState<MediaItem | null>(null);
  const [msg, setMsg] = useState("");
  const timer = useRef<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const flash = (text: string) => {
    setMsg(text);
    clearTimeout(timer.current!);
    timer.current = setTimeout(() => setMsg(""), 2000);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    if (e.detail > 1) {
      clearTimeout(timer.current!);
      flash("(opening your mail client...)");
      window.location.href = "mailto:hello@davidlh.com";
    } else {
      timer.current = setTimeout(() => {
        navigator.clipboard?.writeText("hello@davidlh.com");
        flash("(copied to clipboard!)");
      }, 160);
    }
  };

  useEffect(() => () => clearTimeout(timer.current!), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (active) {
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
      };
    }
  }, [active]);

  const renderMedia = (item: MediaItem, isMax = false) =>
    item.type === "video" ? (
      <Video src={item.src} isMax={isMax} />
    ) : (
      <img
        src={item.src}
        alt="Media"
        className={
          isMax
            ? "max-w-full max-h-[85svh] lg:max-w-4xl w-auto h-auto block object-contain"
            : "h-full w-auto block object-cover"
        }
      />
    );

  return (
    <LazyMotion features={domAnimation}>
      <main className="mt-[8svh] pb-10 max-w-[75ch] flex flex-col gap-10 justify-start items-start mx-auto">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 w-full">
            <h1 className="text-5xl">David Lahoz</h1>
            <h3 className="text-xl px-0.5">is a <span className="italic font-medium">frontend developer</span> and <span className="italic font-medium">marketing student</span> working across digital products, data, AI and brand experiences.</h3>
          </div>
          <address
            onClick={handleContactClick}
            className="group relative flex items-center w-fit px-0.5 cursor-pointer select-none"
          >
            <a className="font-semibold">hello@davidlh.com</a>
            <span
              className={`absolute left-full top-1/2 -translate-y-1/2 text-xs transition-[opacity,margin-left,filter,pointer-events] duration-200 whitespace-nowrap select-none ${msg
                ? "ml-2 opacity-100 blur-none pointer-events-auto"
                : "hidden sm:inline -ml-2 group-hover:ml-2 opacity-0 group-hover:opacity-100 blur group-hover:blur-none pointer-events-none group-hover:pointer-events-auto"
                }`}
            >
              {msg || "(one click to copy — two to open in your mail client)"}
            </span>
          </address>
        </section>
        <section className="px-0.5 w-full">
          <div className="flex flex-col gap-6 w-full">
            <span className="uppercase font-bold text-sm">Projects</span>
            <ul className="grid gap-6 w-full">
              {projects.map((project) => (
                <li key={project.title} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 w-full">
                    <a href={project.href} target="_blank" rel="noopener noreferrer" className="text-xl flex items-center gap-2 group cursor-pointer w-fit">{project.title}
                      <span className="opacity-0 -ml-4 group-hover:ml-0 group-hover:opacity-100 blur-lg group-hover:blur-none w-4 h-4 transition-[opacity,margin-left,filter,pointer-events] duration-150"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#333333"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="arrow-up-right"> <g> <polyline data-name="Right" fill="none" id="Right-2" points="18.7 12.4 18.7 5.3 11.6 5.3" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline> <line fill="none" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="5.3" x2="17.1" y1="18.7" y2="6.9"></line> </g> </g> </g> </g></svg></span>
                    </a>
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
                className="relative z-10 cursor-default overflow-hidden max-w-full max-h-[85svh] flex items-center justify-center"
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
