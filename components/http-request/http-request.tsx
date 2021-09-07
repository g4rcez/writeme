import { CodeHighlight } from "../prism";
import HttpSnippet from "@g4rcez/httpsnippet";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Body } from "./body";
import { convert } from "./curl-parser";
import { Headers } from "./headers";
import { HttpDefault, HttpLanguages } from "./languages";
import { MiniTitle } from "components/mini-title";
import { HttpMethod } from "./http-method";
import { Select } from "components/select";

type Props = {
  curl: string;
};

const convertRequest = (curl: string) => {
  try {
    return convert(curl)!;
  } catch (error) {
    return null;
  }
};

export const HttpRequest: React.VFC<Props> = ({ curl }) => {
  const [language, setLanguage] = useState(HttpDefault.language);
  const [framework, setFramework] = useState(HttpDefault.framework);
  const [req, setReq] = useState(() => convertRequest(curl));

  useEffect(() => setReq(() => convertRequest(curl)), [curl]);

  const requestCode = useMemo(() => {
    if (req === null) return "";
    try {
      const snippet = new HttpSnippet({
        ...req,
        postData: req.body,
      });
      const text = snippet.convert(language as any, framework as any) || "";
      return text
        .replace(/(\r?\n)+/g, "\n")
        .replace(/^[ \t]\+/, "")
        .trim();
    } catch (error) {
      return "";
    }
  }, [language, framework, req]);

  const onChangeLang = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setLanguage(val);
      const lang = HttpLanguages.find((x) => x.value === val)!;
      setFramework(lang.frameworks[0].value);
    },
    []
  );

  const frameworks = useMemo(
    () => HttpLanguages.find((x) => x.value === language)!.frameworks,
    [language]
  );

  const onChangeRequestBody = useCallback((body: any) => {
    setReq((prev) =>
      prev === null
        ? prev
        : {
            ...prev,
            body: {
              ...(prev?.body as any),
              text: JSON.stringify(body),
              jsonObj: body,
            },
          }
    );
  }, []);

  const onChangeRequestHeaders = useCallback(
    (headers: any) =>
      setReq((prev) => (prev === null ? prev : { ...prev, headers })),
    []
  );

  const headers = useMemo(() => req?.headers ?? [], [req]);

  return (
    <section className="flex flex-col">
      <section className="w-full">
        <header className="mb-8">
          <h2
            className="text-xs mb-4"
            data-text={`Request - ${req?.method} ${req?.url}`}
          >
            <HttpMethod method={req?.method} />{" "}
            <span className="text-sm">{req?.url}</span>
          </h2>
        </header>
        <div className="my-4">
          <MiniTitle data-text={`Request Headers`}>Headers</MiniTitle>
          <Headers headers={headers} onChange={onChangeRequestHeaders} />
        </div>
        <div className="my-4">
          <MiniTitle data-text={`Request Body`}>Body</MiniTitle>
          <Body
            onChange={onChangeRequestBody}
            text={(req?.body as any).text ?? ""}
          />
        </div>
      </section>
      <aside className="code border-t border-b border-gray-200 my-8 py-2">
        <form className="flex flex-row gap-x-4">
          <Select
            value={language}
            placeholder="Language"
            onChange={onChangeLang}
          >
            {HttpLanguages.map((x) => (
              <option key={`lang-${x.value}`} value={x.value}>
                {x.label}
              </option>
            ))}
          </Select>
          {frameworks.length > 1 && (
            <Select
              value={framework}
              placeholder="Framework"
              onChange={(e) => setFramework(e.target.value)}
            >
              {frameworks.map((x) => (
                <option key={`framework-${x.value}`} value={x.value}>
                  {x.label}
                </option>
              ))}
            </Select>
          )}
        </form>
        <CodeHighlight code={requestCode} language={language} />
      </aside>
    </section>
  );
};
