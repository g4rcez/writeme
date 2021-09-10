import { HttpRequest } from "components/http-request/http-request";
import { CodeResponse } from "components/http-response/code-response";
import { HttpResponse } from "components/http-response/http-response";
import { HttpContext } from "components/http.context";
import { MdPre } from "components/md-pre";
import { MdxDocsProvider } from "components/mdx-docs.context";
import { Playground } from "components/playground";
import { CodeHighlight } from "components/prism";
import { TableOfContent } from "components/table-of-content";
import Fs from "fs/promises";
import GlobCallback from "glob";
import matter from "gray-matter";
import { Dates } from "lib/dates";
import { httpClient } from "lib/http-client";
import { remarkTabs } from "lib/remark-tabs";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import Path from "path";
import { createElement, Fragment, useRef } from "react";
//@ts-ignore
import admonitions from "remark-admonitions";
import remarkDef from "remark-deflist";
import remarkFootnotes from "remark-footnotes";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import { promisify } from "util";
import { Tab, Tabs } from "../../components/tabs";

const Glob = promisify(GlobCallback);

const docFromExt = (ext: string) => Path.join("pages", "docs", "**", `*${ext}`);

const getAllDocs = async (): Promise<string[]> => {
  const filesMd = await Glob(docFromExt(".md"));
  const filesMdx = await Glob(docFromExt(".mdx"));
  return [...filesMd, ...filesMdx];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await getAllDocs();
  return {
    fallback: "blocking",
    paths: docs.map((file) => ({
      params: { name: Path.basename(file).replace(/.mdx?/, "") },
    })),
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

export const getStaticProps: GetStaticProps = async (props) => {
  const path = props.params?.name ?? "example";
  const doc = Path.resolve(process.cwd(), "pages", "docs", `${path}.mdx`);
  try {
    const source = await Fs.readFile(doc, "utf-8");
    const { content, data } = matter(source);
    const remarkPlugins: any[] = [
      remarkTabs,
      admonitions,
      remarkGemoji,
      remarkGfm,
      remarkDef,
      remarkFootnotes,
      [remarkGithub, { repository: data.repository ?? "" }],
    ];
    const stat = await Fs.stat(doc);
    const mdxSource = await serialize(content, { scope: data, mdxOptions: { remarkPlugins } });
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

const Heading = (props: any) =>
  createElement(
    props.tag,
    {
      ...props,
      className: `mt-1 tabular-nums antialiased tracking-wide font-bold text-gray-500 leading-relaxed ${
        props.className ?? ""
      } ${props.size}`,
    },
    props.children
  );

const playgroundScope = {
  axios: httpClient,
  Tab,
  Tabs,
  HttpRequest,
  CodeResponse,
  CodeHighlight,
};

const components = {
  h1: (props: any) => <Heading {...props} tag="h2" size="text-3xl" />,
  h2: (props: any) => <Heading {...props} tag="h2" size="text-3xl" />,
  h3: (props: any) => <Heading {...props} tag="h3" size="text-2xl" />,
  h4: (props: any) => <Heading {...props} tag="h4" size="text-xl" />,
  h5: (props: any) => <Heading {...props} tag="h5" size="text-lg" />,
  h6: (props: any) => <Heading {...props} tag="h6" size="text-base" />,
  pre: MdPre,
  HttpRequest,
  CodeResponse,
  Tab,
  TableOfContent,
  CodeHighlight,
  Tabs,
  HttpResponse,
  ul: (props: any) => <ul {...props} className={props.className ?? "mt-2 mb-4"} />,
  Playground: function Component(props: any) {
    return <Playground {...props} scope={playgroundScope} />;
  },
  input: (props: any) => {
    if (props.type === "checkbox") {
      return <input {...props} className={`form-checkbox rounded ${props.className ?? ""}`} />;
    }
    return <input {...props} />;
  },
};

type Props = {
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
  data: Metadata;
  notFound?: boolean;
};

const providerValue = { theme: "light", titlePrefix: "WriteMe" };

export default function Home({ source, data, notFound }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  if (notFound) {
    return <h1>Not found</h1>;
  }

  return (
    <Fragment>
      <Head>
        <title>
          {providerValue.titlePrefix} | {data.project} {data.title}
        </title>
      </Head>
      <main className="w-full container mx-auto markdown">
        <header className="mb-4">
          <h1 className="text-5xl leading-tight lining-nums tracking-wide font-extrabold text-gray-600">
            {data.title}
          </h1>
          <h2 className="text-sm text-gray-500">
            {Dates.localeDate(data.createdAt)} - Reading time: {data.readingTime}min
          </h2>
        </header>
        <HttpContext>
          <MdxDocsProvider value={providerValue}>
            <section className="flex flex-col flex-wrap" id="document-root" ref={ref}>
              <MDXRemote {...source} components={components} />
            </section>
          </MdxDocsProvider>
        </HttpContext>
      </main>
    </Fragment>
  );
}
