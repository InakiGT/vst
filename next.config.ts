import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/vst',
  assetPrefix: '/vst',
  images: {
    loader: 'default',
    path: '/vst/_next/image',
  },
};

export default nextConfig;
