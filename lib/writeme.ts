import { DocumentStats } from "components";
import { WritemeDoc } from "db/database";
import Fs from "fs/promises";
import matter from "gray-matter";
import { Docs } from "lib/local-docs";
import { remarkTabs } from "lib/remark-tabs";
import { remarkVariables } from "lib/remark-variables";
import { Strings } from "lib/strings";
import { WritemeRc } from "lib/writemerc";
import { GetStaticProps } from "next";
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

  export const getStaticFiles: StaticPathAdapter = async (): Promise<string[][]> => {
    const docs = await Docs.getAllDocs();
    return docs.map((file) => Docs.parseFile(file).split("/"));
  };

  export const getStaticDocuments: StaticPathAdapter = async (): Promise<string[][]> => {
    const docs = await WritemeDoc.getAllForStaticPaths();
    return docs.map((document) => {
      const sectionSlug = document.section.slug;
      const documentSlug = document.slug;
      return Strings.concatUrl(sectionSlug, documentSlug).split("/");
    });
  };

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
          [remarkGithub, { repository: scope.repository ?? "" }],
        ],
      },
    });
    return source;
  };

  type ContentAdapter = (path: string) => Promise<string>;

  type StatsAdapter = (path: string) => Promise<{
    updatedAt: Date;
    createdAt: Date;
  }>;

  export type DocumentStrategy = {
    content: ContentAdapter;
    stats: StatsAdapter;
    groups: () => Promise<DocumentItem[]>;
  };

  export const localFiles: DocumentStrategy = {
    content: (path: string) => Fs.readFile(Path.resolve(process.cwd(), ...Docs.path, `${path}.mdx`), "utf-8"),
    stats: async (path: string) => {
      const fullPath = Path.resolve(process.cwd(), ...Docs.path, `${path}.mdx`);
      const stats = await Fs.stat(fullPath);
      return {
        updatedAt: stats.mtime,
        createdAt: stats.birthtime,
      };
    },
    groups: Docs.getAllMetadataDocs,
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
    const writemeConfig = await WritemeRc();

    try {
      const fileContent = await strategy.content(path);
      const stat = await strategy.stats(path);
      const { content, data } = matter(fileContent);
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
          updatedAt: stat.updatedAt.toISOString(),
          createdAt: stat.createdAt.toISOString(),
          readingTime: Math.ceil(content.split(" ").length / 250),
        },
      };
    } catch (error) {
      throw error;
    }
  };
}
