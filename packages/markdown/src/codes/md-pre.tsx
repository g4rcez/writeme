import { useHttpContext } from "./http.context";
import dynamic from "next/dynamic";
import React, { Fragment } from "react";
import Playground from "./playground";

const HttpContext = dynamic(() => import("./http.context") as any) as any;
const HttpRequest = dynamic(() => import("./http-request/http-request"));
const HttpResponse = dynamic(() => import("./http-response/http-response"));
const OpenGraph = dynamic(() => import("./open-graph/open-graph"));
const CodeHighlight = dynamic(() => import("./prism"));
const Flowchart = dynamic(() => import("./flowchart"));
const Mermaid = dynamic(() => import("./mermaid"));

const ConnectedHttp: React.FC<{ code: string }> = ({ code }) => {
  const { response, loading } = useHttpContext();
  return (
    <Fragment>
      <HttpRequest curl={code} />
      <HttpResponse response={response} loading={loading} />
    </Fragment>
  );
};

const isHttpCurlCommand = (command: string) => command.startsWith("curl ") || command.startsWith("http ");

type Props = Partial<{
  code: string;
  lang: string;
  theme: string;
  type: string;
  className: string;
}>;

export const MdPre = ({ className = "", lang = "", type = "", code = "" }: Props) => {
  const isCurlRequest = isHttpCurlCommand(code);
  if (lang === "playground") return <Playground code={code} template={(type as any) || "react-ts"} />;
  if (lang === "ogp") return <OpenGraph className={className} url={`${code.replace("\n", "").trim()}`} />;
  if (lang === "mermaid") return <Mermaid content={code.trim()} />;
  if (lang === undefined)
    return (
      <pre className="border-border-slight block w-full border">
        <code>{code}</code>
      </pre>
    );
  if (lang === "chart") return <Flowchart code={code} />;
  if (type === "request" || isCurlRequest) {
    const command = code.replace(/^http /, "curl ") ?? "";
    return (
      <HttpContext>
        <ConnectedHttp code={command} />
      </HttpContext>
    );
  }
  return <CodeHighlight code={code.replace(/\n$/, "").replace(/^\n/, "")} language={lang} />;
};

export default MdPre;
