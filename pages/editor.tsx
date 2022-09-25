import Editor from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { useDarkMode } from "../src/hooks/use-dark-mode";

export default function EditorPage() {
  const theme = useDarkMode();
  return (
    <div>
      <Editor extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]} theme={theme.mode} />
    </div>
  );
}
