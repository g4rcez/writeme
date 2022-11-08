import { Sandpack, SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";
import React from "react";
import { useDarkMode } from "../hooks/use-dark-mode";

type Props = {
  code?: string;
  filename?: string;
  scope?: Record<string, unknown>;
  template?: SandpackPredefinedTemplate;
};

const themes = {
  light: {
    colors: {
      surface1: "#ffffff",
      surface2: "#EFEFEF",
      surface3: "#F3F3F3",
      clickable: "#808080",
      base: "#323232",
      disabled: "#C5C5C5",
      hover: "#4D4D4D",
      accent: "#9f15e6",
      error: "#ff453a",
      errorSurface: "#ffeceb",
    },
    syntax: {
      plain: "#151515",
      comment: {
        color: "#999",
        fontStyle: "italic",
      },
      keyword: "#9f15e6",
      tag: "#dab05f",
      punctuation: "#3B3B3B",
      definition: "#40085c",
      property: "#9f15e6",
      static: "#FF453A",
      string: "#5dca1a",
    },
    font: {
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
      size: "13px",
      lineHeight: "20px",
    },
  },
  dark: {
    colors: {
      surface1: "#282a36",
      surface2: "#44475a",
      surface3: "#44475a",
      clickable: "#6272a4",
      base: "#f8f8f2",
      disabled: "#6272a4",
      hover: "#f8f8f2",
      accent: "#bd93f9",
      error: "#f8f8f2",
      errorSurface: "#44475a",
    },
    syntax: {
      plain: "#f8f8f2",
      comment: {
        color: "#6272a4",
        fontStyle: "italic",
      },
      keyword: "#ff79c6",
      tag: "#ff79c6",
      punctuation: "#ff79c6",
      definition: "#f8f8f2",
      property: "#50fa7b",
      static: "#bd93f9",
      string: "#f1fa8c",
    },
    font: {
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
      size: "13px",
      lineHeight: "20px",
    },
  },
};

export const Playground = (props: Props) => {
  const theme = useDarkMode();
  return (
    <section className="my-8">
      <Sandpack
        theme={themes[theme.mode] as any}
        template={props.template ?? "react-ts"}
        options={{
          showTabs: true,
          showLineNumbers: true,
          initMode: "user-visible",
          showConsole: true,
          showInlineErrors: true,
          showRefreshButton: true,
        }}
      />
    </section>
  );
};

export default Playground;
