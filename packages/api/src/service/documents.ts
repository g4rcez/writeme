import { IService } from "../interfaces/iservice";
import { z } from "zod";
import { Either, Strings, Validator } from "@writeme/core";
import { Domain } from "../domain";
import { DocumentsRepository } from "../interfaces/documents-repository";

export class DocumentsService implements IService<DocumentsRepository, Domain.MarkdownDocumentRaw> {
  private saveSchema = z.object({
    category: z.string(),
    content: z.string(),
    description: z.string(),
    title: z.string().min(1),
    url: Validator.urlFriendly.max(256),
    index: z.number().min(1).default(1),
    createdAt: Validator.date.optional().default(new Date()),
    tags: z.array(z.unknown()).length(0).optional().default([]),
    authors: z.array(z.unknown()).length(0).optional().default([]),
  });

  public editSchema = this.saveSchema.extend({ id: z.string().uuid().or(z.string()) });

  public constructor(public repository: DocumentsRepository) {}

  public async save(item: Domain.Document) {
    return this.repository.save(item);
  }

  public async validate(
    item: Domain.MarkdownDocumentRaw,
    schema: typeof this.editSchema | typeof this.saveSchema = this.saveSchema
  ) {
    const result = await Validator.validate(schema, item);
    if (result.success) {
      const data = result.success;
      return Either.success({
        authors: [],
        tags: [],
        id: item.id ?? Strings.uuid(),
        index: data.index,
        title: data.title,
        url: data.url,
        description: data.description,
        category: data.category,
        content: data.content,
        createdAt: data.createdAt.toISOString(),
      });
    }
    return Either.error(result.error);
  }

  public async delete(uuid: string) {
    return Either.success(null);
  }

  public aggregate(categories: Domain.Category[], documents: Domain.DocumentDesc[]): Domain.CategoryDocuments[] {
    const map = new Map<string, Domain.DocumentDesc[]>(categories.map((x) => [x.id, []]));
    documents.forEach((doc) => {
      const category = map.get(doc.category);
      if (category === undefined) return;
      category.push(doc);
    });
    return categories.reduce<Domain.CategoryDocuments[]>((acc, category) => {
      const documents = map.get(category.id) ?? [];
      if (documents.length === 0) return acc;
      acc.push({ category, documents });
      return acc;
    }, []);
  }

  public getAdjacentPosts(post: Domain.DocumentDesc, groups: Domain.CategoryDocuments[]) {
    const groupIndex = groups.findIndex((x) => x.category.id === post.category);
    const group = groups[groupIndex];
    const current = group?.documents.findIndex((x) => x.url === post.url) ?? -1;
    const previousGroup = groups[groupIndex - 1];
    const lastOfPreviousGroup = previousGroup?.documents[previousGroup?.documents.length - 1];
    const previous = group?.documents[current - 1] ?? lastOfPreviousGroup ?? null;
    const firstOfNextGroup = groups[groupIndex + 1]?.documents[0];
    const next = group?.documents[current + 1] ?? firstOfNextGroup ?? null;
    return { previous, next };
  }

  public async getAllPaths() {
    return this.repository.getAllPaths();
  }

  public async getAll() {
    return this.repository.getAll();
  }

  public async update(item: Domain.Document) {
    try {
      const result = await this.repository.update(item);
      if (result === null) return Either.error(["Not found this document"]);
      return Either.success(item);
    } catch (e) {
      return Either.error([]);
    }
  }

  public getById(id: string): Promise<Domain.Document | null> {
    return this.repository.getById(id);
  }
}
