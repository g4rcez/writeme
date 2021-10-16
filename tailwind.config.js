const Colors = require("./styles/themes/colors.json");

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

const colorsMap = remap(Colors);

module.exports = {
  mode: "jit",
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx,md,html}",
    "./components/**/*.{js,ts,jsx,tsx,mdx,md,html}",
    "./blog/**/*.{js,ts,jsx,tsx,mdx,md,html}",
    "./docs/**/*.{js,ts,jsx,tsx,mdx,md,html}",
  ],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    colors: colorsMap,
    extend: {
      screens: {
        big: "1900px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")({ strategy: "class" }), require("@tailwindcss/typography")],
};
