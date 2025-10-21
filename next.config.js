const nextConfig = { reactStrictMode: true }; export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false, // <---- AGGIUNGI QUESTO
  },
};

export default nextConfig;
