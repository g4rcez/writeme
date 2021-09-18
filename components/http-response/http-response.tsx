import { HttpResponseProps, MiniTitle } from "components";
import { HttpCircleStatus } from "components/circle";
import { useHttpContext } from "components/http.context";
import { CodeHighlight } from "components/prism";
import React, { useMemo } from "react";

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
const MessageFromStatus: Record<number, string> = {
  100: "Continue",
  101: "Switching Protocols",
  103: "Early Hints",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a teapot",
  422: "Unprocessable Entity",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required",
};

type Props = { response: HttpResponseProps; loading: boolean };

export const HttpResponse: React.VFC<Props> = ({ loading, response }) => {
  const httpResponseText: string = useMemo(() => {
    if (response === null) return "";
    const urlParts = new URL(response.url);
    const headers = response.headers || {};
    const httpHeadersString = Object.keys(headers).map((key) => `${key}: ${headers[key]}`);
    const httpResponse = [`${response.method} ${urlParts.pathname} HTTP/1.1`];
    httpResponse.push(...httpHeadersString);
    httpResponse.push("");
    httpResponse.push(JSON.stringify(response.body, null, 4));
    return httpResponse.join("\n");
  }, [response]);

  if (loading) return <span className="http-response-loading">Loading...</span>;

  if (response === null) {
    return (
      <h3 data-toc="false" className="italic font-thin mb-6 underline">
        No response. Click in Request API to view your response
      </h3>
    );
  }

  return (
    <section className="http-response">
      <MiniTitle>
        <span className="flex items-baseline gap-x-2">
          <a
            href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${response.statusCode}`}
            target="_blank"
            rel="noreferrer"
          >
            <HttpCircleStatus status={response.statusCode} /> {response.statusCode}
          </a>
          {MessageFromStatus[response.statusCode]}
        </span>
      </MiniTitle>
      <CodeHighlight code={httpResponseText} language="http" />
    </section>
  );
};

export default HttpResponse;
