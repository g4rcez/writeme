import { Categories, MarkdownDocument, SimplerDocument, Strategy } from "./strategy";
import path from "path";
import { promisify } from "util";
import fs from "fs";
import { Markdown } from "../lib/markdown";
import { parse as ymlParse } from "yaml";
import { Strings } from "../lib/strings";

const glob = promisify(require("glob"));

type RawCategory = {
  name: string;
  title: string;
  icon?: string;
  index: number;
  banner?: string;
  description?: string;
};

export class FsStrategy extends Strategy {
  private root = path.join(path.resolve(process.cwd()), "docs");
  private postsDirRegex = path.join(this.root, "**", "*.?(md|mdx)");
  private categoriesFile = path.join(this.root, "categories.yml");

  public async getSimplerDocuments(): Promise<SimplerDocument[]> {
    const allDocs = await this.enumerate();
    return allDocs.map((document) => {
      const text = fs.readFileSync(document, "utf-8");
      const result = Markdown.frontMatter(text);
      return {
        index: result.index,
        title: result.title,
        category: result.category,
        url: this.basename(document),
      };
    });
  }

  public async getDocument(name: string): Promise<MarkdownDocument | null> {
    const paths: string[] = await this.enumerate();
    const document = paths.find((x) => name === this.basename(x));
    if (document === undefined) return null;
    const text = fs.readFileSync(document, "utf-8");
    return Markdown.extract(text, name);
  }

  public async getAllDocumentPaths(): Promise<string[]> {
    const paths: string[] = await this.enumerate();
    return paths.map(this.basename);
  }

  protected async fetchCategories(): Promise<Categories[]> {
    const text = fs.readFileSync(this.categoriesFile, "utf-8");
    const content: RawCategory[] = ymlParse(text);
    return content.map(
      (x): Categories => ({
        id: Strings.slug(x.name),
        url: Strings.slug(x.name),
        title: x.title,
        index: x.index,
        icon: x.icon,
        banner: x.banner,
        description: x.description ?? "",
      })
    );
  }

  private basename = (file: string) => path.basename(file).replace(/\.mdx?$/, "");

  private enumerate = async (): Promise<string[]> => glob(this.postsDirRegex);
}
