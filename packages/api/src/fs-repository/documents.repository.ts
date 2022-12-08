import { stringify as ymlStringify } from "yaml";
import { FsPlugin } from "./fs.plugin";
import { IDocumentsRepository } from "../interfaces/documents.repository";
import { Domain } from "../domain";
import { Either, Is } from "@writeme/core";
import path from "path";
import grayMatter from "gray-matter";

const parseMdx = (content: string) => {
  const document = grayMatter(content);
  return { content: document.content, frontMatter: document.data };
};

export class Document extends FsPlugin implements IDocumentsRepository {
  public async update(document: Domain.Document) {
    const find = await this.findDocument(document.id);
    if (Is.NilOrEmpty(find)) return Either.error(["File not found"]);
    const { content, ...frontMatter } = document;
    const text = this.openFile(find);
    const result = parseMdx(text).frontMatter;
    const tags = (result.tags || []).concat(document.tags);
    const authors = (result.authors || []).concat(document.authors);
    const markdown = "--- yaml\n" + ymlStringify({ ...result, ...frontMatter, tags, authors }) + "---\n" + content;
    this.writeFile(find, markdown);
    return Either.success(document);
  }

  public async getById(id: string): Promise<Domain.Document | null> {
    const find = await this.findDocument(id);
    if (Is.NilOrEmpty(find)) return null;
    const filename = path.join(this.root, this.filename(id));
    return this.buildDocument(filename);
  }

  public async save(document: Domain.Document) {
    const { content, ...data } = document;
    const text = "--- yaml\n" + ymlStringify(data) + "---\n" + content;
    this.writeFile(path.join(this.root, this.filename(document.url)), text);
    return Either.success(document);
  }

  public async getAll(): Promise<Domain.DocumentDesc[]> {
    const allDocs = await this.enumerate();
    return allDocs
      .map((document): Domain.DocumentDesc => {
        const text = this.openFile(document);
        const result = parseMdx(text).frontMatter;
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

  public async getAllPaths(): Promise<string[]> {
    const paths: string[] = await this.enumerate();
    return paths.map(this.basename.bind(this));
  }

  public async delete(id: string) {
    return Promise.resolve(null);
  }

  private async findDocument(id: string) {
    const file = path.join(this.root, this.filename(id));
    if (this.existFile(file)) return file;
    const allDocs = await this.enumerate();
    return (
      allDocs.find((document) => {
        const alternativeId = this.basename(document);
        const text = this.openFile(document);
        const result = parseMdx(text).frontMatter;
        return result.id === id || id === alternativeId;
      }) ?? null
    );
  }

  private buildDocument(document: string) {
    const text = this.openFile(document);
    const { content, frontMatter } = parseMdx(text);
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
