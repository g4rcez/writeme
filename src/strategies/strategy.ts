export type FrontMatterValues = boolean | number | string | Date | FrontMatterValues[];

export type Tag = {
  id: string;
  title: string;
  url: string;
};

export type Categories = {
  id: string;
  url: string;
  title: string;
  index: number;
  icon?: string;
  banner?: string;
  description: string;
};

export type FrontMatter = Record<string, FrontMatterValues>;

export type MarkdownDocument = {
  url: string;
  tags: Tag[];
  title: string;
  index: number;
  content: string;
  category: string;
  createdAt: string;
  description: string;
  frontMatter: FrontMatter;
};

export type SimplerDocument = Types.Only<MarkdownDocument, "url" | "title" | "category" | "index">;

export type DocumentsJoinCategory = {
  category: Categories;
  documents: SimplerDocument[];
};

export abstract class Strategy {
  public async getCategories(): Promise<Categories[]> {
    const list = await this.fetchCategories();
    return list.sort((a, b) => a.index - b.index);
  }

  public aggregateDocumentToCategory = (
    categories: Categories[],
    documents: SimplerDocument[]
  ): DocumentsJoinCategory[] => {
    const map = new Map<string, SimplerDocument[]>(categories.map((x) => [x.id, []]));
    documents.forEach((doc) => {
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

  public abstract getAllDocumentPaths(): Promise<string[]>;

  public abstract getSimplerDocuments(): Promise<SimplerDocument[]>;

  public abstract getDocument(name: string): Promise<MarkdownDocument | null>;

  protected abstract fetchCategories(): Promise<Categories[]>;
}
