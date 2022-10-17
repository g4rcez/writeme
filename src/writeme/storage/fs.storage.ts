import { Categories, IStorage, MarkdownDocument, SimplerDocument, VitrineDocument } from "./storage";
import path from "path";
import { promisify } from "util";
import fs from "fs";
import { Markdown } from "../../lib/markdown/markdown";
import { parse as ymlParse, stringify as ymlStringify } from "yaml";

const glob = promisify(require("glob"));

export class FsStorage implements IStorage {
  public sorted: boolean = false;
  private root = path.join(path.resolve(process.cwd()), "docs");
  private postsDirectory = path.join(this.root, "**", "*.?(md|mdx)");
  private categoryFile = path.join(this.root, "categories.yml");

  public async updateDocument(document: MarkdownDocument, id: string) {
    const allDocs = await this.enumerate();
    const find = allDocs.find((document) => {
      const text = fs.readFileSync(document, "utf-8");
      const result = Markdown.frontMatter(text);
      return result.id === id;
    });
    if (find === undefined) return null;
    const { content, ...frontMatter } = document;
    const text = fs.readFileSync(find, "utf-8");
    const result = Markdown.frontMatter(text);
    const tags = (result.tags ?? ([] as any[])).concat(document.tags);
    const authors = (result.authors ?? ([] as any[])).concat(document.authors);
    const yaml = ymlStringify({ ...result, ...frontMatter, tags, authors });
    const markdown = "--- yaml\n" + yaml + "---\n" + content;
    fs.writeFileSync(find, markdown, "utf-8");
    return document;
  }

  public async getDocumentById(id: string): Promise<MarkdownDocument | null> {
    const allDocs = await this.enumerate();
    const find = allDocs.find((document) => {
      const text = fs.readFileSync(document, "utf-8");
      const result = Markdown.frontMatter(text);
      return result.id === id;
    });
    if (find === undefined) return null;
    const filename = path.join(this.root, find);
    const text = fs.readFileSync(filename, "utf-8");
    const { content, frontMatter } = Markdown.document(text);
    return {
      index: frontMatter.index,
      url: frontMatter.url,
      id: frontMatter.id,
      content,
      description: frontMatter.description ?? "",
      title: frontMatter.title,
      category: frontMatter.category,
      createdAt: new Date(frontMatter.createdAt).toISOString(),
      tags: frontMatter.tags || [],
      authors: frontMatter.authors || [],
    };
  }

  async getAllDocuments(): Promise<VitrineDocument[]> {
    const allDocs = await this.enumerate();
    return allDocs.map((document): VitrineDocument => {
      const text = fs.readFileSync(document, "utf-8");
      const result = Markdown.frontMatter(text);
      const id = this.basename(document);
      return {
        index: result.index,
        title: result.title,
        category: result.category,
        url: id,
        tags: result.tags ?? [],
        description: result.description ?? "",
        authors: result.authors ?? [],
        id: id,
        createdAt: new Date(result.createdAt).toISOString(),
      };
    });
  }

  public async saveDocument(document: MarkdownDocument): Promise<void> {
    const { content, ...data } = document;
    const yaml = ymlStringify(data);
    const text = "--- yaml\n" + yaml + "---\n" + content;
    fs.writeFileSync(path.join(this.root, `${document.url}.md`), text, "utf-8");
  }

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
    return Markdown.extract(fs.readFileSync(document, "utf-8"), name);
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

  private writeCategory = (yaml: any) => fs.writeFileSync(this.categoryFile, ymlStringify(yaml));

  private basename = (file: string) => path.basename(file).replace(/\.mdx?$/, "");

  private enumerate = async (): Promise<string[]> => glob(this.postsDirectory);

  private openFile = (file: string) => fs.readFileSync(file, "utf-8");
}
