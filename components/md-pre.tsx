import { HttpRequest } from "./http-request/http-request";
import { HttpResponse } from "./http-response/http-response";
import { CodeHighlight } from "./prism";

export const MdPre = (props: any) => {
  const componentProps = props.children.props;

  if (componentProps.type === "request") {
    return <HttpRequest curl={componentProps.children} />;
  }

  if (componentProps.type === "response") {
    return <HttpResponse />;
  }

  const language = /\w+-(\w+)/.exec(componentProps.className)?.[1];
  if (language === undefined)
    return (
      <pre className="block w-full border border-gray-100">
        <code>{componentProps.children}</code>
      </pre>
    );
  return <CodeHighlight code={componentProps.children} language={language} />;
};
