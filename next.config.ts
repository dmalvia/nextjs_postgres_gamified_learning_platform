import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This allows all HTTPS images (for development only)
      },
      {
        protocol: "http",
        hostname: "**", // This allows all HTTP images (for development only)
      },
      // For production, you should specify exact domains:
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'avatars.githubusercontent.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'img.clerk.com',
      // },
    ],
  },
};

export default nextConfig;
