import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import remarkFootnotes from "remark-footnotes";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { remarkVariables } from "./remark-variables";
import { remarkTabs } from "./remark-tabs";
import remarkDef from "remark-deflist";
import { remarkCode } from "./remark-code";

export namespace Markdown {
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
        remarkPlugins: [
          remarkTabs,
          remarkCode,
          remarkVariables(scope),
          remarkGfm,
          remarkGemoji,
          remarkDef,
          remarkFootnotes,
        ] as any,
      },
    });
}
