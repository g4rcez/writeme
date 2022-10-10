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

export interface IStorage {
  sorted: boolean;

  getAllDocumentPaths(): Promise<string[]>;

  getSimplerDocuments(): Promise<SimplerDocument[]>;

  getDocument(name: string): Promise<MarkdownDocument | null>;

  fetchCategories(): Promise<Categories[]>;

  saveCategory(category: Categories): Promise<void>;

  updateCategory(category: Categories): Promise<void>;

  getCategory(id: string): Promise<Categories | null>;

  delete(id: string): Promise<boolean>;
}
