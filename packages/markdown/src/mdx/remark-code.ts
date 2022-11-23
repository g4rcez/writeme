const JSX_ATTRIBUTE = "mdxJsxAttribute";
const JSX_NODE_TYPE = "mdxJsxFlowElement";

export const remarkCode = () => (tree: any) => {
  const { children } = tree;
  let index = -1;
  while (++index < children.length) {
    const child = children[index];
    const isCode = child.type === "code";
    if (isCode) {
      const val = child.value;
      const parse = child.meta || "";
      const meta = parse.split(" ") as string[];
      const attrs = meta.reduce<any[]>(
        (acc, el) => {
          const [name, value] = el.split("=");
          return [...acc, { type: JSX_ATTRIBUTE, name, value }];
        },
        [
          { type: JSX_ATTRIBUTE, name: "lang", value: child.lang ?? "" },
          { type: JSX_ATTRIBUTE, name: "code", value: val },
        ]
      );
      children[index] = { name: "Pre", type: JSX_NODE_TYPE, children: [], attributes: attrs };
    }
  }
};
