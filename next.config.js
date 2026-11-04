/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  async rewrites() {
    return [
      {
        source: "/api/admin/registrations\\.csv",
        destination: `${process.env.BACKEND_URL || "http://localhost:3200"}/api/admin/registrations-csv`,
      },
      {
        // Keep browser calls relative while the API runs as a separate service.
        // In development this points at the backend on port 3200; production
        // should set BACKEND_URL to the deployed backend origin.
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "http://localhost:3200"}/api/:path*`,
      },
    ];
  },
};
module.exports = nextConfig;
