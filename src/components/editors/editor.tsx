import { useCallback, useEffect } from "react";
import { useCodeMirror } from "./use-editor";
import type { EditorState } from "@codemirror/state";

type Props = {
  text: string;
  onChange: (text: string) => void;
};

export const Editor = (props: Props) => {
  const { onChange, text } = props;
  const handleChange = useCallback((state: EditorState) => onChange(state.doc.toString()), [onChange]);
  const [refContainer, editorView] = useCodeMirror<HTMLDivElement>({ text, onChange: handleChange });

  useEffect(() => {
    if (editorView) {
      // Do nothing for now
    }
  }, [editorView]);

  return <div className="editor-wrapper" ref={refContainer}></div>;
};
