/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@mm/db', '@mm/cache', '@mm/auth'],
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true }
};
export default nextConfig;
