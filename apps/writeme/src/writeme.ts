import { CategoriesService, DocumentsService, FsCategory, FsDocument, WritemePages } from "@writeme/api";
import path from "path";

const rootDir = path.join(process.cwd(), "docs");

export const writeme = new WritemePages({
  categoryService: new CategoriesService(new FsCategory(rootDir)),
  documentsService: new DocumentsService(new FsDocument(rootDir)),
});
