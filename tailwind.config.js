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

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{jsx,tsx,html,md,mdx}",
    "./src/**/*.{jsx,tsx,html,md,mdx}",
    "./src/components/**/*.{jsx,tsx,html,md,mdx}",
  ],
  theme: {
    extend: {
      colors: remap(Colors),
      screens: {
        big: "1900px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")({ strategy: "class" }), require("@tailwindcss/typography")],
};
