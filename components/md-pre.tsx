import { HttpRequest } from "./http-request/http-request";
import { HttpResponse } from "./http-response/http-response";
import { OpenGraph } from "./open-graph";
import { CodeHighlight } from "./prism";

export const MdPre = (props: any) => {
  const componentProps = props.children.props;
  const language = /\w+-(\w+)/.exec(componentProps.className)?.[1];
  const type = componentProps.type;

  if (type === "ogp" && language === "ogp") {
    return <OpenGraph {...componentProps} url={`${componentProps.children.replace("\n", "").trim()}`} />;
  }

  if (type === "request") {
    return <HttpRequest curl={componentProps.children} />;
  }

  if (type === "response") {
    return <HttpResponse />;
  }

  if (language === undefined)
    return (
      <pre className="block w-full border border-gray-100">
        <code>{componentProps.children}</code>
      </pre>
    );
  return <CodeHighlight code={componentProps.children} language={language} />;
};
