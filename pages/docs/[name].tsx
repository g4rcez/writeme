import axios from "axios";
import { HttpRequest } from "components/http-request/http-request";
import { HttpResponse } from "components/http-response/http-response";
import { MdxDocsProvider } from "components/mdx-docs.context";
import { CodeHighlight } from "components/prism";
import { TableOfContent } from "components/table-of-content";
import Fs from "fs/promises";
import GlobCallback from "glob";
import matter from "gray-matter";
import { Dates } from "lib/dates";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import Path from "path";
import { Fragment, useEffect, useRef, useState } from "react";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import { promisify } from "util";
import { Tab, Tabs } from "../../components/tabs";
//@ts-ignore
import admonitions from "remark-admonitions";
import { Playground } from "components/playground";

const Glob = promisify(GlobCallback);

const docFromExt = (ext: string) => Path.join("pages", "docs", "**", `*${ext}`);

export const getStaticPaths: GetStaticPaths = async () => {
  const filesMd = await Glob(docFromExt(".md"));
  const filesMdx = await Glob(docFromExt(".mdx"));
  return {
    paths: [...filesMd, ...filesMdx].map((file) => ({
      params: { name: Path.basename(file).replace(/.mdx?/, "") },
    })),
    fallback: "blocking",
  };
};

type Metadata = {
  title: string;
  project: string;
  repository: string;
  author: string;
  tags: string[];
  issues: string[];
  updatedAt: string;
  createdAt: string;
  readingTime: number;
};

const remarkPlugins: any[] = [
  admonitions,
  remarkGemoji,
  remarkGfm,
  remarkGithub,
];

export const getStaticProps: GetStaticProps = async (props) => {
  const path = props.params?.name ?? "example";
  const doc = Path.resolve(process.cwd(), "pages", "docs", `${path}.mdx`);
  try {
    const source = await Fs.readFile(doc, "utf-8");
    const { content, data } = matter(source);
    const stat = await Fs.stat(doc);
    const mdxSource = await serialize(content, {
      scope: data,
      mdxOptions: {
        remarkPlugins,
      },
    });
    return {
      props: {
        source: mdxSource,
        data: {
          ...data,
          updatedAt: stat.mtime.toISOString(),
          createdAt: stat.birthtime.toISOString(),
          readingTime: Math.ceil(content.split(" ").length / 250),
        },
      },
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") throw error;
    return { props: { notFound: true } };
  }
};

const Heading = (props: any) => (
  <h2
    {...props}
    className={`my-2 ${
      props.size
    }  tabular-nums antialiased tracking-wide font-bold text-gray-500 leading-relaxed ${
      props.className ?? ""
    }`}
  />
);

const playgroundScope = {
  axios,
  Tab,
  Tabs,
  HttpRequest,
  HttpResponse,
  CodeHighlight,
};

const components = {
  h1: (props: any) => <Heading {...props} size="text-3xl" />,
  h2: (props: any) => <Heading {...props} size="text-3xl" />,
  h3: (props: any) => <Heading {...props} size="text-2xl" />,
  h4: (props: any) => <Heading {...props} size="text-xl" />,
  h5: (props: any) => <Heading {...props} size="text-lg" />,
  h6: (props: any) => <Heading {...props} size="text-base" />,
  ul: (props: any) => <ul {...props} className={props.className ?? "my-4"} />,
  pre: (props: any) => {
    const componentProps = props.children.props;
    const language = /\w+-(\w+)/.exec(componentProps.className)?.[1];
    if (language === undefined)
      return (
        <pre>
          <code>{componentProps.children}</code>
        </pre>
      );
    return <CodeHighlight code={componentProps.children} language={language} />;
  },
  // eslint-disable-next-line react/display-name
  Playground: (props: any) => <Playground {...props} scope={playgroundScope} />,
  HttpRequest,
  HttpResponse,
  Tab,
  TableOfContent,
  Tabs,
};

type Props = {
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
  data: Metadata;
  notFound?: boolean;
};

export default function Home({ source, data, notFound }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current !== null) setRootElement(ref.current);
  }, []);

  if (notFound) {
    return <h1>Not found</h1>;
  }

  return (
    <Fragment>
      <Head>
        <title>{data.title}</title>
      </Head>
      <main className="w-full container mx-auto markdown">
        <header className="mb-4">
          <h1 className="text-5xl leading-tight lining-nums tracking-wide font-extrabold text-gray-600">
            {data.title}
          </h1>
          <h2 className="text-sm text-gray-500">
            {Dates.localeDate(data.createdAt)} - Reading time:{" "}
            {data.readingTime}min
          </h2>
        </header>
        <MdxDocsProvider value={{ root: rootElement, theme: "light" }}>
          <section className="flex flex-col flex-wrap" ref={ref}>
            <MDXRemote {...source} components={components} />
          </section>
        </MdxDocsProvider>
      </main>
    </Fragment>
  );
}
