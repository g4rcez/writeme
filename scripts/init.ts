import { promisify } from "util";
import Path from "path";
import { rmSync } from "fs";
const glob = promisify(require("glob"));

const mdPath = Path.resolve(process.cwd(), "pages", "docs", "**", "*.md");
const mdxPath = Path.resolve(process.cwd(), "pages", "docs", "**", "*.mdx");

const blogMdPath = Path.resolve(process.cwd(), "pages", "blog", "**", "*.md");
const blogMdxPath = Path.resolve(process.cwd(), "pages", "blog", "**", "*.mdx");

(async () => {
  const markdownFiles = await Promise.all([glob(mdPath), glob(mdxPath), glob(blogMdPath), glob(blogMdxPath)]);
  markdownFiles.flat(1).map((x) => rmSync(x, { force: true, recursive: true }));
})();
