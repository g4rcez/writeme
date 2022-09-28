import { Compartment, Extension } from "@codemirror/state";
import {
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  placeholder,
} from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { historyKeymap } from "@codemirror/history";
import { indentOnInput } from "@codemirror/language";
import { bracketMatching } from "@codemirror/matchbrackets";
import { darkTheme } from "./themes";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import interact from "@replit/codemirror-interact";

export type EditorNamedExtension = {
  name: string;
  ext: Extension;
};

const themeSwitcher = new Compartment();

const numberIncrement = new Compartment().of(
  interact({
    rules: [
      {
        regexp: /-?\b\d+\.?\d*\b/g,
        cursor: "ew-resize",
        onDrag: (text, setText, e) => {
          const newVal = Number(text) + e.movementX;
          if (isNaN(newVal)) return;
          setText(newVal.toString());
        },
      },
    ],
  })
);

export const extraExtensions: EditorNamedExtension[] = [
  { name: "lineNumbers", ext: lineNumbers() },
  { name: "indentOnInput", ext: indentOnInput() },
  { name: "highlightActiveLine", ext: highlightActiveLine() },
  { name: "highlightActiveLineGutter", ext: highlightActiveLineGutter() },
  { name: "highlightSpecialChars", ext: highlightSpecialChars() },
  { name: "bracketMatching", ext: bracketMatching() },
  { name: "numberIncrement", ext: numberIncrement },
];

export const coreExtensions: Extension[] = [
  themeSwitcher.of(darkTheme),
  placeholder("Text here..."),
  keymap.of(defaultKeymap.concat(historyKeymap)),
  markdown({ base: markdownLanguage, codeLanguages: languages, addKeymap: true }),
];

export const defaultExtensionsEnable: string[] = [
  "lineNumbers",
  "indentOnInput",
  "highlightActiveLine",
  "highlightActiveLineGutter",
  "highlightSpecialChars",
  "bracketMatching",
  "numberIncrement",
];

export const coreExtensionsEnabled = ["themeSwitcher", "placeholder", "keymap", "markdown"];
