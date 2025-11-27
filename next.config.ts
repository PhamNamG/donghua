import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "res.cloudinary.com",
      "hhanime3d.com",
      "wx1.sinaimg.cn",
      "wx2.sinaimg.cn"
    ],
    formats: ["image/avif", "image/webp"],
    unoptimized: true
  },
};

export default nextConfig;
