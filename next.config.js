/** @type {import('next').NextConfig} */
module.exports = {
  compress: true,
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { esmExternals: true },
};
