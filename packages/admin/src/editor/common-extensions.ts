import { links } from "./link";
import { autoComplete } from "./autocomplete";
import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { keymap, placeholder } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

export const commonExtensions = [
  links,
  autoComplete(),
  syntaxHighlighting(defaultHighlightStyle),
  placeholder("Text here..."),
  keymap.of(defaultKeymap),
  markdown({ base: markdownLanguage, codeLanguages: languages, addKeymap: true }),
];
