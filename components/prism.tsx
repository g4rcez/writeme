//@ts-ignore
import Highlight, { defaultProps } from "@g4rcez/prism-react-renderer";
import { copyToClipboard } from "lib/copy-to-clipboard";
import React, { useMemo, useState } from "react";
import { BsClipboard } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { draculaTheme } from "styles/code-highlight-theme";

type Props = {
  code: string;
  language: string;
};

const coptyToClipboardClass = "absolute right-0 mx-4 my-5 select-none";

export const CodeHighlight: React.VFC<Props> = ({ code = "", language }) => {
  const [copied, setCopied] = useState(false);
  const convertLang = useMemo(() => (language === "node" ? "javascript" : language), [language]);

  const copy = () => {
    copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="code-highlight relative w-full mx-auto container">
      {copied ? (
        <FaCheck className={`${coptyToClipboardClass} animate-bounce pointer-events-none text-green-400`} />
      ) : (
        <BsClipboard
          onClick={copy}
          title="Copy to clipboard"
          className={`${coptyToClipboardClass} text-gray-200 cursor-pointer transition-opacity duration-1000 ease-out opacity-100 hover:opacity-60`}
        />
      )}
      <Highlight {...defaultProps} theme={draculaTheme} code={code} language={convertLang}>
        {({ className, style, tokens, getLineProps, getTokenProps }: any) => (
          <pre className={`${className} text-left mx-4 p-4 overflow-scroll`} style={style}>
            {tokens.map((line: any[], i: number) => {
              const lineProps = getLineProps({ line, key: i });
              return (
                <div key={i} {...lineProps} className={`${lineProps.className} table-row`}>
                  <span className="table-cell text-right pr-4 select-none opacity-50">{i + 1}</span>
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
    </div>
  );
};

export default CodeHighlight;
