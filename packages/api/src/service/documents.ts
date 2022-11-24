import {
  Categories,
  DocumentsJoinCategory,
  MarkdownDocument,
  MarkdownDocumentRaw,
  SimplerDocument,
  VitrineDocument,
} from "../interfaces/interfaces";
import { Service } from "./service";
import { IRepository } from "./irepository";
import { z } from "zod";
import { Validator, Strings, Either } from "@writeme/core";

class PostsService extends Service implements IRepository<MarkdownDocument, MarkdownDocumentRaw, VitrineDocument> {
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

  public editSchema = this.saveSchema.extend({
    id: z.string().uuid().or(z.string()),
  });

  public async save(item: MarkdownDocument): Promise<MarkdownDocument> {
    await this.storage.saveDocument(item);
    return item;
  }

  public async validate(
    item: MarkdownDocumentRaw,
    schema: typeof this.editSchema | typeof this.saveSchema = this.saveSchema
  ): Promise<Either.Error<string[]> | Either.Success<MarkdownDocument>> {
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

  delete(uuid: string): Promise<Either.Error<string[]> | Either.Success<null>> {
    throw new Error("Method not implemented.");
  }

  aggregateDocumentToCategory = (categories: Categories[], documents: SimplerDocument[]): DocumentsJoinCategory[] => {
    const map = new Map<string, SimplerDocument[]>(categories.map((x) => [x.id, []]));
    const sortDocuments = this.storage.sorted ? documents : documents.sort((a, b) => a.index - b.index);
    sortDocuments.forEach((doc) => {
      const category = map.get(doc.category);
      if (category === undefined) return;
      category.push(doc);
    });
    return categories.reduce<DocumentsJoinCategory[]>((acc, category) => {
      const documents = map.get(category.id) ?? [];
      if (documents.length === 0) return acc;
      acc.push({ category, documents });
      return acc;
    }, []);
  };

  getAdjacentPosts = (post: SimplerDocument, groups: DocumentsJoinCategory[]) => {
    const groupIndex = groups.findIndex((x) => x.category.id === post.category);
    const group = groups[groupIndex];
    const current = group?.documents.findIndex((x) => x.url === post.url) ?? -1;
    const previousGroup = groups[groupIndex - 1];
    const lastOfPreviousGroup = previousGroup?.documents[previousGroup?.documents.length - 1];
    const previous = group?.documents[current - 1] ?? lastOfPreviousGroup ?? null;
    const firstOfNextGroup = groups[groupIndex + 1]?.documents[0];
    const next = group?.documents[current + 1] ?? firstOfNextGroup ?? null;
    return { previous, next };
  };

  public async getAll(): Promise<VitrineDocument[]> {
    return this.storage.getAllDocuments();
  }

  public async findById(id: string): Promise<MarkdownDocument | null> {
    return this.storage.getDocumentById(id);
  }

  public async update(
    item: MarkdownDocument,
    uuid: string
  ): Promise<Either.Error<string[]> | Either.Success<MarkdownDocument>> {
    try {
      const result = await this.storage.updateDocumentById(item, uuid);
      if (result === null) return Either.error(["Not found this document"]);
      return Either.success(item);
    } catch (e) {
      return Either.error([]);
    }
  }
}

export const postsService = new PostsService();
