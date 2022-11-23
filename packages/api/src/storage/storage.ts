import { Types } from "@writeme/core";

export type FrontMatterValues = boolean | number | string | Date | FrontMatterValues[];

type ID = string;

export type Tag = {
  id: ID;
  title: string;
  url: string;
};

export type Categories = {
  id: ID;
  url: string;
  title: string;
  index: number;
  icon?: string;
  banner?: string;
  description: string;
};

type AuthorReferences = {
  name: string;
  url: string;
  image: string;
};

export type Author = {
  id: ID;
  name: string;
  email: string;
  nickname: string;
  links: AuthorReferences[];
};

export type FrontMatter = Record<string, FrontMatterValues>;

export type SimplerCategory = Types.Hide<Categories, "description">;

export type MarkdownDocument = {
  id: string;
  url: string;
  title: string;
  index: number;
  content: string;
  category: string;
  createdAt: string;
  description: string;
  tags: Tag[];
  authors: Author[];
};

export type MarkdownDocumentRaw = {
  id?: string;
  tags: ID[];
  authors: ID[];
  category: ID;
  url: string;
  title: string;
  index: number;
  content: string;
  createdAt: string;
  description: string;
};

export type SimplerDocument = Types.Only<MarkdownDocument, "url" | "title" | "category" | "index">;

export type VitrineDocument = Types.Hide<MarkdownDocument, "content">;

export type DocumentsJoinCategory = {
  category: Categories;
  documents: SimplerDocument[];
};

export interface IStorage {
  sorted: boolean;

  getAllDocumentPaths(): Promise<string[]>;

  getSimplerDocuments(): Promise<SimplerDocument[]>;

  getDocumentByName(name: string): Promise<MarkdownDocument | null>;

  getCategories(): Promise<Categories[]>;

  saveCategory(category: Categories): Promise<void>;

  updateCategory(category: Categories): Promise<void>;

  getCategory(id: string): Promise<Categories | null>;

  deleteCategory(id: string): Promise<boolean>;

  saveDocument(document: MarkdownDocument): Promise<void>;

  getAllDocuments(): Promise<VitrineDocument[]>;

  getDocumentById(id: string): Promise<MarkdownDocument | null>;

  updateDocumentById(document: MarkdownDocument, id: string): Promise<MarkdownDocument | null>;
}
