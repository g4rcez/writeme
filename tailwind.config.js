const WritemeConfig = require("./writeme.json");
const Colors = require("./styles/themes/light.json");

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

const colorsMap = remap({ ...Colors, ...WritemeConfig.tokens.colors });

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx,md,html}",
    "./components/**/*.{js,ts,jsx,tsx,mdx,md,html}",
    "./blog/**/*.{js,ts,jsx,tsx,mdx,md,html}",
    "./docs/**/*.{js,ts,jsx,tsx,mdx,md,html}",
    ...WritemeConfig.cssWatchDirectories,
  ].filter(Boolean),
  darkMode: "class",
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
