// src/app/manifest.ts

import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    display_override: ["window-controls-overlay"],
    protocol_handlers: [{ protocol: "mailto", url: "/newEmail?to=%s" }],
    name: "gibspons: sponsorships made easy",
    short_name:
      "gibspons",
    start_url: "The URL that should be loaded when your application is opened",
    display: "standalone",
    description: "A description for your application",
    lang: "in/en",
    dir: "auto",
    theme_color: "#000000",
    background_color: "#000000",
    orientation: "any",
    icons: [
      {
        src: "./public/icon.svg",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "https://www.pwabuilder.com/assets/screenshots/screen1.png",
        sizes: "2880x1800",
        type: "image/png",
      },
    ],
    prefer_related_applications: false,
  };
}
