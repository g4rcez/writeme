import { DocumentStats } from "components";
import matter from "gray-matter";
import { Strings } from "./strings";

export namespace Strategy {
  export type StaticPath = () => Promise<string[][]>;

  export type Data = Record<string, DocumentStats[]>;

  export type Content = (path: string) => Promise<{
    content: string;
    updatedAt: Date;
    createdAt: Date;
  }>;

  export type Document = {
    fileInfo: Content;
    paths: StaticPath;
    groups: () => Promise<DocumentItem[]>;
  };

  export type MetaGroups = {
    content: string;
    path: string;
  };
  export type DocumentItem = {
    name: string;
    sidebar: number;
    items: DocumentStats[];
  };

  const sidebarOrder = (items: DocumentStats[]) =>
    Math.max(...items.map((x) => x.sidebar).filter((x) => !Number.isNaN(x) && typeof x === "number"));

  export const metadataGroups = async (
    getAll: () => Promise<Strategy.MetaGroups[]>,
    parseName: (name: string) => string
  ): Promise<Strategy.DocumentItem[]> => {
    const docs = await getAll();
    const metadata = await Promise.all(
      docs.map(
        async (document): Promise<DocumentStats> =>
          ({
            ...matter(document.content).data,
            link: Strings.concatUrl("/docs", parseName(document.path)),
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
          sidebar: sidebarOrder(items),
          items: items.sort((a, b) => a.order - b.order),
        };
      })
      .sort((a, b) => a.sidebar - b.sidebar);
  };
}
