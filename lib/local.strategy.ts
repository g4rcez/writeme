import { readFileSync } from "fs";
import Fs from "fs/promises";
import Path from "path";
import { promisify } from "util";
import { Strategy } from "./strategy";

export namespace LocalStrategy {
  const Glob = promisify(require("glob"));

  export const PATH = ["pages", "docs"];

  export const parseFile = (name: string) => name.replace("pages/docs/", "").replace(/\.mdx?$/gi, "");

  export const docFromExt = (ext: string) => Path.join(...PATH, "**", `*${ext}`);

  export const getAll = async (): Promise<Strategy.MetaGroups[]> => {
    const filesMd: string[] = await Glob(docFromExt(".md"));
    const filesMdx: string[] = await Glob(docFromExt(".mdx"));

    return [...filesMd, ...filesMdx].map((path) => ({ path, content: readFileSync(path, "utf-8") }));
  };

  export const actions: Strategy.Document = {
    groups: () => Strategy.metadataGroups(getAll, parseFile),
    fileInfo: async (path: string) => {
      const fullPath = Path.resolve(process.cwd(), ...PATH, `${path}.mdx`);
      const content = await Fs.readFile(fullPath, "utf-8");
      const stats = await Fs.stat(fullPath);
      return {
        content,
        updatedAt: stats.mtime,
        createdAt: stats.birthtime,
      };
    },
    paths: async () => {
      const docs = await getAll();
      return docs.map((file) => parseFile(file.path).split("/"));
    },
  };
}
