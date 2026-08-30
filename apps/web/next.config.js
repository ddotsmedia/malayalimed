/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@mm/db', '@mm/cache', '@mm/auth'],
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: false }
};
export default nextConfig;
