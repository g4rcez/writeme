//@ts-ignore
import Highlight, { defaultProps } from "@g4rcez/prism-react-renderer";
//@ts-ignore
import theme from "@g4rcez/prism-react-renderer/themes/dracula";
import React, { useMemo } from "react";

type Props = {
  code: string;
  language: string;
};

export const CodeHighlight: React.VFC<Props> = ({ code = "", language }) => {
  const convertLang = useMemo(
    () => (language === "node" ? "javascript" : language),
    [language]
  );
  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={code}
      language={convertLang}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }: any) => (
        <pre
          className={`${className} text-left mx-4 p-4 overflow-scroll`}
          style={style}
        >
          {tokens.map((line: any[], i: number) => {
            const lineProps = getLineProps({ line, key: i });
            return (
              <div
                key={i}
                {...lineProps}
                className={`${lineProps.className} table-row`}
              >
                <span className="table-cell text-right pr-4 select-none opacity-50">
                  {i + 1}
                </span>
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};
