import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mode standalone pour Docker
  output: 'standalone',

  // Configuration des images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  // Variables d'environnement exposées au client
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
};

export default nextConfig;
