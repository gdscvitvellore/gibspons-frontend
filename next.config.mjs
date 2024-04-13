/** @type {import('next').NextConfig} */
console.log("next.config.js");
const nextConfig = {
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
};

export default nextConfig;
