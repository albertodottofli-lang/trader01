/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false, // forza disattivazione App Router
  },
};

module.exports = nextConfig;
