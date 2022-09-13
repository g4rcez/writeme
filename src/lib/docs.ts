import { Metadata } from "src/components/order-doc";
import { promisify } from "util";
import Path from "path";
import Fs from "fs/promises";
import matter from "gray-matter";
import { Strings } from "./strings";

export namespace Docs {
  const Glob = promisify(require("glob"));

  export type Data = Record<string, Metadata[]>;

  export const path = ["pages", "docs"];

  export const parseFile = (name: string) => name.replace("pages/docs/", "").replace(/\.mdx?$/gi, "");

  const docFromExt = (ext: string) => Path.join(...Docs.path, "**", `*${ext}`);

  export const getAllDocs = async (): Promise<string[]> => {
    const filesMd = await Glob(docFromExt(".md"));
    const filesMdx = await Glob(docFromExt(".mdx"));
    return [...filesMd, ...filesMdx];
  };

  export const sidebarOrder = (items: Metadata[]) =>
    Math.max(...items.map((x) => x.sidebar).filter((x) => !Number.isNaN(x) && typeof x === "number"));

  export type DocMetadata = Array<{
    name: string;
    sidebar: number;
    items: Metadata[];
  }>;

  export const getAllMetadataDocs = async () => {
    const docs = await Docs.getAllDocs();
    const metadata = await Promise.all(
      docs.map(
        async (x): Promise<Metadata> =>
          ({
            ...matter(await Fs.readFile(x, "utf-8")).data,
            link: Strings.concatUrl("/docs", Docs.parseFile(x)),
          } as never)
      )
    );

    const groups = metadata.reduce<Data>((acc, doc) => {
      const key = doc.section;
      const current = acc[key];
      return { ...acc, [key]: Array.isArray(current) ? [...current, doc] : [doc] };
    }, {});
    return Object.keys(groups)
      .map((group) => {
        const items = groups[group];
        return {
          name: group,
          sidebar: Docs.sidebarOrder(items),
          items: items.sort((a, b) => a.order - b.order),
        };
      })
      .sort((a, b) => a.sidebar - b.sidebar);
  };
}
