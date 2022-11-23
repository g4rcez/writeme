const modules = ["lego", "markdown"];

module.exports = {
  reactStrictMode: true,
  experimental: {
    transpilePackages: modules,
  },
};
