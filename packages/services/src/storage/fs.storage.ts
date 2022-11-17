import { Categories, IStorage, MarkdownDocument, SimplerDocument, VitrineDocument } from "./storage";
import path from "path";
import { promisify } from "util";
import fs from "fs";
import { parse as ymlParse, stringify as ymlStringify } from "yaml";
import { Is } from "@writeme/core/index";
import grayMatter from "gray-matter";

const glob = promisify(require("glob"));

const mdxHeader = (content: string) => {
  const document = grayMatter(content);
  return document.data;
};

const mdxContent = (content: string) => {
  const document = grayMatter(content);
  return { content: document.content, frontMatter: document.data };
};

export class FsStorage implements IStorage {
  public sorted: boolean = false;
  private root = path.join(path.resolve(process.cwd()), "docs");
  private postsDirectory = path.join(this.root, "**", "*.mdx");
  private categoryFile = path.join(this.root, "categories.yml");

  public async updateDocumentById(document: MarkdownDocument, id: string) {
    const find = await this.findDocument(id);
    if (Is.NilOrEmpty(find)) return null;
    const { content, ...frontMatter } = document;
    const text = fs.readFileSync(find, "utf-8");
    const result = mdxHeader(text);
    const tags = (result.tags ?? ([] as any[])).concat(document.tags);
    const authors = (result.authors ?? ([] as any[])).concat(document.authors);
    const yaml = ymlStringify({ ...result, ...frontMatter, tags, authors });
    const markdown = "--- yaml\n" + yaml + "---\n" + content;
    fs.writeFileSync(find, markdown, "utf-8");
    return document;
  }

  public async getDocumentById(id: string): Promise<MarkdownDocument | null> {
    const find = await this.findDocument(id);
    if (Is.NilOrEmpty(find)) return null;
    const filename = path.join(this.root, this.filename(id));
    return this.buildDocument(filename);
  }

  async getAllDocuments(): Promise<VitrineDocument[]> {
    const allDocs = await this.enumerate();
    return allDocs.map((document): VitrineDocument => this.buildDocument(document));
  }

  public async saveDocument(document: MarkdownDocument): Promise<void> {
    const { content, ...data } = document;
    const yaml = ymlStringify(data);
    const text = "--- yaml\n" + yaml + "---\n" + content;
    fs.writeFileSync(path.join(this.root, this.filename(document.url)), text, "utf-8");
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
      const result = mdxHeader(text);
      return { index: result.index, title: result.title, category: result.category, url: this.basename(document) };
    });
  }

  public async getDocumentByName(name: string): Promise<MarkdownDocument | null> {
    const paths: string[] = await this.enumerate();
    const document = paths.find((x) => name === this.basename(x)) ?? null;
    if (Is.Null(document)) return null;
    return this.buildDocument(document);
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
        icon: x.icon ?? "",
        title: x.title,
        index: x.index,
        banner: x.banner ?? "",
        description: x.description ?? "",
      })
    );
  }

  private filename = (basename: string) => `${basename}.mdx`;

  private findDocument = async (id: string) => {
    const file = path.join(this.root, this.filename(id));
    if (fs.existsSync(file)) return file;
    const allDocs = await this.enumerate();
    return (
      allDocs.find((document) => {
        const alternativeId = this.basename(document);
        const text = fs.readFileSync(document, "utf-8");
        const result = mdxHeader(text);
        return result.id === id || id === alternativeId;
      }) ?? null
    );
  };

  private buildDocument = (document: string) => {
    const text = fs.readFileSync(document, "utf-8");
    const { content, frontMatter } = mdxContent(text);
    const url = this.basename(document);
    const idDoc = frontMatter.id || url;
    return {
      content,
      id: idDoc,
      index: frontMatter.index,
      url: frontMatter.url ?? url,
      title: frontMatter.title,
      category: frontMatter.category,
      tags: frontMatter.tags || [],
      authors: frontMatter.authors || [],
      description: frontMatter.description ?? "",
      createdAt: new Date(frontMatter.createdAt).toISOString(),
    };
  };

  private writeCategory = (yaml: any) => fs.writeFileSync(this.categoryFile, ymlStringify(yaml));

  private basename = (file: string) => path.basename(file).replace(/\.mdx$/, "");

  private enumerate = async (): Promise<string[]> => glob(this.postsDirectory);

  private openFile = (file: string) => fs.readFileSync(file, "utf-8");
}
