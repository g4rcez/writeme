const plugin = require("tailwindcss/plugin");

const Colors = {
  transparent: "transparent",
  dropdown: {
    bg: "#121212",
    text: "#ccc",
  },
  navbar: {
    bg: "#282A36",
    text: "#d1d5db",
  },
  fail: {
    normal: "#EF4444",
    hover: "#BF3636",
  },
  success: {
    normal: "#34D399",
  },
  form: {
    "text-input": "#282A36",
    "bg-input": "#ffffff",
  },
  http: {
    get: "#64d2ff",
    post: "#6EE7B7",
    patch: "#A78BFA",
    put: "#F472B6",
    delete: "#EF4444",
    info: "#64d2ff",
    success: "#6EE7B7",
    redirect: "#A78BFA",
    client: "#ffcc00",
    server: "#EF4444",
  },
  text: {
    paragraph: "#3d3f4a",
    title: "#181920",
    invert: "#888",
    normal: "#6B7280",
    dim: "#aeaeb2",
    slight: "#D1D5DB",
    warn: "#ffcc00",
  },
  border: {
    strong: "#8e8e93",
    slight: "#e5e5ea",
    neutral: "#d1d1d6",
  },
  neutral: {
    normal: "#c7c7cc",
    dim: "#d1d1d6",
    slight: "#e5e5ea",
  },
  main: {
    300: "#8b5cf6",
    500: "#9A73D6",
    normal: "#3a9cff",
    "hover-border": "#0a84ff",
    dim: "#6cb5ff",
    slight: "#b5daff",
    accent: "#ffffff",
    bg: "#ffffff",
  },
  code: "#282A36",
  word: "#F8F8F2",
};

function remap(colors, prefix) {
  const newColors = {};
  for (const key in colors) {
    const prefixColor = prefix !== undefined ? `${prefix}-` : "";
    const colorKey = `--${prefixColor}${key}`;
    const value = colors[key];
    if (typeof value === "string") newColors[key] = `var(${colorKey})`;
    if (typeof value === "object") {
      const objectPrefix = prefix === undefined ? `${key}` : prefixColor;
      newColors[key] = remap(value, objectPrefix);
    }
  }
  return newColors;
}

/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{jsx,tsx,html,md,mdx}",
    "./src/**/*.{jsx,tsx,html,md,mdx}",
    "./src/components/**/*.{jsx,tsx,html,md,mdx}",
    "../../packages/lego/src/*.{jsx,tsx,html,md,mdx}",
    "../../packages/lego/src/**/*.{jsx,tsx,html,md,mdx}",
    "../../packages/markdown/src/**/*.{jsx,tsx,html,md,mdx}",
  ],
  theme: { extend: { colors: remap(Colors) } },
  plugins: [
    require("@tailwindcss/forms")({ strategy: "class" }),
    require("@tailwindcss/typography"),
    plugin(function ({ addVariant }) {
      addVariant("link", ["&:hover", "&:focus"]);
    }),
  ],
};
