/** @type {import('next').NextConfig} */
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts", // where the service worker src is
  swDest: "public/sw.js", // where the service worker code will end up
});

export default withSerwist({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com/mantinedev/mantine/master/**",
      },
    ],
  },
});
