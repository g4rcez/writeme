import { stringify as ymlStringify, parse as yamlParse } from "yaml";
import { FsPlugin } from "./fs.plugin";
import { IDocument } from "../interfaces/idocument";
import { Domain } from "../domain";
import { Is } from "@writeme/core";
import path from "path";
import grayMatter from "gray-matter";

const mdxHeader = (content: string) => {
  const document = grayMatter(content);
  return document.data;
};

const mdxContent = (content: string) => {
  const document = grayMatter(content);
  return { content: document.content, frontMatter: document.data };
};

export class Document extends FsPlugin implements IDocument {
  public async Update(document: Domain.Document, id: string) {
    const find = await this.findDocument(id);
    if (Is.NilOrEmpty(find)) return null;
    const { content, ...frontMatter } = document;
    const text = this.openFile(find);
    const result = mdxHeader(text);
    const tags = (result.tags ?? ([] as any[])).concat(document.tags);
    const authors = (result.authors ?? ([] as any[])).concat(document.authors);
    const yaml = ymlStringify({ ...result, ...frontMatter, tags, authors });
    const markdown = "--- yaml\n" + yaml + "---\n" + content;
    this.writeFile(find, markdown);
    return document;
  }

  public async GetDocumentById(id: string): Promise<Domain.Document | null> {
    const find = await this.findDocument(id);
    if (Is.NilOrEmpty(find)) return null;
    const filename = path.join(this.root, this.filename(id));
    return this.buildDocument(filename);
  }

  public async Save(document: Domain.Document): Promise<void> {
    const { content, ...data } = document;
    const yaml = ymlStringify(data);
    const text = "--- yaml\n" + yaml + "---\n" + content;
    this.writeFile(path.join(this.root, this.filename(document.url)), text);
  }

  public async GetDocuments(): Promise<Domain.DocumentDesc[]> {
    const allDocs = await this.enumerate();
    return allDocs
      .map((document): Domain.DocumentDesc => {
        const text = this.openFile(document);
        const result = mdxHeader(text);
        const url = this.basename(document);
        return {
          category: result.category,
          createdAt: result.createdAt.toString(),
          description: result.description,
          id: result.id ?? url,
          index: result.index,
          title: result.title,
          url,
        };
      })
      .sort((a, b) => a.index - b.index);
  }

  public async GetDocumentByName(name: string): Promise<Domain.Document | null> {
    const paths: string[] = await this.enumerate();
    const document = paths.find((x) => name === this.basename(x)) ?? null;
    if (Is.Null(document)) return null;
    return this.buildDocument(document);
  }

  public async GetAllDocumentPaths(): Promise<string[]> {
    const paths: string[] = await this.enumerate();
    return paths.map(this.basename.bind(this));
  }

  private async findDocument(id: string) {
    const file = path.join(this.root, this.filename(id));
    if (this.existFile(file)) return file;
    const allDocs = await this.enumerate();
    return (
      allDocs.find((document) => {
        const alternativeId = this.basename(document);
        const text = this.openFile(document);
        const result = mdxHeader(text);
        return result.id === id || id === alternativeId;
      }) ?? null
    );
  }

  private buildDocument(document: string) {
    const text = this.openFile(document);
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
  }
}
