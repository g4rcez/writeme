import dynamic from "next/dynamic";
import Flowchart from "./flowchart";

const HttpRequest = dynamic(() => import("./http-request/http-request"));
const HttpResponse = dynamic(() => import("./http-response/http-response"));
const OpenGraph = dynamic(() => import("./open-graph"));
const CodeHighlight = dynamic(() => import("./prism"));

const re = /((\w+)=(\w+|"[\w+ -]+"))/gi;

const parseMetaString = (str: string | undefined): Types.Dict => {
  if (str === undefined) return {};
  const matches = str.split(re);
  return matches.reduce((acc, el) => {
    if (!el.includes("=")) {
      return acc;
    }
    const [property, ...values] = el.split("=");
    const strTrim = values
      .join()
      .replace(/^("|')/, "")
      .replace(/("|')$/, "")
      .trim();
    return { ...acc, [property]: strTrim };
  }, {});
};

export const MdPre = (props: any) => {
  const componentProps = props.children.props;
  const language = /\w+-(\w+)/.exec(componentProps.className)?.[1];
  const metaProps = parseMetaString(componentProps.metastring);
  const type = metaProps.type;

  if (language === "chart") {
    return <Flowchart code={componentProps.children} />;
  }

  if (type === "ogp" && language === "ogp") {
    return (
      <OpenGraph
        {...metaProps}
        className={metaProps.className}
        url={`${componentProps.children.replace("\n", "").trim()}`}
      />
    );
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
  return <CodeHighlight code={componentProps.children.replace(/\n$/, "").replace(/^\n/, "")} language={language} />;
};

export default MdPre;
