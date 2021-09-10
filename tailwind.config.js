module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx,mdx,md,html}", "./components/**/*.{js,ts,jsx,tsx,mdx,md,html}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
};
