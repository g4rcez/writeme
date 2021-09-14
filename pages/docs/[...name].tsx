import {
  CodeHighlight,
  CodeResponse,
  Heading,
  HttpContext,
  HttpRequest,
  HttpResponse,
  MdPre,
  MdxDocsProvider,
  Playground,
  Sidebar,
  Tab,
  TableOfContent,
  Tabs,
} from "components/";
import { Container } from "components/container";
import { Metadata, OrderDoc } from "components/order-doc";
import Fs from "fs/promises";
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

const Glob = promisify(require("glob"));

type Docs = Record<string, Metadata[]>;

const router = {
  path: ["pages", "docs"],
  fromFile: (name: string) => name.replace("pages/docs/", "").replace(/\.mdx?$/gi, ""),
} as const;

const docFromExt = (ext: string) => Path.join(...router.path, "**", `*${ext}`);

const getAllDocs = async (): Promise<string[]> => {
  const filesMd = await Glob(docFromExt(".md"));
  const filesMdx = await Glob(docFromExt(".mdx"));
  return [...filesMd, ...filesMdx];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await getAllDocs();
  return {
    fallback: "blocking",
    paths: await Promise.all(docs.map(async (file) => ({ params: { name: router.fromFile(file).split("/") } }))),
  };
};

const sidebarOrder = (items: Metadata[]) =>
  Math.max(...items.map((x) => x.sidebar).filter((x) => !Number.isNaN(x) && typeof x === "number"));

const getAllDocsWithMetadata = async () => {
  const docs = await getAllDocs();
  const metadata = await Promise.all(
    docs.map(
      async (x): Promise<Metadata> =>
        ({
          ...matter(await Fs.readFile(x, "utf-8")).data,
          link: Strings.concatUrl("/docs", router.fromFile(x)),
        } as never)
    )
  );
  const groups = metadata.reduce<Docs>((acc, doc) => {
    const key = doc.project;
    const current = acc[key];
    return { ...acc, [key]: Array.isArray(current) ? [...current, doc] : [doc] };
  }, {});
  return Object.keys(groups)
    .map((group) => {
      const items = groups[group];
      return {
        name: group,
        sidebar: sidebarOrder(items),
        items: items.sort((a, b) => a.order - b.order),
      };
    })
    .sort((a, b) => a.sidebar - b.sidebar);
};

export const getStaticProps: GetStaticProps = async (props) => {
  const queryPath = props.params?.name;
  const path = Array.isArray(queryPath) ? Strings.concatUrl(queryPath.join("/")) : queryPath;
  const doc = Path.resolve(process.cwd(), ...router.path, `${path}.mdx`);
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
    const docs = await getAllDocsWithMetadata();
    const currentGroup = docs.find((x) => x.sidebar === data.sidebar) ?? null;
    const order = data.order - 1;
    const next = currentGroup?.items[order + 1] ?? null;
    const prev = currentGroup?.items[order - 1] ?? null;

    console.log({ order, next, prev, currentGroup, sidebar: data.sidebar, docs });
    return {
      revalidate: process.env.NODE_ENV === "development" ? 1 : undefined,
      props: {
        source: mdxSource,
        docs,
        data: {
          ...data,
          next,
          prev,
          updatedAt: stat.mtime.toISOString(),
          createdAt: stat.birthtime.toISOString(),
          readingTime: Math.ceil(content.split(" ").length / 250),
        },
      },
    };
  } catch (error) {
    console.error(error);
    if (process.env.NODE_ENV === "development") throw error;
    return { notFound: true };
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

  return (
    <Fragment>
      <Head>
        <title>
          {providerValue.titlePrefix} | {data.project} {data.title}
        </title>
      </Head>
      <Sidebar ref={sidebar} className="fixed top-16 left-0 w-56 ml-6" items={docs} />
      <Container className="top-16 mx-auto markdown absolute left-56 px-20" ref={main}>
        {(notFound && <h1>Not found</h1>) || (
          <Fragment>
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
          </Fragment>
        )}
        <div className="flex w-full justify-between my-4">
          {data.prev !== null && <OrderDoc {...data.prev} direction="prev" />}
          {data.next !== null && <OrderDoc {...data.next} direction="next" />}
        </div>
      </Container>
    </Fragment>
  );
}
