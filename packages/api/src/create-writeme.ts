import { IDocument } from "./interfaces/idocument";
import { ICategory } from "./interfaces/icategory";
import { CategoriesService } from "./service/categories";
import { DocumentsService } from "./service/documents";

export const createWriteme = (document: IDocument, category: ICategory) => {
  return {
    category: new CategoriesService(category),
    document: new DocumentsService(document),
  };
};
