module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx,mdx,md,html}", "./components/**/*.{js,ts,jsx,tsx,mdx,md,html}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
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
