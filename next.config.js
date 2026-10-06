/** @type {import('next').NextConfig} */
const BACKEND = process.env.BACKEND_URL ?? "http://localhost:5000";

const nextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  async rewrites() {
    return [
      // Proxy all API calls to the Express backend. Frontend fetch("/api/...")
      // keeps working unchanged; Next forwards to :5000 server-side (no CORS).
      { source: "/api/:path*", destination: `${BACKEND}/api/:path*` },
    ];
  },
};
module.exports = nextConfig;
