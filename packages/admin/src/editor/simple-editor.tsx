import React, { useEffect, useRef, useState } from "react";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { Compartment, EditorState, Extension } from "@codemirror/state";
import { simpleDarkMode, simpleLightMode } from "./themes";
import { Types } from "@writeme/core";
import { defaultKeymap } from "@codemirror/commands";
import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { minimalSetup } from "codemirror";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { links } from "./link";
import { useDarkMode } from "@writeme/lego";

export const themeSwitcher = new Compartment();

export const coreExtensions: Extension[] = [
  minimalSetup,
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
  keymap.of(defaultKeymap),
  markdown({ base: markdownLanguage, codeLanguages: languages, addKeymap: true }),
  themeSwitcher.of(simpleDarkMode),
];

type UseCodeMirror = {
  view: Types.Nullable<EditorView>;
  editor: Types.Nullable<EditorState>;
};

const useCodeMirror = (initialText: string = "") => {
  const refContainer = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<UseCodeMirror>({ view: null, editor: null });
  const { mode } = useDarkMode();
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (refContainer.current === null) return;
    const startState = EditorState.create({
      doc: initialText,
      extensions: coreExtensions.concat(
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          setText(update.state.doc.toString());
        })
      ),
    });
    const view = new EditorView({ state: startState, parent: refContainer.current });
    setState({ editor: startState, view });
    return () => {
      view.destroy();
      setState({ editor: null, view: null });
    };
  }, [initialText, refContainer]);

  useEffect(() => {
    if (state.view === null || themeSwitcher === null) return;
    const reconfigured = mode === "dark" ? simpleDarkMode : simpleLightMode;
    state.view.dispatch({ effects: themeSwitcher.reconfigure(reconfigured) });
  }, [state.view, mode]);

  return [refContainer, state, text] as const;
};

type Props = {
  form?: string;
  text?: string;
  viewHeader?: boolean;
  className?: string;
  name?: string;
};

const noop = () => {};

export const SimpleEditor = (props: Props) => {
  const [ref, , textRef] = useCodeMirror(props.text ?? "");

  return (
    <div className="w-full mx-auto inline-block max-w-full border border-zinc-400 rounded px-1 dark:border-zinc-800">
      <textarea
        id={props.name}
        form={props.form}
        defaultValue={props.text}
        onChange={noop}
        name={props.name}
        hidden
        value={textRef}
      />
      <section ref={ref} />
    </div>
  );
};
