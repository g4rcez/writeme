import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting, TagStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

type Colors = {
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

const simpleDarkColors: Colors = {
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
};
const simpleLightColors: Colors = {
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
};

const lightColors: Colors = {
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
};

const darkColors: Colors = {
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
};

const createColorTheme = (
  name: string,
  {
    selection,
    chalky,
    cursor,
    background,
    highlightBackground,
    darkBackground,
    tooltipBackground,
    stone,
    ivory,
  }: Colors
) =>
  EditorView.theme(
    {
      "&": {
        color: ivory,
        backgroundColor: background,
      },

      ".cm-content": {
        caretColor: cursor,
      },

      ".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: selection,
      },

      ".cm-panels": { backgroundColor: darkBackground, color: ivory },
      ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
      ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

      ".cm-searchMatch": {
        backgroundColor: `${chalky}`,
        outline: "1px solid #457dff",
      },
      ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: "#6199ff2f",
      },

      ".cm-activeLine": { backgroundColor: "#6699ff0b" },
      ".cm-selectionMatch": { backgroundColor: "#aafe661a" },

      "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
        backgroundColor: "#bad0f847",
        outline: "1px solid #515a6b",
      },

      ".cm-gutters": {
        backgroundColor: background,
        color: stone,
        border: "none",
      },

      ".cm-activeLineGutter": {
        backgroundColor: highlightBackground,
      },

      ".cm-foldPlaceholder": {
        backgroundColor: "transparent",
        border: "none",
        color: "#ddd",
      },

      ".cm-tooltip": {
        border: "none",
        backgroundColor: tooltipBackground,
      },
      ".cm-tooltip .cm-tooltip-arrow:before": {
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
      },
      ".cm-tooltip .cm-tooltip-arrow:after": {
        borderTopColor: tooltipBackground,
        borderBottomColor: tooltipBackground,
      },
      ".cm-tooltip-autocomplete": {
        "& > ul > li[aria-selected]": {
          backgroundColor: highlightBackground,
          color: ivory,
        },
      },
    },
    { dark: name === "dark" }
  );

export const createHighlightStyle = (
  { chalky, cyan, invalid, malibu, sage, stone, violet, whiskey, ivory, coral }: Colors,
  tagStyle: TagStyle[] = []
) =>
  HighlightStyle.define(
    [
      {
        tag: t.keyword,
        color: violet,
      },
      {
        tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
        color: coral,
      },
      {
        tag: [t.function(t.variableName), t.labelName],
        color: malibu,
      },
      {
        tag: [t.color, t.constant(t.name), t.standard(t.name)],
        color: whiskey,
      },
      {
        tag: [t.definition(t.name), t.separator],
        color: ivory,
      },
      {
        tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
        color: chalky,
      },
      {
        tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
        color: cyan,
      },
      {
        tag: [t.meta, t.comment],
        color: stone,
      },
      {
        tag: t.strong,
        fontWeight: "bold",
      },
      {
        tag: t.emphasis,
        fontStyle: "italic",
      },
      {
        tag: t.strikethrough,
        textDecoration: "line-through",
      },
      {
        tag: t.link,
        color: stone,
        textDecoration: "underline",
      },
      {
        tag: t.heading,
        fontWeight: "bold",
        color: coral,
      },
      {
        tag: [t.atom, t.bool, t.special(t.variableName)],
        color: whiskey,
      },
      {
        tag: [t.processingInstruction, t.string, t.inserted],
        color: sage,
      },
      {
        tag: t.invalid,
        color: invalid,
      },
    ].concat(tagStyle as any)
  );

export const darkTheme: Extension = [
  createColorTheme("dark", darkColors),
  syntaxHighlighting(createHighlightStyle(darkColors)),
];

export const lightTheme: Extension = [
  createColorTheme("light", lightColors),
  syntaxHighlighting(createHighlightStyle(lightColors)),
];

const SimpleTagStyle: TagStyle[] = [
  {
    tag: t.heading1,
    class: "text-3xl",
  },
];

export const simpleLightMode: Extension = [
  createColorTheme("light", simpleLightColors),
  syntaxHighlighting(createHighlightStyle(simpleLightColors, SimpleTagStyle)),
];

export const simpleDarkMode: Extension = [
  createColorTheme("light", simpleDarkColors),
  syntaxHighlighting(createHighlightStyle(simpleDarkColors, SimpleTagStyle)),
];
