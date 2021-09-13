import { HttpRequest } from "components/http-request/http-request";
import { CodeResponse } from "components/http-response/code-response";
import { HttpResponse } from "components/http-response/http-response";
import { HttpContext } from "components/http.context";
import { MdPre } from "components/md-pre";
import { MdxDocsProvider } from "components/mdx-docs.context";
import { Playground } from "components/playground";
import { CodeHighlight } from "components/prism";
import { Sidebar } from "components/sidebar";
import { TableOfContent } from "components/table-of-content";
import { Tab, Tabs } from "components/tabs";
import { Heading } from "components/text";
import Fs from "fs/promises";
import GlobCallback from "glob";
import matter from "gray-matter";
import { Dates } from "lib/dates";
import { httpClient } from "lib/http-client";
import { remarkTabs } from "lib/remark-tabs";
import { Strings } from "lib/strings";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import Path from "path";
import { Fragment, useEffect, useRef } from "react";
import remarkDef from "remark-deflist";
import remarkFootnotes from "remark-footnotes";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import { promisify } from "util";

type Metadata = {
  title: string;
  description: string;
  project: string;
  repository: string;
  order: number;
  sidebar: number;
  tags: string[];
  section: string;
  createdAt: string;
  updatedAt: string;
  readingTime: string;
  link: string;
};

type Docs = Record<string, Metadata[]>;

const Glob = promisify(GlobCallback);

const docFromExt = (ext: string) => Path.join("pages", "docs", "**", `*${ext}`);

const getAllDocs = async (): Promise<string[]> => {
  const filesMd = await Glob(docFromExt(".md"));
  const filesMdx = await Glob(docFromExt(".mdx"));
  return [...filesMd, ...filesMdx];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await getAllDocs();
  const paths = await Promise.all(
    docs.map(async (file) => ({ params: { name: file.replace("pages/docs/", "").split("/") } }))
  );
  return { fallback: "blocking", paths };
};

const getAllDocsWithMetadata = async () => {
  const docs = await getAllDocs();
  const metadata = await Promise.all(
    docs.map(
      async (x): Promise<Metadata> =>
        ({
          ...matter(await Fs.readFile(x, "utf-8")).data,
          link: Strings.concatUrl("/docs", x.replace("pages/docs/", "").replace(/\.mdx?$/, "")),
        } as never)
    )
  );
  const groups = metadata.reduce<Docs>((acc, doc) => {
    const key = doc.project;
    const current = acc[key];
    return { ...acc, [key]: Array.isArray(current) ? [...current, doc] : [doc] };
  }, {});
  return Object.keys(groups).map((group) => ({
    name: group,
    items: groups[group].sort((a, b) => a.order - b.order),
    sidebar: Math.max(...groups[group].map((x) => x.sidebar)),
  }));
};

export const getStaticProps: GetStaticProps = async (props) => {
  const queryPath = props.params?.name;
  const path = Array.isArray(queryPath) ? Strings.concatUrl("/", queryPath.join("/")) : queryPath;
  const doc = Path.resolve(process.cwd(), "pages", "docs", `${path}.mdx`);
  try {
    const source = await Fs.readFile(doc, "utf-8");
    const { content, data } = matter(source);
    const remarkPlugins: any[] = [
      remarkTabs,
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
        docs: await getAllDocsWithMetadata(),
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
  docs: any;
  notFound?: boolean;
};

const providerValue = { theme: "light", titlePrefix: "WriteMe" };

export default function Docs({ source, data, notFound, docs }: Props) {
  const sidebar = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => {
      if (sidebar.current === null || main.current === null) return;
      const sidebarWidth = sidebar.current.getBoundingClientRect().width;
      main.current.style.width = `${window.innerWidth - sidebarWidth}px`;
    };
    onResize();
    window.addEventListener("resize", onResize);
  }, []);

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
      <Sidebar ref={sidebar} className="fixed top-16 left-0 w-56" items={docs} />
      <main className="w-auto container top-16 mx-auto markdown absolute left-56 px-8" ref={main}>
        <header className="mb-4">
          <h1 className="text-5xl leading-tight lining-nums font-extrabold text-gray-600">{data.title}</h1>
          <h2 className="text-sm text-gray-500">
            {Dates.localeDate(data.createdAt)} - Reading time: {data.readingTime}min
          </h2>
        </header>
        <HttpContext>
          <MdxDocsProvider value={providerValue}>
            <section className="flex flex-col flex-wrap" id="document-root">
              <MDXRemote {...source} components={components} />
            </section>
          </MdxDocsProvider>
        </HttpContext>
      </main>
    </Fragment>
  );
}
