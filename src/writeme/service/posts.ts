import { Categories, DocumentsJoinCategory, SimplerDocument } from "../storage/storage";
import { Service } from "./service";

class PostsService extends Service {
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
}

export const postsService = new PostsService();
