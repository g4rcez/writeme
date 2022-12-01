export type Colors = {
  chalky: string;
  coral: string;
  cyan: string;
  invalid: string;
  ivory: string;
  stone: string;
  malibu: string;
  sage: string;
  whiskey: string;
  violet: string;
  darkBackground: string;
  highlightBackground: string;
  background: string;
  tooltipBackground: string;
  selection: string;
  cursor: string;
};

type Theme = Record<"dark" | "light", Colors>;

export const colors: { simple: Theme; normal: Theme } = {
  simple: {
    dark: {
      chalky: "#e5c07b",
      coral: "#D3525C",
      cyan: "#56b6c2",
      invalid: "#ffffff",
      ivory: "#fff",
      stone: "#7d8799",
      malibu: "#61afef",
      sage: "#4c613c",
      whiskey: "#d19a66",
      violet: "#c678dd",
      darkBackground: "transparent",
      highlightBackground: "#b9b9b9",
      background: "transparent",
      tooltipBackground: "#aaa",
      selection: "#9ea1a8",
      cursor: "#128bff",
    },
    light: {
      chalky: "#e5c07b",
      coral: "#D3525C",
      cyan: "#56b6c2",
      invalid: "#ffffff",
      ivory: "#1e293b",
      stone: "#7d8799",
      malibu: "#61afef",
      sage: "#4c613c",
      whiskey: "#d19a66",
      violet: "#c678dd",
      darkBackground: "transparent",
      highlightBackground: "#b9b9b9",
      background: "transparent",
      tooltipBackground: "#aaa",
      selection: "#9ea1a8",
      cursor: "#128bff",
    },
  },
  normal: {
    light: {
      chalky: "#e5c07b",
      coral: "#D3525C",
      cyan: "#56b6c2",
      invalid: "#ffffff",
      ivory: "#1e293b",
      stone: "#7d8799",
      malibu: "#61afef",
      sage: "#4c613c",
      whiskey: "#d19a66",
      violet: "#c678dd",
      darkBackground: "#efefef",
      highlightBackground: "#b9b9b9",
      background: "#fff",
      tooltipBackground: "#aaa",
      selection: "#9ea1a8",
      cursor: "#128bff",
    },
    dark: {
      chalky: "#e5c07b",
      coral: "#e06c75",
      cyan: "#56b6c2",
      invalid: "#ffffff",
      ivory: "#abb2bf",
      stone: "#7d8799",
      malibu: "#61afef",
      sage: "#98c379",
      whiskey: "#d19a66",
      violet: "#c678dd",
      darkBackground: "#21252b",
      highlightBackground: "#2c313a",
      background: "#282c34",
      tooltipBackground: "#353a42",
      selection: "#3e4451",
      cursor: "#528bff",
    },
  },
};
