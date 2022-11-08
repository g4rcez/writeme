//@ts-ignore
import Highlight, { defaultProps } from "@g4rcez/prism-react-renderer";
import { copyToClipboard } from "src/lib/copy-to-clipboard";
import React, { useMemo, useState } from "react";
import { BsClipboard } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { themes } from "styles/code-highlight-theme";
import { useDarkMode } from "../hooks/use-dark-mode";

type Props = {
  code: string;
  language: string;
};

const copyToClipboardClass = "absolute right-0 mx-4 my-5 select-none";

export const CodeHighlight: React.FC<Props> = ({ code = "", language }) => {
  const [copied, setCopied] = useState(false);
  const convertLang = useMemo(() => (language === "node" ? "javascript" : language), [language]);
  const theme = useDarkMode();

  const copy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="code-highlight relative w-full overflow-x max-w-full">
      {copied ? (
        <FaCheck className={`${copyToClipboardClass} animate-bounce pointer-events-none text-success-normal`} />
      ) : (
        <BsClipboard
          onClick={copy}
          title="Copy to clipboard"
          className={`${copyToClipboardClass} text-text-dim cursor-pointer transition-opacity duration-1000 ease-out opacity-100 hover:opacity-60`}
        />
      )}
      <Highlight {...defaultProps} theme={themes[theme.mode]} code={code} language={convertLang}>
        {({ className, style, tokens, getLineProps, getTokenProps }: any) => (
          <pre className={`${className} text-left mx-4 p-4 overflow-scroll block max-w-full overflow-x`} style={style}>
            {tokens.map((line: any[], i: number) => {
              const lineProps = getLineProps({ line, key: i });
              return (
                <div key={i} {...lineProps} className={`${lineProps.className} table-row`}>
                  <span className="table-cell text-right pr-4 select-none opacity-50">{i + 1}</span>
                  <span className="table-cell whitespace-pre-wrap break-all">
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
    </div>
  );
};

export default CodeHighlight;
