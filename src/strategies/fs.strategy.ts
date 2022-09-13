import { Categories, Document, Strategy } from "./strategy";
import path from "path";
import { promisify } from "util";
import fs from "fs";
import grayMatter from "gray-matter";

const glob = promisify(require("glob"));

export class FsStrategy extends Strategy {
  private postsDirRegex = path.join(path.resolve(process.cwd()), "docs", "**", "*.?(md|mdx)");

  public async getDocument(name: string): Promise<Document | null> {
    const paths: string[] = await this.enumerate();
    const post = paths.find(x => name === this.basename(x));
    if (post === undefined) return null;
    const content = fs.readFileSync(post, "utf-8");
    const matter = grayMatter(content).data;
    return { ...matter, url: name, createdAt: new Date(matter.createdAt).toISOString() } as any;
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
