const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});
// const withRemoteRefresh = require("next-remote-refresh")({
//   paths: [require("path").resolve(process.cwd(), "pages/docs")],
//   ignored: "**/*.tsx",
// });

/** @type {import('next').NextConfig} */
module.exports = withMDX({
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { esmExternals: true, concurrentFeatures: true, serverComponents: true },
});
