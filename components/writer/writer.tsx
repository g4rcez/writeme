import { Editor, EditorConfiguration } from "codemirror";
import React, { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

const Textarea = async () => {
  await import("codemirror/addon/comment/comment");
  await import("codemirror/addon/comment/continuecomment");
  await import("codemirror/addon/dialog/dialog");
  await import("codemirror/addon/display/panel");
  await import("codemirror/addon/display/placeholder");
  await import("codemirror/addon/edit/closebrackets");
  await import("codemirror/addon/edit/closetag");
  await import("codemirror/addon/edit/continuelist");
  await import("codemirror/addon/edit/matchbrackets");
  await import("codemirror/addon/edit/matchtags");
  await import("codemirror/addon/fold/brace-fold");
  await import("codemirror/addon/fold/comment-fold");
  await import("codemirror/addon/fold/foldcode");
  await import("codemirror/addon/fold/foldgutter");
  await import("codemirror/addon/fold/indent-fold");
  await import("codemirror/addon/fold/markdown-fold");
  await import("codemirror/addon/hint/anyword-hint");
  await import("codemirror/addon/hint/css-hint");
  await import("codemirror/addon/hint/html-hint");
  await import("codemirror/addon/hint/javascript-hint");
  await import("codemirror/addon/hint/show-hint");
  await import("codemirror/addon/hint/sql-hint");
  await import("codemirror/addon/mode/overlay");
  await import("codemirror/addon/scroll/scrollpastend");
  await import("codemirror/addon/scroll/simplescrollbars");
  await import("codemirror/addon/search/jump-to-line");
  await import("codemirror/addon/search/match-highlighter");
  await import("codemirror/addon/search/matchesonscrollbar");
  await import("codemirror/addon/search/search");
  await import("codemirror/addon/search/searchcursor");
  //@ts-ignore
  await import("codemirror/lib/codemirror");
  //@ts-ignore
  await import("codemirror/mode/clike/clike");
  //@ts-ignore
  await import("codemirror/mode/gfm/gfm");
  //@ts-ignore
  await import("codemirror/mode/yaml-frontmatter/yaml-frontmatter");
  //@ts-ignore
  await import("codemirror/mode/yaml/yaml");
  //@ts-ignore
  await import("codemirror/mode/htmlmixed/htmlmixed");
  //@ts-ignore
  await import("codemirror/mode/javascript/javascript");
  //@ts-ignore
  await import("codemirror/mode/markdown/markdown");
  //@ts-ignore
  await import("codemirror/mode/meta");
  //@ts-ignore
  await import("codemirror/mode/xml/xml");
  return import("codemirror");
};

const Button = (props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => (
  <button {...props} type="button" />
);

export const MarkdownMirror: EditorConfiguration = {
  mode: {
    name: "yaml-frontmatter",
    xml: true,
    //@ts-ignore
    globalVars: true,
    highlightFormatting: true,
    tokenTypeOverrides: {
      emoji: "emoji",
    },
  },
  placeholder: "Write text here...",
  autoCloseBrackets: {
    pairs: `""**<>//__()[]{}''\`\``,
    explode: '[]{}""',
  },
  scrollPastEnd: false,
  scrollbarStyle: "overlay",
  autocapitalize: true,
  lineWrapping: true,
  matchBrackets: true,
  autoCloseTags: true,
  lineNumbers: true,
  inputStyle: "contenteditable",
  theme: "default",
  smartIndent: true,
  spellcheck: true,
  highlightSelectionMatches: true,
  viewportMargin: Infinity,
  foldGutter: true,
  // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  matchTags: { bothTags: true },
  extraKeys: {
    Enter: "newlineAndIndentContinueMarkdownList",
    "Ctrl-Space": "autocomplete",
    "Alt-F": "findPersistent",
    "Ctrl-J": "toMatchingTag",
  },
};

type Props = {
  markdown?: string;
  mode?: "json" | "md";
  onChange: (text: string) => void;
};

export const Writer: React.VFC<Props> = ({ markdown = "", mode = "md", onChange }) => {
  const div = useRef<HTMLDivElement>(null);
  const code = useRef<Editor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (div.current === null) {
      return setLoading(false);
    }
    const req = async () => {
      const CodeMirror = await Textarea();
      const mirror = CodeMirror.default(div.current!, {
        ...MarkdownMirror,
        mode: mode === "md" ? MarkdownMirror.mode : "application/ld+json",
        value: markdown,
      });
      code.current = mirror;
      mirror.on("change", (e) => {
        onChange(e.getValue());
      });
      return setLoading(false);
    };
    req();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, onChange]);

  const insertText = useCallback((input: string | string[], breakLine?: boolean) => {
    const text = Array.isArray(input) ? input.join("\n") : input;
    const cursor = code.current?.getCursor();
    if (breakLine) {
      const newCursor = {
        ch: cursor?.ch!,
        line: (cursor?.line ?? 1) + 2,
        sticky: undefined,
      };
      const line = code.current?.getLine(cursor?.line ?? 0);
      if (line !== "") {
        code.current?.replaceRange("\n" + text, newCursor);
      } else {
        code.current?.replaceRange(text, newCursor);
      }
      code.current?.setCursor(newCursor);
    } else code.current?.replaceRange(text, cursor!);
    code.current?.focus();
    if (text.includes("$0")) {
      let newLine = 0;
      let line = code.current?.getLine(newLine);
      let ch = line?.indexOf("$0");
      while (ch === -1) {
        newLine += 1;
        line = code.current?.getLine(newLine);
        ch = line?.indexOf("$0");
        console.log({ ch, line });
      }
      code.current?.setCursor({
        ch: ch! + 2,
        line: newLine!,
      });
      code.current?.replaceRange(
        "",
        {
          ch: ch!,
          line: newLine!,
        },
        {
          ch: ch! + 2,
          line: newLine!,
        }
      );
    }
  }, []);

  const onFrontMatter = () => insertText(["---", `title: "Title"`, `slug: example`, "---", "", "$0"], true);

  const onHeading = () => insertText("# ", true);

  const onOrderList = () => insertText("1. ", true);

  const onUnorderedList = () => insertText("- ", true);

  const onCheckBox = () => insertText("- [ ] ", true);

  const onLink = () => insertText("[$0](url)");

  const onTable = () => insertText(["| col1 | col2 |", "| --- | --- |", "| cell1 | cell2 |"], true);

  const onTabs = () =>
    insertText(
      [
        "<!--|tabs tabs-->",
        "",
        "## First Tab",
        "First Tab Content",
        "",
        "# Second Tab",
        "Second Tab Content",
        "",
        "<!--/tabs-->",
      ],
      true
    );

  return (
    <div className="w-full flex flex-col relative">
      <div className="w-full flex gap-x-2 my-2">
        <Button onClick={onFrontMatter} className="bg-transparent opacity-70 hover:opacity-100">
          FrontMatter
        </Button>
        <Button onClick={onHeading} className="bg-transparent opacity-70 hover:opacity-100">
          H1
        </Button>
        <Button onClick={onOrderList} className="bg-transparent opacity-70 hover:opacity-100">
          OL
        </Button>
        <Button onClick={onUnorderedList} className="bg-transparent opacity-70 hover:opacity-100">
          UL
        </Button>
        <Button onClick={onCheckBox} className="bg-transparent opacity-70 hover:opacity-100">
          Checkbox
        </Button>
        <Button onClick={onLink} className="bg-transparent opacity-70 hover:opacity-100">
          Link
        </Button>
        <Button onClick={onTable} className="bg-transparent opacity-70 hover:opacity-100">
          Table
        </Button>
        <Button onClick={onTabs} className="bg-transparent opacity-70 hover:opacity-100">
          Tabs
        </Button>
      </div>
      {loading && "Loading..."}
      <div className="w-full border border-border-neutral rounded" ref={div}></div>
    </div>
  );
};
