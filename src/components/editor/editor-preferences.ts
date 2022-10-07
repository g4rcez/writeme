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
import { indentOnInput, syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { bracketMatching } from "@codemirror/matchbrackets";
import { darkTheme } from "./themes";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { basicSetup } from "codemirror";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { links } from "./link";

export type EditorNamedExtension = {
  name: string;
  ext: Extension;
};

export const themeSwitcher = new Compartment();
// https://api.github.com/emojis
export const extraExtensions: EditorNamedExtension[] = [
  { name: "lineNumbers", ext: lineNumbers() },
  { name: "indentOnInput", ext: indentOnInput() },
  { name: "highlightActiveLine", ext: highlightActiveLine() },
  { name: "highlightActiveLineGutter", ext: highlightActiveLineGutter() },
  { name: "highlightSpecialChars", ext: highlightSpecialChars() },
  { name: "bracketMatching", ext: bracketMatching() },
];

export const coreExtensions: Extension[] = [
  basicSetup,
  links,
  autocompletion({
    closeOnBlur: true,
    selectOnOpen: true,
    icons: true,
    override: [
      async (context: CompletionContext) => {
        let word = context.matchBefore(/@(\w+)?/);
        if (!word) return null;
        if (word.from === word.to && !context.explicit) {
          return null;
        }
        return {
          from: word.from,
          options: [
            { label: "@Writeme", type: "css" },
            { label: "@mention", type: "mention" },
            { label: "@Test", type: "css" },
            { label: "@This apply filter", type: "css" },
          ],
        };
      },
    ],
  }),
  syntaxHighlighting(defaultHighlightStyle),
  placeholder("Text here..."),
  keymap.of(defaultKeymap.concat(historyKeymap)),
  markdown({ base: markdownLanguage, codeLanguages: languages, addKeymap: true }),
  themeSwitcher.of(darkTheme),
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
