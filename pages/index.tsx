import { HttpRequest } from "components/http-request/http-request";
import { HttpResponse } from "components/http-response/http-response";
import Fs from "fs";
import matter from "gray-matter";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Path from "path";

type Metadata = {
  title: string;
  project: string;
  repository: string;
  author: string;
  tags: string[];
  issues: string[];
};

export async function getStaticProps() {
  const doc = Path.resolve(process.cwd(), "pages", "docs", "example.mdx");
  const source = Fs.readFileSync(doc, "utf-8");
  const { content, data } = matter(source);
  const mdxSource = await serialize(content, { scope: data });
  return { props: { source: mdxSource, data } };
}

const components = {
  HttpRequest,
  HttpResponse,
};

type Props = {
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
  data: Metadata;
};

export default function Home({ source, data }: Props) {
  return (
    <main className="w-full container mx-auto markdown">
      <h1 className="text-5xl leading-relaxed lining-nums tracking-wide font-extrabold text-gray-600">
        {data.title}
      </h1>
      <section className="flex flex-col flex-wrap">
        <MDXRemote {...source} components={components} />
      </section>
    </main>
  );
}
