import { DocumentStats } from "src/components";
import FsSync from "fs";
import matter from "gray-matter";
import { remarkTabs } from "src/lib/markdown/remark-tabs";
import { remarkVariables } from "src/lib/markdown/remark-variables";
import { Strings } from "src/lib/strings";
import { NextApiRequest, NextApiResponse } from "next";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Path from "path";
import remarkDef from "remark-deflist";
import remarkFootnotes from "remark-footnotes";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import { Http } from "./http";
import { Is } from "./is";
import { Strategy } from "./strategy";

export namespace Writeme {
  type RecursiveDict = {
    [k: string]: string | RecursiveDict;
  };

  type ConfigValues = string | number | null | ConfigValues[];

  export type WritemeRcProps = {
    title: string;
    baseUrl?: string;
    strategy?: string;
    defaultRepository?: string;
    requestVariables?: Partial<Record<string, ConfigValues>>;
    tokens?: Partial<{
      colors: RecursiveDict;
    }>;
  };

  export const rcConfig = (): WritemeRcProps => {
    const path = Path.join(process.cwd(), "writeme.ts");
    const exists = FsSync.existsSync(path);
    if (!exists) return require(path);
    return { title: "Writeme" };
  };

  export const config = rcConfig();
}
