import { SimpleEditor } from "./simple-editor";
import { Checkbox } from "@writeme/lego";
import { Fragment } from "react";
import { Strings } from "@writeme/core";

type Node = {
  type?: string;
  props: {
    children: Node | string;
  };
};

type LastNode = {
  type?: string;
  props: {
    children: string;
  } & Record<string, any>;
};

type Transformer = {
  node: LastNode;
  exec: (s: LastNode) => string;
};

const map = new Map<string, (str: LastNode) => string>([
  ["a", (p) => `[${p.props.children}](${p.props.href})`],
  ["code", (p) => `\`${p.props.children}\``],
  ["del", (p) => `~~${p.props.children}~~`],
  ["em", (p) => `_${p.props.children}_`],
  ["strong", (p) => `**${p.props.children}**`],
]);

const recTransformer = (node: Node, transformers: Transformer[] = []): string => {
  if (node?.type === undefined) {
    return "";
  }
  const t = map.get(node.type);
  if (t === undefined && transformers.length === 0) return "";
  if (t !== undefined) transformers = transformers.concat({ exec: t, node: node.props as never });
  return typeof node.props.children !== "string"
    ? recTransformer(node.props.children, transformers)
    : transformers.reduceRight<string>(
        (acc, el) =>
          el.exec({
            type: el.node.type,
            props: {
              ...el.node,
              children: acc,
            },
          }),
        node.props.children
      );
};

const Resolver = ({ items }: { items: any[]; className?: string }) => {
  let text = "";
  const id = Strings.uuid();
  const parts = items.reduce((acc, el) => {
    if (typeof el === "string") {
      text += el;
      return acc;
    }
    const props = el.props;
    if (el.type === "input") {
      acc.push(<Checkbox defaultChecked={props.checked} id={`${id}-checkbox`} />);
      return acc;
    }
    const existElement = map.has(el.type);
    if (existElement) text += recTransformer(el);
    return acc;
  }, []);
  return (
    <Fragment>
      {parts}
      <SimpleEditor text={text.trim()} />
    </Fragment>
  );
};

export const TextResolver = (props: { children: any }) => {
  const child = Array.isArray(props.children) ? props.children : [props.children];
  return <Resolver items={child} />;
};
