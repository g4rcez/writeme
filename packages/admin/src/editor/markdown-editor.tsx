import React, {
  createContext,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EditorView, keymap, lineNumbers, placeholder } from "@codemirror/view";
import { Compartment, EditorState, Extension } from "@codemirror/state";
import { darkTheme, lightTheme } from "./themes";
import { FaHeading, FaItalic, FaListOl, FaListUl } from "react-icons/fa";
import { Types } from "@writeme/core";
import { LocalStorage } from "storage-manager-js";
import { defaultKeymap } from "@codemirror/commands";
import { defaultHighlightStyle, indentOnInput, syntaxHighlighting } from "@codemirror/language";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { basicSetup } from "codemirror";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { links } from "./link";
import { commonExtensions } from "./common-extensions";

export type EditorNamedExtension = {
  name: string;
  ext: Extension;
};

export const themeSwitcher = new Compartment();

// https://api.github.com/emojis
export const extraExtensions: EditorNamedExtension[] = [
  { name: "lineNumbers", ext: lineNumbers() },
  { name: "indentOnInput", ext: indentOnInput() },
];

export const coreExtensions: Extension[] = [basicSetup, ...commonExtensions, themeSwitcher.of(darkTheme)];

const defaultExtensionsEnable: string[] = ["lineNumbers", "indentOnInput", "bracketMatching"];

const coreExtensionsEnabled = ["themeSwitcher", "placeholder", "keymap", "markdown"];

type UseCodeMirror = {
  view: Types.Nullable<EditorView>;
  editor: Types.Nullable<EditorState>;
};

type Preferences = {
  extensions: string[];
  theme: string;
};

const initialState: Preferences = {
  theme: "dark",
  extensions: coreExtensionsEnabled.concat(defaultExtensionsEnable),
};

const context = createContext<
  [state: Preferences, setPreference: <T extends keyof Preferences>(key: T, val: Preferences[T]) => void]
>([initialState, <T extends keyof Preferences>(k: T, val: Preferences[T]) => {}]);

const getPreference = <T extends keyof Preferences>(key: T, defaultValue: Preferences[T]): Preferences[T] =>
  LocalStorage.get<Preferences[T]>(`writeme/${key}`) ?? (defaultValue as any);

const setPreference = <T extends keyof Preferences>(key: T, value: Preferences[T]): void =>
  LocalStorage.set<Preferences[T]>(`writeme/${key}`, value);

export const Preferences = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<Preferences>(() => initialState);

  useEffect(() => {
    const theme = getPreference("theme", initialState.theme);
    const extensions = getPreference("extensions", initialState.extensions);
    setState({ theme, extensions });
  }, []);

  const callback = useCallback(<T extends keyof Preferences>(key: T, val: Preferences[T]) => {
    setState((prev) => ({ ...prev, [key]: val }));
    setPreference(key, val);
  }, []);

  return <context.Provider value={[state, callback]}>{children}</context.Provider>;
};

const usePreferences = () => useContext(context);

const useCodeMirror = (initialText: string = "") => {
  const refContainer = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<UseCodeMirror>({ view: null, editor: null });
  const [preferences] = usePreferences();
  const extensionHash = useMemo(() => new Set(preferences.extensions), [preferences.extensions]);
  const theme = preferences.theme;
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (refContainer.current === null) return;
    const allExtensions = extraExtensions
      .reduce<Extension[]>((acc, el) => (extensionHash.has(el.name) ? acc.concat(el.ext) : acc), [])
      .concat(coreExtensions);
    const startState = EditorState.create({
      doc: initialText,
      extensions: allExtensions.concat(
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
  }, [initialText, refContainer, extensionHash]);

  useEffect(() => {
    if (state.view === null || themeSwitcher === null) return;
    const reconfigured = theme === "dark" ? darkTheme : lightTheme;
    state.view.dispatch({ effects: themeSwitcher.reconfigure(reconfigured) });
  }, [state.view, theme]);

  return [refContainer, state, text] as const;
};

type Props = {
  form?: string;
  text?: string;
  viewHeader?: boolean;
  className?: string;
  name?: string;
};

export const MarkdownEditor = (props: Props) => {
  const [ref, state, textRef] = useCodeMirror(props.text ?? "");

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
    <div className={`${props.className ?? "w-full mx-auto block max-w-full"}`}>
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
      <textarea id={props.name} form={props.form} defaultValue={props.text} name={props.name} hidden value={textRef} />
      <section ref={ref} />
    </div>
  );
};
