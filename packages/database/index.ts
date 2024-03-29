export type { IService } from "./src/interfaces/iservice";
export { Http } from "./src/http";
export { WritemePages } from "./src/writeme-pages";
export { Document as FsDocument } from "./src/fs-repository/documents.repository";
export { Category as FsCategory } from "./src/fs-repository/categories.repository";
export { DocumentsService } from "./src/service/documents";
export { CategoriesService } from "./src/service/categories";
export type { Domain } from "./src/domain";
export { proxy } from "./src/proxy";
export { documentsWithIdEndpoint } from "./src/api/documents-with-id-endpoint";
export { documentsRootEndpoint } from "./src/api/documents-root-endpoint";
export { categoriesWithIdEndpoint } from "./src/api/categories-with-id-endpoint";
export { categoriesRootEndpoint } from "./src/api/categories-root-endpoint";
