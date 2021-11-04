import { DocumentStats } from "components";
import { WritemeDoc } from "db/database";
import Fs from "fs/promises";
import matter from "gray-matter";
import { Docs as LocalDocs } from "pages/docs/local-docs";
import { remarkTabs } from "lib/remark-tabs";
import { remarkVariables } from "lib/remark-variables";
import { Strings } from "lib/strings";
import { WritemeRc } from "lib/writemerc";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Path from "path";
import remarkDef from "remark-deflist";
import remarkFootnotes from "remark-footnotes";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";

type StaticPathAdapter = () => Promise<string[][]>;

export namespace Writeme {
  export type DocumentItem = {
    name: string;
    sidebar: number;
    items: DocumentStats[];
  };

  export const getStaticDocuments: StaticPathAdapter = async (): Promise<string[][]> => {
    const docs = await WritemeDoc.getAllForStaticPaths();
    return docs.map((document) => {
      const sectionSlug = document.section.slug;
      const documentSlug = document.slug;
      return Strings.concatUrl(sectionSlug, documentSlug).split("/");
    });
  };

  const writemeRc = WritemeRc()!;

  const markdownConfig = async (content: string, scope: any) => {
    const source = await serialize(content, {
      scope,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          remarkVariables(scope),
          remarkTabs,
          remarkGemoji,
          remarkDef,
          remarkFootnotes,
          [remarkGithub, { repository: scope.repository || writemeRc.defaultRepository || "" }],
        ],
      },
    });
    return source;
  };

  type ContentAdapter = (path: string) => Promise<{
    content: string;
    updatedAt: Date;
    createdAt: Date;
  }>;

  export type DocumentStrategy = {
    fileInfo: ContentAdapter;
    paths: StaticPathAdapter;
    groups: () => Promise<DocumentItem[]>;
  };

  export type MetaGroups = {
    content: string;
    path: string;
  };

  const getMetadataGroups = async (
    getAll: () => Promise<MetaGroups[]>,
    parseName: (name: string) => string
  ): Promise<DocumentItem[]> => {
    const docs = await getAll();
    const metadata = await Promise.all(
      docs.map(
        async (x): Promise<DocumentStats> =>
          ({
            ...matter(x.content).data,
            link: Strings.concatUrl("/docs", parseName(x.path)),
          } as never)
      )
    );

    const groups = metadata.reduce<LocalDocs.Data>((acc, doc) => {
      const key = doc.section;
      const current = acc[key];
      return { ...acc, [key]: Array.isArray(current) ? [...current, doc] : [doc] };
    }, {});
    return Object.keys(groups)
      .map((group) => {
        const items = groups[group];
        return {
          name: group,
          sidebar: LocalDocs.sidebarOrder(items),
          items: items.sort((a, b) => a.order - b.order),
        };
      })
      .sort((a, b) => a.sidebar - b.sidebar);
  };

  export const localStrategy: DocumentStrategy = {
    groups: () => getMetadataGroups(LocalDocs.getAll, LocalDocs.parseFile),
    fileInfo: async (path: string) => {
      const fullPath = Path.resolve(process.cwd(), ...LocalDocs.path, `${path}.mdx`);
      const content = await Fs.readFile(fullPath, "utf-8");
      const stats = await Fs.stat(fullPath);
      return {
        content,
        updatedAt: stats.mtime,
        createdAt: stats.birthtime,
      };
    },
    paths: async () => {
      const docs = await LocalDocs.getAll();
      return docs.map((file) => LocalDocs.parseFile(file.path).split("/"));
    },
  };

  export const dbStrategy: DocumentStrategy = {
    fileInfo: WritemeDoc.getDocumentContent,
    groups: () => getMetadataGroups(WritemeDoc.groups, (str) => str),
    paths: async () => {
      const paths = await WritemeDoc.getAllForStaticPaths();
      return paths.map((x) => Strings.concatUrl(x.section.slug, x.slug).split("/"));
    },
  };

  type StaticProps = {
    source: MDXRemoteSerializeResult<Record<string, unknown>>;
    docs: DocumentItem[];
    data: {
      next: DocumentStats | null;
      prev: DocumentStats | null;
      updatedAt: string;
      createdAt: string;
      readingTime: number;
    };
  };

  export const getStaticProps = async (
    queryPath: string[] | string | undefined,
    strategy: DocumentStrategy
  ): Promise<StaticProps> => {
    const path = Array.isArray(queryPath) ? Strings.concatUrl(queryPath.join("/")) : queryPath!;
    const writemeConfig = WritemeRc();

    try {
      const file = await strategy.fileInfo(path);
      const { content, data } = matter(file.content);
      const scope = {
        ...data,
        ...writemeConfig?.requestVariables,
        ...writemeConfig,
        repository: data.repository ?? "",
      };
      const source = await markdownConfig(content, scope);
      const docs = await strategy.groups();
      const currentGroup = docs.find((x) => x.sidebar === data.sidebar) ?? null;
      const order = data.order - 1;
      const next = currentGroup?.items[order + 1] ?? null;
      const prev = currentGroup?.items[order - 1] ?? null;

      return {
        source,
        docs,
        data: {
          ...data,
          next,
          prev,
          updatedAt: file.updatedAt.toISOString(),
          createdAt: file.createdAt.toISOString(),
          readingTime: Math.ceil(content.split(" ").length / 250),
        },
      };
    } catch (error) {
      throw error;
    }
  };
}
