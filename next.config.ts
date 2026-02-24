import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Only whitelist domains you actually use, e.g.:
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google avatars
      { protocol: 'https', hostname: '*.supabase.co' }, // Supabase storage
    ],
  },
  // Remove ignoreBuildErrors — fix the TS errors properly before launch
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
};

export default nextConfig;