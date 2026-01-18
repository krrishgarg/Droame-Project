import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Crucial for AWS S3 (Static Site)
  basePath: "/beta/krrish", // Tells the app it lives in this subfolder
  images: {
    unoptimized: true, // Required because S3 cannot optimize images on the fly
  },
};

export default nextConfig;