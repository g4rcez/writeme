import { WritemePages, FsCategory, FsDocument } from "@writeme/api";
import path from "path";

const rootDir = path.join(process.cwd(), "docs");
export const writeme = new WritemePages(new FsDocument(rootDir), new FsCategory(rootDir));
