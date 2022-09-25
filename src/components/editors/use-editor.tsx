import React, { useEffect, useRef, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { HighlightStyle, tags } from "@codemirror/highlight";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { history } from "@codemirror/history";

type Props = {
  text: string;
  onChange: (text: EditorState) => void;
};

const syntaxHighlighting = HighlightStyle.define([
  {
    tag: tags.heading1,
    fontSize: "1.6em",
    fontWeight: "bold",
  },
  {
    tag: tags.heading2,
    fontSize: "1.4em",
    fontWeight: "bold",
  },
  {
    tag: tags.heading3,
    fontSize: "1.2em",
    fontWeight: "bold",
  },
]);

export const useCodeMirror = <T extends Element>({
  onChange,
  text,
}: Props): [React.MutableRefObject<T | null>, EditorView?] => {
  const refContainer = useRef<T>(null);
  const [editorView, setEditorView] = useState<EditorView>();
  const editorState = useRef<Types.Nullable<EditorState>>(null);

  useEffect(() => {
    if (editorState.current !== null) return;
    editorState.current = EditorState.create({
      doc: text,
      extensions: [
        history(),
        keymap.of(defaultKeymap),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          addKeymap: true,
        }),
        EditorView.lineWrapping,
      ],
    });
  }, []);

  useEffect(() => {
    if (refContainer.current === null) return;
    if (editorState.current === null) return;
    const view = new EditorView({ state: editorState.current, parent: refContainer.current });
    setEditorView(view);
    return () => {
      if (view) {
        view.destroy();
        editorState.current = null;
        setEditorView(undefined);
      }
    };
  }, [refContainer]);

  return [refContainer, editorView];
};
