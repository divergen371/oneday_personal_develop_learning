import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  
  // 開発環境でのクロスオリジンリクエストを許可
  experimental: {
    allowedDevOrigins: ['localhost', '*.loca.lt', '*.ngrok.io']
  }
} as NextConfig;

export default nextConfig;
