import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/vst',
  assetPrefix: '/vst',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '148.206.168.178',
        port: '',
        pathname: '/vst/uploads/**',
      },
    ],
  },
};


export default nextConfig;
