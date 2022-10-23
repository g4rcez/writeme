import HttpSnippet from "@g4rcez/httpsnippet";
import { useHttpContext } from "src/components/http.context";
import { MiniTitle } from "src/components/mini-title";
import { Select } from "src/components/select";
import { Is } from "src/lib/is";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Body } from "./body";
import { convert, Header } from "./curl-parser";
import { Headers } from "./headers";
import { HttpMethod } from "./http-method";
import { HttpDefault, HttpLanguages } from "./languages";

const CodeHighlight = dynamic(() => import("../prism"));

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

export const HttpRequest: React.FC<Props> = ({ curl }) => {
  const [language, setLanguage] = useState<HttpSnippet.Languages>(HttpDefault.language as HttpSnippet.Languages);
  const [framework, setFramework] = useState(HttpDefault.framework);
  const [req, setReq] = useState(() => convertRequest(curl));
  const { onRequest } = useHttpContext();

  useEffect(() => setReq(() => convertRequest(curl)), [curl]);

  const requestCode = useMemo(() => {
    if (req === null) return "";
    try {
      const snippet = new HttpSnippet({
        ...req,
        postData: req.body,
      });
      const text = snippet.convert(language, framework as never) || "";
      return text
        .replace(/(\r?\n)+/g, "\n")
        .replace(/^[ \t]\+/, "")
        .trim();
    } catch (error) {
      return "";
    }
  }, [language, framework, req]);

  const onChangeLang = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as HttpSnippet.Languages;
    setLanguage(val);
    const lang = HttpLanguages.find((x) => x.value === val)!;
    setFramework(lang.frameworks[0].value);
  }, []);

  const frameworks = useMemo(() => HttpLanguages.find((x) => x.value === language)!.frameworks, [language]);

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
    (headers: Header[]) => setReq((prev) => (prev === null ? prev : { ...prev, headers })),
    []
  );

  const headers = useMemo(() => req?.headers ?? [], [req]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const bodyText = (req?.body as any).text;
      onRequest({
        body: Is.Json(bodyText) ? bodyText : req?.body,
        headers: headers.reduce((acc, el) => ({ ...acc, [el.name]: el.value }), {}),
        url: req?.url ?? "",
        method: (req?.method?.toUpperCase() as never) ?? "GET",
      });
    },
    [onRequest, req?.body, req?.url, req?.method, headers]
  );

  const onlyPathApi = useMemo(() => (req?.url ? new URL(req.url).pathname : ""), [req?.url]);

  return (
    <section className="http-request">
      <section className="w-full">
        <header className="my-4">
          <h3 data-toc="false" className="text-xs" data-text={`${req?.method} ${onlyPathApi}`}>
            <HttpMethod method={req?.method} /> <span className="text-sm">{onlyPathApi}</span>
          </h3>
        </header>
        <div className="my-2">
          <MiniTitle data-toc="false">Headers</MiniTitle>
          <Headers headers={headers} onChange={onChangeRequestHeaders} />
        </div>
        <div className="my-2">
          <MiniTitle data-toc="false">Body</MiniTitle>
          <Body onChange={onChangeRequestBody} text={(req?.body as any).text ?? ""} />
        </div>
      </section>
      <aside className="http-request-code">
        <form onSubmit={onSubmit} className="flex gap-x-4 items-center">
          <Select value={language} placeholder="Language" onChange={onChangeLang}>
            {HttpLanguages.map((x) => (
              <option key={`lang-${x.value}`} value={x.value}>
                {x.label}
              </option>
            ))}
          </Select>
          {frameworks.length > 1 && (
            <Select value={framework} placeholder="Framework" onChange={(e) => setFramework(e.target.value)}>
              {frameworks.map((x) => (
                <option key={`framework-${x.value}`} value={x.value}>
                  {x.label}
                </option>
              ))}
            </Select>
          )}
          <button
            type="submit"
            className="px-4 py-3 my-0 leading-3 text-sm bg-main-normal transition-colors duration-300 ease-out hover:bg-main-hover-border active:bg-main-hover-border text-main-accent rounded-lg"
          >
            Request API
          </button>
        </form>
        <CodeHighlight code={requestCode} language={language} />
      </aside>
    </section>
  );
};

export default HttpRequest;
