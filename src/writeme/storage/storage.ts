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

export abstract class Storage {
  public abstract sorted: boolean;

  public abstract getAllDocumentPaths(): Promise<string[]>;

  public abstract getSimplerDocuments(): Promise<SimplerDocument[]>;

  public abstract getDocument(name: string): Promise<MarkdownDocument | null>;

  public abstract fetchCategories(): Promise<Categories[]>;

  public abstract saveCategory(category: Categories): Promise<void>;

  public abstract getCategory(id: string): Promise<Categories | null>;
}
