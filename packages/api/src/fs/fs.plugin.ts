import path from "path";
import fs from "fs";
import { stringify as ymlStringify } from "yaml";
import { promisify } from "util";
import { WritemeApiPlugin } from "../writeme-api.plugin";

const glob = promisify(require("glob"));

export abstract class FsPlugin extends WritemeApiPlugin {
  constructor() {
    super("fs");
  }

  protected root = path.join(path.resolve(process.cwd()), "docs");

  protected postsDirectory = path.join(this.root, "**", "*.mdx");

  protected categoryFile = path.join(this.root, "categories.yml");

  protected filename(basename: string) {
    return `${basename}.mdx`;
  }

  protected writeCategory(yaml: any) {
    return fs.writeFileSync(this.categoryFile, ymlStringify(yaml));
  }

  protected basename(file: string) {
    return path.basename(file).replace(/\.mdx$/, "");
  }

  protected async enumerate(): Promise<string[]> {
    return glob(this.postsDirectory);
  }

  protected existFile(file: string) {
    return fs.existsSync(file);
  }

  protected openFile(file: string) {
    return fs.readFileSync(file, "utf-8");
  }

  protected writeFile(filePath: string, content: string) {
    return fs.writeFileSync(filePath, content, "utf-8");
  }
}