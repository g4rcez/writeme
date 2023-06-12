import HttpSnippet from "@g4rcez/httpsnippet";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Body } from "./body";
import { convert, Header } from "./curl-parser";
import { Headers } from "./headers";
import { HttpLanguages } from "./languages";
import { useCodeLanguage } from "../code-language";
import { useHttpContext } from "../http.context";
import { Is } from "@writeme/core";
import { Button, Select } from "@writeme/lego";
import { Tab, Tabs } from "../../tabs";
import { Option } from "@writeme/lego/src/form/select";

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
  const { onRequest, loading } = useHttpContext();
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

  const onChangeLang = useCallback((_name: string, option: Option) => {
    const val = option;
    set.language(val);
    const lang = HttpLanguages.find((x) => x.value === val)!;
    set.framework(lang.frameworks[0].value);
  }, []);

  const frameworks = useMemo(() => HttpLanguages.find((x) => x.value === state.language)!.frameworks, [state.language]);

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
    <section className="border-border min-w-full flex-wrap whitespace-pre-wrap rounded-lg border p-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-x-4">
        <header className="flex flex-row flex-wrap items-center justify-between gap-2">
          <h3 data-toc="false" data-text={`${req?.method} ${onlyPathApi}`}>
            {req?.method} {req?.url}
          </h3>
          <Button loading={loading} type="submit">
            Request
          </Button>
        </header>
        <Tabs default="options">
          <Tab title="Headers" id="headers">
            <Headers headers={headers} onChange={onChangeRequestHeaders} />
          </Tab>
          {body !== "" ? (
            <Tab title="Body" id="body">
              <Body onChange={onChangeRequestBody} text={body} />
            </Tab>
          ) : null}
          <Tab title="Options" id="options">
            <aside className="flex flex-row flex-nowrap gap-4 pt-2">
              <Select
                options={HttpLanguages.map((x) => x.value)}
                value={state.language}
                placeholder="Language"
                onChangeOption={onChangeLang}
              />
              {frameworks.length > 1 && (
                <Select
                  options={frameworks.map((x) => x.value)}
                  value={state.framework}
                  placeholder="Framework"
                  onChangeOption={(_, e) => set.framework(e)}
                />
              )}
            </aside>
          </Tab>
        </Tabs>
        <CodeHighlight code={requestCode} language={state.language} />
      </form>
    </section>
  );
};

export default HttpRequest;
