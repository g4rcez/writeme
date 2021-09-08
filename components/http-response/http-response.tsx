import { useHttpContext } from "components/http.context";
import { CodeHighlight } from "components/prism";
import React, { useMemo } from "react";

export const HttpResponse: React.VFC = () => {
  const { response, loading } = useHttpContext();

  const httpResponseText: string = useMemo(() => {
    if (response === null) return "";
    const urlParts = new URL(response.url);
    const headers = response.headers || {};
    const httpHeadersString = Object.keys(headers).map((key) => `${key}: ${headers[key]}`);
    const httpResponse = [`${response.method} ${urlParts.pathname}`];
    httpResponse.push(...httpHeadersString);
    httpResponse.push("");
    httpResponse.push(JSON.stringify(response.body, null, 4));
    return httpResponse.join("\n");
  }, [response]);

  if (loading) return <span className="text-lg mt-4 mb-2 italic text-gray-300">Loading...</span>;

  if (response === null) {
    return null;
  }

  return (
    <section className="mt-4 mb-2">
      <CodeHighlight code={httpResponseText} language="http" />
    </section>
  );
};
