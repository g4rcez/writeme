import { Editor, EditorConfiguration } from "codemirror";
import { Tab } from "components";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";

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

export const MarkdownMirror: EditorConfiguration = {
  mode: {
    name: "gfm",
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

export const InsertSpacesOnTab = (t: HTMLTextAreaElement, e: KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const caret = t.selectionStart;
    const slice = t.value.substr(0, caret);
    if (slice === "") {
      t.value = t.value + "  ";
      return;
    }
    const last = t.value.substring(caret);
    const str = slice + "  " + last;
    t.value = str;
    t.selectionEnd = caret + 2;
    return;
  }
};

type Props = {
  markdown?: string;
  mode?: "json" | "md";
};

export const Writer: React.VFC<Props> = ({ markdown = "", mode = "md" }) => {
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
      return setLoading(false);
    };
    req();
  }, [markdown, mode]);

  const insertText = (input: string | string[], breakLine?: boolean) => {
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
      const newLine = code.current?.getCursor().line!;
      const line = code.current?.getLine(newLine);
      const ch = line?.indexOf("$0");
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
  };

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
        <button onClick={onHeading} className="bg-transparent opacity-70 hover:opacity-100">
          H1
        </button>
        <button onClick={onOrderList} className="bg-transparent opacity-70 hover:opacity-100">
          OL
        </button>
        <button onClick={onUnorderedList} className="bg-transparent opacity-70 hover:opacity-100">
          UL
        </button>
        <button onClick={onCheckBox} className="bg-transparent opacity-70 hover:opacity-100">
          Checkbox
        </button>
        <button onClick={onLink} className="bg-transparent opacity-70 hover:opacity-100">
          Link
        </button>
        <button onClick={onTable} className="bg-transparent opacity-70 hover:opacity-100">
          Table
        </button>
        <button onClick={onTabs} className="bg-transparent opacity-70 hover:opacity-100">
          Tabs
        </button>
      </div>
      {loading && "Loading..."}
      <div className="w-full border border-border-neutral rounded" ref={div}></div>
    </div>
  );
};
