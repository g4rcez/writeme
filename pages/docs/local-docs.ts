import { DocumentStats } from "components/order-doc";
import { readFileSync } from "fs";
import { Writeme } from "lib/writeme";
import Path from "path";
import { promisify } from "util";

export namespace Docs {
  const Glob = promisify(require("glob"));

  export type Data = Record<string, DocumentStats[]>;

  export const path = ["pages", "docs"];

  export const parseFile = (name: string) => name.replace("pages/docs/", "").replace(/\.mdx?$/gi, "");

  export const docFromExt = (ext: string) => Path.join(...path, "**", `*${ext}`);

  export const getAll = async (): Promise<Writeme.MetaGroups[]> => {
    const filesMd: string[] = await Glob(docFromExt(".md"));
    const filesMdx: string[] = await Glob(docFromExt(".mdx"));
    return [...filesMd, ...filesMdx].map((path) => ({ path, content: readFileSync(path, "utf-8") }));
  };

  export const sidebarOrder = (items: DocumentStats[]) =>
    Math.max(...items.map((x) => x.sidebar).filter((x) => !Number.isNaN(x) && typeof x === "number"));
}
