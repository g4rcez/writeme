/** @type {import('next').NextConfig} */
module.exports = {
  amp: true,
  compress: true,
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { esmExternals: true },
};
