export const themes = {
  dark: {
    plain: { color: "var(--word)", backgroundColor: "var(--code)" },
    styles: [
      { types: ["prolog", "constant", "builtin"], style: { color: "rgb(189, 147, 249)" } },
      { types: ["inserted", "function"], style: { color: "rgb(80, 250, 123)" } },
      { types: ["deleted"], style: { color: "rgb(255, 85, 85)" } },
      { types: ["changed"], style: { color: "rgb(255, 184, 108)" } },
      { types: ["punctuation", "symbol"], style: { color: "rgb(248, 248, 242)" } },
      { types: ["string", "char", "tag", "selector"], style: { color: "rgb(255, 121, 198)" } },
      { types: ["keyword", "variable"], style: { color: "rgb(189, 147, 249)", fontStyle: "italic" } },
      { types: ["comment"], style: { color: "rgb(98, 114, 164)" } },
      { types: ["attr-name"], style: { color: "rgb(241, 250, 140)" } },
    ],
  },
  light: {
    plain: { color: "#151515", backgroundColor: "#fff" },
    styles: [
      { types: ["prolog", "constant", "builtin"], style: { color: "rgb(189, 147, 249)" } },
      { types: ["inserted", "function"], style: { color: "#309649" } },
      { types: ["deleted"], style: { color: "rgb(255, 85, 85)" } },
      { types: ["changed"], style: { color: "rgb(255, 184, 108)" } },
      { types: ["punctuation", "symbol"], style: { color: "#888" } },
      { types: ["string", "char", "tag", "selector"], style: { color: "rgb(255, 121, 198)" } },
      { types: ["keyword", "variable"], style: { color: "#9f15e6", fontStyle: "italic" } },
      { types: ["comment"], style: { color: "rgb(98, 114, 164)" } },
      { types: ["attr-name"], style: { color: "rgb(241, 250, 140)" } },
    ],
  },
};
