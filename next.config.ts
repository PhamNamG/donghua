import type { NextConfig } from "next";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "res.cloudinary.com",
      "hhanime3d.com",
      "wx1.sinaimg.cn",
      "wx2.sinaimg.cn"
    ],
    formats: ["image/avif", "image/webp"]
  },
  output: "standalone",
};

export default nextConfig;
