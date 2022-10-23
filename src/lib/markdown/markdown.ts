import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import remarkFootnotes from "remark-footnotes";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { remarkVariables } from "./remark-variables";
import { remarkTabs } from "./remark-tabs";
import remarkDef from "remark-deflist";

export namespace Markdown {
  export const frontMatter = (content: string) => {
    const document = grayMatter(content);
    return document.data;
  };

  export const document = (content: string) => {
    const document = grayMatter(content);
    return { content: document.content, frontMatter: document.data };
  };

  export type MdxProcessed = MDXRemoteSerializeResult;

  export const process = async <Scope extends Record<string, unknown>>(
    content: string,
    scope: Scope
  ): Promise<MdxProcessed> =>
    serialize(content, {
      scope,
      parseFrontmatter: false,
      mdxOptions: {
        format: "mdx",
        useDynamicImport: true,
        remarkPlugins: [remarkTabs, remarkGfm, remarkVariables(scope), remarkGemoji, remarkDef, remarkFootnotes] as any,
      },
    });
}
