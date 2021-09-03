import React, { useCallback, useMemo, useState } from "react";
import { convert } from "./curl-parser";
import HttpSnippet from "@g4rcez/httpsnippet";
import { HttpLanguages } from "./languages";

type Props = {
  curl: string;
};

export const Http: React.VFC<Props> = ({ curl }) => {
  const [language, setLanguage] = useState("javascript");
  const [framework, setFramework] = useState("fetch");
  const request = useMemo(() => {
    try {
      return convert(curl)!;
    } catch (error) {
      return null;
    }
  }, [curl]);

  const requestCode = useMemo(() => {
    if (request === null) return "";
    try {
      const snippet = new HttpSnippet(request);
      const text = snippet.convert(language as any, framework as any) || "";
      return text.replace(/(\r?\n)+/g, "\n").replace(/^[ \t]\+/, "");
    } catch (error) {
      return "";
    }
  }, [language, framework, request]);

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

  return (
    <div>
      <div>
        <h2>Request</h2>
        <pre>
          <code>{JSON.stringify(request, null, 4)}</code>
        </pre>
      </div>
      <div>
        <h2>Code</h2>
        <select placeholder="Language" onChange={onChangeLang}>
          {HttpLanguages.map((x) => (
            <option key={`lang-${x.value}`} value={x.value}>
              {x.label}
            </option>
          ))}
        </select>
        <select
          placeholder="Framework"
          onChange={(e) => setFramework(e.target.value)}
        >
          {frameworks.map((x) => (
            <option key={`framework-${x.value}`} label={x.value}>
              {x.label}
            </option>
          ))}
        </select>
        <pre>
          <code>{requestCode}</code>
        </pre>
      </div>
    </div>
  );
};
