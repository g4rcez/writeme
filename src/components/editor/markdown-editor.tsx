import { MouseEvent, RefObject, useEffect, useMemo, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState, Extension } from "@codemirror/state";
import { darkTheme, lightTheme } from "./themes";
import { FaHeading, FaItalic, FaListOl, FaListUl } from "react-icons/fa";
import { usePreferences } from "../preferences/preferences";
import { coreExtensions, extraExtensions, themeSwitcher } from "./editor-preferences";

type UseCodeMirror = {
  view: Types.Nullable<EditorView>;
  editor: Types.Nullable<EditorState>;
};

const useCodeMirror = (initialText: string = ""): [ref: RefObject<HTMLDivElement>, codemirror: UseCodeMirror] => {
  const refContainer = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<UseCodeMirror>({ view: null, editor: null });
  const [preferences] = usePreferences();
  const extensionHash = useMemo(() => new Set(preferences.extensions), [preferences.extensions]);
  const theme = preferences.theme;
  const text = useRef(initialText);

  useEffect(() => {
    if (refContainer.current === null) return;
    const allExtensions = extraExtensions
      .reduce<Extension[]>((acc, el) => (extensionHash.has(el.name) ? acc.concat(el.ext) : acc), [])
      .concat(coreExtensions);
    const startState = EditorState.create({
      doc: text.current,
      extensions: allExtensions.concat(
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            text.current = update.state.doc.toString();
          }
        })
      ),
    });
    const view = new EditorView({ state: startState, parent: refContainer.current });
    setState({ editor: startState, view });
    return () => {
      view.destroy();
      setState({ editor: null, view: null });
    };
  }, [refContainer, extensionHash]);

  useEffect(() => {
    if (state.view === null || themeSwitcher === null) return;
    const reconfigured = theme === "dark" ? darkTheme : lightTheme;
    state.view.dispatch({ effects: themeSwitcher.reconfigure(reconfigured) });
  }, [state.view, themeSwitcher, theme]);

  return [refContainer, state];
};

export const MarkdownEditor = (props: { text: string; viewHeader?: boolean }) => {
  const [ref, state] = useCodeMirror(props.text);

  const onAddText = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const text = button.dataset.text ?? "";
    const backCursor = Number(button.dataset.back ?? "") || 0;
    const inline = (button.dataset.inline ?? "") === "true";
    const view = state.view;
    const editor = state.editor;
    if (view && editor) {
      const line = view.state.doc.lineAt(view.state.selection.main.head);
      const range = view.state.selection.ranges[0];
      const fullText = `${inline || line.text === "" ? "" : "\n"}${text}`;
      view.dispatch({
        selection: { anchor: range.from + (fullText.length - backCursor) },
        changes: { from: range.from, to: range.to, insert: fullText },
      });
    }
  };

  return (
    <div className="w-full mx-auto block max-w-full">
      {props.viewHeader && (
        <header className="w-full flex gap-x-8 mb-2">
          <button onClick={onAddText} data-text="# " data-inline="false">
            <FaHeading aria-hidden="true" />
          </button>
          <button onClick={onAddText} data-text="- " data-inline="false">
            <FaListUl aria-hidden="true" />
          </button>
          <button onClick={onAddText} data-text="1. " data-inline="false">
            <FaListOl aria-hidden="true" />
          </button>
          <button onClick={onAddText} data-back={2} data-text="****" data-inline="true">
            <b>B</b>
          </button>
          <button onClick={onAddText} data-back={1} data-text="**" data-inline="true">
            <FaItalic aria-hidden="true" />
          </button>
        </header>
      )}
      <section ref={ref} />
    </div>
  );
};
