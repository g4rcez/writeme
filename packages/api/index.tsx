export { storage } from "./src/storage/main.storage";
export { FsStorage } from "./src/storage/fs.storage";
export { Service } from "./src/service/service";
export type { IRepository } from "./src/service/irepository";
export { postsService } from "./src/service/documents";
export { categoriesService } from "./src/service/categories";
export type {
  MarkdownDocument,
  SimplerDocument,
  VitrineDocument,
  MarkdownDocumentRaw,
  Author,
  DocumentsJoinCategory,
  Categories,
  Tag,
  SimplerCategory,
  FrontMatter,
  FrontMatterValues,
  IStorage,
} from "./src/storage/storage";
export { Http } from "./src/http";
