import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Set this to 10MB or higher based on your needs
    },
  },
};

export default nextConfig;
