const Colors = require("./styles/colors.json");

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
    extend: {
      colors: Colors,
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
