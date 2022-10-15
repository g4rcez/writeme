import { Categories, MarkdownDocument, SimplerDocument, IStorage, MarkdownDocumentRaw } from "./storage";
import path from "path";
import { promisify } from "util";
import fs from "fs";
import { Markdown } from "../../lib/markdown/markdown";
import { parse as ymlParse, stringify as ymlStringify } from "yaml";
import { Strings } from "../../lib/strings";

const glob = promisify(require("glob"));

export class FsStorage implements IStorage {
  public async saveDocument(data: MarkdownDocumentRaw): Promise<MarkdownDocument> {
    const document: MarkdownDocument = {
      tags: [],
      authors: [],
      id: Strings.uuid(),
      index: data.index,
      title: data.title,
      url: Strings.slug(data.url),
      category: data.category,
      content: data.category,
      description: data.description,
      createdAt: data.createdAt,
    };
    const yaml = ymlStringify(document);
    const text = "--- yaml\n" + yaml + "\n---\n" + data.content;
    fs.writeFileSync(`${document.url}.md`, text, "utf-8");
    return document;
  }

  public sorted: boolean = false;
  private root = path.join(path.resolve(process.cwd()), "docs");
  private postsDirectory = path.join(this.root, "**", "*.?(md|mdx)");
  private categoryFile = path.join(this.root, "categories.yml");

  private writeCategory = (yaml: any) => fs.writeFileSync(this.categoryFile, ymlStringify(yaml));

  public async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getCategories();
    this.writeCategory(categories.filter((x) => x.id !== id));
    return true;
  }

  public async updateCategory(category: Categories): Promise<void> {
    const categories = await this.getCategories();
    const newCategories = categories.map((x) => (x.id === category.id ? category : x));
    this.writeCategory(newCategories);
  }

  public async getCategory(id: string): Promise<Categories | null> {
    const text = this.openFile(this.categoryFile);
    const yml = ymlParse(text);
    return yml.find((x: any) => x.id === id) ?? null;
  }

  public async saveCategory(category: Categories): Promise<void> {
    const categories = await this.getCategories();
    categories.push(category);
    this.writeCategory(categories);
  }

  public async getSimplerDocuments(): Promise<SimplerDocument[]> {
    const allDocs = await this.enumerate();
    return allDocs.map((document) => {
      const text = fs.readFileSync(document, "utf-8");
      const result = Markdown.frontMatter(text);
      return { index: result.index, title: result.title, category: result.category, url: this.basename(document) };
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

  public async getCategories(): Promise<Categories[]> {
    const text = fs.readFileSync(this.categoryFile, "utf-8");
    const content: Categories[] = ymlParse(text);
    return content.map(
      (x): Categories => ({
        id: x.id,
        url: x.url,
        icon: x.icon,
        title: x.title,
        index: x.index,
        banner: x.banner,
        description: x.description ?? "",
      })
    );
  }

  private basename = (file: string) => path.basename(file).replace(/\.mdx?$/, "");

  private enumerate = async (): Promise<string[]> => glob(this.postsDirectory);

  private openFile = (file: string) => fs.readFileSync(file, "utf-8");
}
