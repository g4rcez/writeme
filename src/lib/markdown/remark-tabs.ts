// Using https://github.com/mccleanp/remark-docusaurus-tabs
import { Strings } from "../strings";

const allowedType = (type: string) => type === "comment" || type === "html" || type === "mdxFlowExpression";

const isOpenedTab = (str: string) => str.includes("|tabs");

const isClosedTab = (str: string) => str.includes("/tabs");

const REGEX_EXTRACT_TAB_VALUE = /^<!-- \|tabs ([\S\d_-]+) -->/;

const REGEX_EXTRACT_MDX_FLOW = /\/\* \|tabs ([\S0-9_@#$-]+) \*\//;

const JSX_NODE_TYPE = "mdxJsxFlowElement";
const JSX_ATTRIBUTE = "mdxJsxAttribute";

const renderTabs = (defaultId: string | undefined, tabs: any[], nodes: any[]) => [
  {
    name: "Tabs",
    type: JSX_NODE_TYPE,
    attributes: [{ type: JSX_ATTRIBUTE, name: "default", value: defaultId === undefined ? "" : `${defaultId}` }],
    children: tabs.map((t) => {
      const tab = nodes[t.start];
      const title = tab.children[0].value;
      const id = Strings.slug(title);
      return {
        type: JSX_NODE_TYPE,
        name: "Tab",
        attributes: [
          { type: JSX_ATTRIBUTE, name: "title", value: title },
          { type: JSX_ATTRIBUTE, name: "id", value: id },
        ],
        children: nodes.slice(t.start + 1, t.end),
      };
    }),
  },
];

function findTabs(index: number, parent: any): any {
  const tabs = [];
  let depth = null;
  let tab: any | undefined;
  const { children } = parent;
  while (++index < children.length) {
    const child = children[index];
    if (child.type === "heading") {
      if (depth === null) {
        depth = child.depth;
      }
      if (child.depth < depth) {
        tab.end = index;
        break;
      }
      if (child.depth === depth) {
        if (tab) {
          tab.end = index;
        }
        tab = { start: index, end: children.length };
        tabs.push(tab);
      }
    }
    if (allowedType(child.type) && isClosedTab(child.value)) {
      tab.end = index;
      break;
    }
  }
  return tabs;
}

export function remarkTabs() {
  return (tree: any) => {
    const { children } = tree;
    let index = -1;
    while (++index < children.length) {
      const child = children[index];
      const type = child.type;
      if (allowedType(type)) {
        if (isOpenedTab(child.value)) {
          let defaultIdTab: string | undefined = undefined;
          const val = child?.value?.trim() ?? "";
          let defaultId = val.split(" ")[1];
          if (type === "html") {
            defaultId = REGEX_EXTRACT_TAB_VALUE.exec(val)?.[1];
          }
          if (type === "mdxFlowExpression") {
            defaultId = REGEX_EXTRACT_MDX_FLOW.exec(val)?.[1];
          }
          if (defaultId) defaultIdTab = defaultId;
          const tabs = findTabs(index, tree);
          const start = tabs[0].start;
          const end = tabs[tabs.length - 1].end;
          if (tabs.length > 0) {
            const nodes = renderTabs(defaultIdTab, tabs, children);
            children.splice(start, end - start, ...nodes);
            index += nodes.length;
          }
        }
      }
    }
  };
}
