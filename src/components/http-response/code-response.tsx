import { MiniTitle } from "src/components/mini-title";
import { CodeHighlight } from "src/components/prism";
import { Text } from "src/components/text";
import React, { PropsWithChildren, useMemo } from "react";

type Props = {
  body: any;
  language?: string;
  statusCode: 200 | 201 | 202 | 204 | 500 | 501 | 503 | 400 | 401 | 403 | 404;
};

export const StatusCodeDict: Record<Props["statusCode"], React.ReactNode> = {
  "200": "Ok",
  "201": "Created",
  "202": "Accepted",
  "204": "No Content",
  "400": "Bad Request",
  "401": "Unauthorized",
  "403": "Forbidden",
  "404": "Not Found",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "503": "Service Unavailable",
};

export const CodeResponse = ({ statusCode, children, body, language = "json" }: PropsWithChildren<Props>) => {
  const responseBody = useMemo(
    () => (typeof body === "object" ? JSON.stringify(body, null, 4) : `${body ?? ""}`),
    [body]
  );

  return (
    <section className="http-response-code">
      <MiniTitle>
        {statusCode} - {StatusCodeDict[statusCode]}
      </MiniTitle>
      <Text>{children}</Text>
      <CodeHighlight code={responseBody} language={language} />
    </section>
  );
};
