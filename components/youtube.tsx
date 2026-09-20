"use client";

import { useEffect, useRef } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "lite-youtube": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          videoid?: string;
          videotitle?: string;
          params?: string;
          autoload?: boolean;
          posterquality?: string;
        },
        HTMLElement
      >;
    }
  }
}

export default function YouTubeEmbed({
  videoId,
  title = "YouTube video",
}: {
  videoId: string;
  title?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current as any;
    if (!el) return;

    const play = () => {
      if (el.addIframe) {
        el.addIframe();
      } else {
        el.click();
      }

      const sendCommand = (func: string, args: any[] = []) => {
        const iframe = el.shadowRoot?.querySelector("iframe");
        iframe?.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func, args }),
          "*"
        );
      };

      const enforceQualityAndPlay = () => {
        sendCommand("setPlaybackQuality", ["hd1080"]);
        sendCommand("setPlaybackQualityRange", ["hd1080", "hd1080"]);
        sendCommand("setPlaybackQualityRange", ["hd1080"]);
        sendCommand("playVideo");
      };

      const iframe = el.shadowRoot?.querySelector("iframe");
      if (iframe) {
        iframe.addEventListener("load", () => {
          setTimeout(enforceQualityAndPlay, 100);
          setTimeout(enforceQualityAndPlay, 500);
        });
      }

      setTimeout(enforceQualityAndPlay, 300);
      setTimeout(enforceQualityAndPlay, 800);
    };

    if (typeof customElements !== "undefined" && customElements.get("lite-youtube")) {
      play();
    } else {
      import("@justinribeiro/lite-youtube").then(() => {
        customElements.whenDefined("lite-youtube").then(play);
      });
    }
  }, []);

  return (
    <div className="w-[min(90vw,calc(90svh*16/9))] max-w-[90vw] max-h-[90svh] aspect-video flex items-center justify-center overflow-hidden bg-black">
      <lite-youtube
        ref={ref}
        videoid={videoId}
        videotitle={title}
        posterquality="maxresdefault"
        params="autoplay=1&playsinline=1&enablejsapi=1&vq=hd1080"
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
