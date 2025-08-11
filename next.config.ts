import type { NextConfig } from "next";

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
};

export default nextConfig;
