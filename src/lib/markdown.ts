import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import remarkFootnotes from "remark-footnotes";
import grayMatter from "gray-matter";
import {FrontMatter, MarkdownDocument} from "../strategies/strategy";
import {serialize} from "next-mdx-remote/serialize";
import {MDXRemoteSerializeResult} from "next-mdx-remote";
import {remarkVariables} from "./remark-variables";
import {remarkTabs} from "./remark-tabs";
import remarkDef from "remark-deflist";

export namespace Markdown {
  export const frontMatter = (content: string) => {
    const document = grayMatter (content);
    return document.data;
  };

  export const extract = (text: string, name: string): MarkdownDocument => {
    const document = grayMatter (text);
    const matter: FrontMatter = document.data as any;
    const content = document.content;
    const createdAt = new Date (matter.createdAt as string).toISOString ();
    return {
      content,
      url: name,
      createdAt,
      tags: matter.tags,
      index: matter.index,
      title: matter.title,
      category: matter.category,
      frontMatter: {...matter, createdAt},
      description: matter.description ?? "",
    } as any;
  };

  export type MdxProcessed = MDXRemoteSerializeResult<Record<string, unknown>>;

  export const process = async <Scope extends Record<string, unknown>> (
      content: string,
      scope: Scope
  ): Promise<MdxProcessed> =>
      serialize (content, {
        scope,
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkVariables (scope), remarkTabs, remarkGemoji, remarkDef, remarkFootnotes],
        },
      });
}
