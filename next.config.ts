import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable image optimization
    formats: ['image/webp', 'image/avif'],
    // Add domains if you're loading images from external sources
    domains: [
      'cdn.jsdelivr.net',
      'cdn4.iconfinder.com',
      'res.cloudinary.com',
      'cdn.openai.com',
      'upload.wikimedia.org',
      'jwt.io',
      'www.docker.com',
      'cdn.sanity.io',
      'www.postman.com',
      'assets.vercel.com',
      'github.githubassets.com',
      'a0.awsstatic.com',
      'avatars.githubusercontent.com',
      'img.shields.io',
      'img.icons8.com',
      'img.stackshare.io',
      'simpledata.io',
      'raw.githubusercontent.com'
    ],
    // Configure image sizes for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable placeholder blur for better UX
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Compress responses
  compress: true,
  // Enable SWC minification
  swcMinify: true,
};

export default nextConfig;
