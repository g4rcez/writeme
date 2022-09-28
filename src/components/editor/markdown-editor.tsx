import { MouseEvent, RefObject, useEffect, useMemo, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import { Compartment, EditorState, Extension } from "@codemirror/state";
import { darkTheme, lightTheme } from "./themes";
import { FaHeading, FaListOl, FaListUl } from "react-icons/fa";
import { usePreferences } from "../preferences";
import { coreExtensions, extraExtensions } from "./editor-preferences";

type UseCodeMirror = {
  view: Types.Nullable<EditorView>;
  editor: Types.Nullable<EditorState>;
  compartment: Types.Nullable<Compartment>;
};
const useCodeMirror = (): [ref: RefObject<HTMLDivElement>, codemirror: UseCodeMirror] => {
  const refContainer = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<UseCodeMirror>({ view: null, editor: null, compartment: null });
  const [preferences, setPreferences] = usePreferences();
  const extensionHash = useMemo(() => new Set(preferences.extensions), [preferences.extensions]);
  const theme = preferences.theme;
  const text = useRef("");

  useEffect(() => {
    if (state.view === null) return;
  }, []);

  useEffect(() => {
    if (refContainer.current === null) return;
    const allExtensions = extraExtensions
      .reduce<Extension[]>((acc, el) => (extensionHash.has(el.name) ? acc.concat(el.ext) : acc), [])
      .concat(coreExtensions);
    const compartment = new Compartment();
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
    setState({ editor: startState, view, compartment });
    return () => {
      view.destroy();
      setState({ editor: null, view: null, compartment: null });
    };
  }, [refContainer, extensionHash]);

  useEffect(() => {
    if (state.view === null || state.compartment === null) return;
    state.view.dispatch({
      effects: state.compartment.reconfigure(theme === "dark" ? darkTheme : lightTheme),
    });
  }, [state.view, state.compartment, theme]);

  return [refContainer, state];
};

export const MarkdownEditor = () => {
  const [ref, state] = useCodeMirror();
  const [preferences, setPreferences] = usePreferences();
  const extensionHash = useMemo(() => new Set(preferences.extensions), [preferences.extensions]);

  const onAddText = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const text = button.dataset.text ?? "";
    const inline = (button.dataset.inline ?? "") === "true";
    const view = state.view;
    const editor = state.editor;
    if (view && editor) {
      const from = view.textDirection;
      const transaction = view.state.update({ changes: { from, insert: text } });
      view.dispatch(transaction);
      view.focus();
      view.textDirectionAt(from + 2);
    }
  };

  return (
    <div className="w-full mx-auto block max-w-full">
      <header className="flex gap-x-8 mb-8 gap-y-2 flex-wrap w-full">
        {extraExtensions.map((x) => (
          <button
            onClick={() => {
              const set = new Set(extensionHash);
              if (set.has(x.name)) set.delete(x.name);
              else set.add(x.name);
              setPreferences("extensions", [...set]);
            }}
            className={extensionHash.has(x.name) ? "text-main-300" : "text-zinc-400"}
            key={`${x.name}-extensions-preference`}
          >
            {x.name}
          </button>
        ))}
      </header>
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
      </header>
      <section ref={ref} />
    </div>
  );
};
