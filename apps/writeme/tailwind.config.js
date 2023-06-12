const plugin = require("tailwindcss/plugin");
const json = require("../../packages/lego/src/themes/light.json");

const Colors = {
  ...json,
  transparent: "transparent",
  dropdown: {
    bg: "#121212",
    text: "#cccccc",
  },
  navbar: {
    bg: "#282a36",
    text: "#d1d5db",
  },
  fail: {
    normal: "#ef4444",
    hover: "#bf3636",
  },
  success: {
    normal: "#34d399",
  },
  form: {
    "text-input": "#282a36",
    "bg-input": "#ffffff",
  },
  http: {
    get: "#64d2ff",
    post: "#6ee7b7",
    patch: "#a78bfa",
    put: "#f472b6",
    delete: "#ef4444",
    info: "#64d2ff",
    success: "#6ee7b7",
    redirect: "#a78bfa",
    client: "#ffcc00",
    server: "#ef4444",
  },
  text: {
    paragraph: "#3d3f4a",
    title: "#181920",
    invert: "#888888",
    normal: "#6b7280",
    dim: "#aeaeb2",
    slight: "#D1D5DB",
    warn: "#ffcc00",
  },
  neutral: {
    normal: "#c7c7cc",
    dim: "#d1d1d6",
    slight: "#e5e5ea",
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
    "../../packages/admin/src/**/*.{jsx,tsx,html,md,mdx}",
    "../../packages/lego/src/**/*.{jsx,tsx,html,md,mdx}",
    "../../packages/lego/src/*.{jsx,tsx,html,md,mdx}",
    "../../packages/markdown/src/**/*.{jsx,tsx,html,md,mdx}",
    "./docs/**/*.{jsx,tsx,html,md,mdx}",
    "./src/**/*.{jsx,tsx,html,md,mdx}",
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
