/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/core", "@repo/ui", "@repo/supabase"],
};

module.exports = nextConfig;
