import { Categories, MarkdownDocument, Strategy } from "./strategy";
import path from "path";
import { promisify } from "util";
import fs from "fs";
import { Markdown } from "../lib/markdown";

const glob = promisify(require("glob"));

export class FsStrategy extends Strategy {
  private postsDirRegex = path.join(path.resolve(process.cwd()), "docs", "**", "*.?(md|mdx)");

  public async getDocument(name: string): Promise<MarkdownDocument | null> {
    const paths: string[] = await this.enumerate();
    const post = paths.find(x => name === this.basename(x));
    if (post === undefined) return null;
    const text = fs.readFileSync(post, "utf-8");
    return Markdown.extract(text, name);
  }

  public async getAllDocumentPaths(): Promise<string[]> {
    const paths: string[] = await this.enumerate();
    return paths.map(this.basename);
  }

  public getCategories(): Promise<Categories[]> {
    return Promise.resolve([]);
  }

  private basename = (file: string) => path.basename(file).replace(/\.mdx?$/, "");

  private enumerate = async () => glob(this.postsDirRegex);
}
