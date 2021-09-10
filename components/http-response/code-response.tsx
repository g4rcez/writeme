import { MiniTitle } from "components/mini-title";
import { CodeHighlight } from "components/prism";
import { Text } from "components/text";
import React, { useMemo } from "react";

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

export const CodeResponse: React.FC<Props> = ({ statusCode, children, body, language = "json" }) => {
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
