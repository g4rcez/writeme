// Using https://github.com/mccleanp/remark-docusaurus-tabs
import { Strings } from "../strings";

export function remarkTabs() {
  function renderTabs(defaultId: string | undefined, tabs: any[], nodes: any[]) {
    const getId = (tab: any): string => Strings.slug(nodes[tab.start].children[0].value);
    const getTitle = (tab: any): string => nodes[tab.start].children[0].value;

    const tabNodes = [];
    tabNodes.push({ type: "jsx", value: defaultId === undefined ? `<Tabs>` : `<Tabs default="${defaultId}">` });
    tabs.forEach((tab) => {
      tabNodes.push({ type: "jsx", value: `<Tab title="${getTitle(tab)}" id="${getId(tab)}">` });
      tabNodes.push(...nodes.slice(tab.start + 1, tab.end));
      tabNodes.push({ type: "jsx", value: `</Tab>` });
    });

    tabNodes.push({ type: "jsx", value: `</Tabs>` });

    return tabNodes;
  }

  function findTabs(index: number, parent: any): any {
    const tabs = [];
    let depth;
    let tab: any | undefined;
    const { children } = parent;
    while (++index < children.length) {
      const child = children[index];
      if (child.type === "heading") {
        if (depth == null) {
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
          tab = {};
          tab.start = index;
          tab.end = children.length;
          tabs.push(tab);
        }
      }
      if (child.type === "comment" && child.value.trim() === "/tabs") {
        tab.end = index;
        break;
      }
    }
    return tabs;
  }

  return (tree: any) => {
    const { children } = tree;
    let index = -1;
    let defaultIdTab: string | undefined = undefined;
    while (++index < children.length) {
      const child = children[index];
      if (child.type === "comment" && child.value.trim().startsWith("|tabs")) {
        const defaultId = child.value.trim().split(" ")[1];
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
  };
}
