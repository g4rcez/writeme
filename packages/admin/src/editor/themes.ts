import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting, TagStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { colors, Colors } from "./colors";

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
        backgroundColor: stone,
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
        color: ivory,
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

const createThemeExtension = (name: string, theme: Colors) => [
  createColorTheme(name, theme),
  syntaxHighlighting(createHighlightStyle(theme)),
];

export const darkTheme: Extension = createThemeExtension("dark", colors.normal.dark);

export const lightTheme: Extension = createThemeExtension("light", colors.normal.light);

const SimpleTagStyle: TagStyle[] = [
  {
    tag: t.heading1,
    class: "text-3xl",
  },
  {
    tag: t.heading2,
    class: "text-2xl",
  },
  {
    tag: t.heading3,
    class: "text-xl",
  },
  {
    tag: t.heading4,
    class: "text-lg",
  },
];

const createSimpleTheme = (name: string, theme: Colors) => [
  createColorTheme("light", theme),
  syntaxHighlighting(createHighlightStyle(theme, SimpleTagStyle)),
];

export const simpleLightMode: Extension = createSimpleTheme("light", colors.simple.light);

export const simpleDarkMode: Extension = createSimpleTheme("dark", colors.simple.dark);
