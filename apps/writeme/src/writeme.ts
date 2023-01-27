import {
  AuthorsService,
  CategoriesService,
  DocumentsService,
  FsAuthors,
  FsCategory,
  FsDocument,
  WritemePages,
} from "@writeme/api";
import path from "path";

const rootDir = path.join(process.cwd(), "docs");

export const writeme = new WritemePages({
  services: {
    categories: new CategoriesService(new FsCategory(rootDir)),
    documents: new DocumentsService(new FsDocument(rootDir)),
    authors: new AuthorsService(new FsAuthors(rootDir)),
  },
});
