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
import { HttpLanguages } from "./languages";
import { Button } from "../button";
import { useCodeLanguage } from "../preferences/code-language";

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
  const [req, setReq] = useState(() => convertRequest(curl));
  const { onRequest } = useHttpContext();
  const [state, set] = useCodeLanguage();

  useEffect(() => setReq(() => convertRequest(curl)), [curl]);

  const requestCode = useMemo(() => {
    if (req === null) return "";
    try {
      const snippet = new HttpSnippet({ ...req, postData: req.body });
      const text = snippet.convert(state.language as never, state.framework as never) || "";
      return text
        .replace(/(\r?\n)+/g, "\n")
        .replace(/^[ \t]\+/, "")
        .trim();
    } catch (error) {
      return "";
    }
  }, [req, state]);

  const onChangeLang = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as HttpSnippet.Languages;
    set.language(val);
    const lang = HttpLanguages.find((x) => x.value === val)!;
    set.framework(lang.frameworks[0].value);
  }, []);

  const frameworks = useMemo(
    () => HttpLanguages.find((x) => x.value === state.language)!.frameworks,
    [state.framework]
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

  const body = (req?.body as any).text ?? "";

  return (
    <section className="http-request">
      <header className="my-2">
        <h3 data-toc="false" className="text-xs" data-text={`${req?.method} ${onlyPathApi}`}>
          <HttpMethod method={req?.method} /> <span className="text-sm">{onlyPathApi}</span>
        </h3>
      </header>
      <div className="mt-8">
        <MiniTitle data-toc="false">Headers</MiniTitle>
        <Headers headers={headers} onChange={onChangeRequestHeaders} />
      </div>

      {body !== "" ? (
        <div className="mt-8 mb-4">
          <MiniTitle data-toc="false">Body</MiniTitle>
          <Body onChange={onChangeRequestBody} text={body} />
        </div>
      ) : null}
      <aside className="http-request-code">
        <form onSubmit={onSubmit} className="flex gap-x-4 items-center">
          <Select value={state.language} placeholder="Language" onChange={onChangeLang}>
            {HttpLanguages.map((x) => (
              <option key={`lang-${x.value}`} value={x.value}>
                {x.label}
              </option>
            ))}
          </Select>
          {frameworks.length > 1 && (
            <Select value={state.framework} placeholder="Framework" onChange={(e) => set.framework(e.target.value)}>
              {frameworks.map((x) => (
                <option key={`framework-${x.value}`} value={x.value}>
                  {x.label}
                </option>
              ))}
            </Select>
          )}
          <Button type="submit">Request API</Button>
        </form>
        <CodeHighlight code={requestCode} language={state.language} />
      </aside>
    </section>
  );
};

export default HttpRequest;
