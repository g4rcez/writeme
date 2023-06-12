import { CSSProperties } from "react";

const commonStyles: CSSProperties = { borderRadius: "1rem", border: "1px solid var(--border)" };
export const themes = {
  dark: {
    plain: { ...commonStyles, color: "var(--word)", backgroundColor: "var(--code)" },
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
    plain: { ...commonStyles, color: "#151515", backgroundColor: "var(--display)" },
    styles: [
      { types: ["prolog", "constant", "builtin"], style: { color: "rgb(189, 147, 249)" } },
      { types: ["inserted", "function"], style: { color: "#309649" } },
      { types: ["deleted"], style: { color: "rgb(255, 85, 85)" } },
      { types: ["changed"], style: { color: "rgb(255, 184, 108)" } },
      { types: ["punctuation", "symbol"], style: { color: "#888888" } },
      { types: ["string", "char", "tag", "selector"], style: { color: "rgb(255, 121, 198)" } },
      { types: ["keyword", "variable"], style: { color: "#9f15e6", fontStyle: "italic" } },
      { types: ["comment"], style: { color: "rgb(98, 114, 164)" } },
      { types: ["attr-name"], style: { color: "rgb(241, 250, 140)" } },
    ],
  },
};
