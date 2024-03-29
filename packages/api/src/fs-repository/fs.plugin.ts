import path from "path";
import fs from "fs";
import { stringify as ymlStringify } from "yaml";
import { promisify } from "util";
import { WritemeApiPlugin } from "../writeme-api.plugin";

const glob = promisify(require("glob"));

export abstract class FsPlugin extends WritemeApiPlugin {
  protected readonly root: string;
  protected readonly postsDirectory: string;
  protected readonly categoryFile: string;
  protected readonly authorsFile: string;

  constructor(dir: string) {
    super("fs");
    this.root = path.resolve(dir);
    this.postsDirectory = path.join(this.root, "**", "*.mdx");
    this.categoryFile = path.join(this.root, "categories.yml");
    this.authorsFile = path.join(this.root, "authors.yml");
  }

  protected filename(basename: string) {
    return `${basename}.mdx`;
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
