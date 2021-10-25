import {
  CodeResponse,
  Heading,
  MdxDocsProvider,
  Metadata,
  OrderDoc,
  Sidebar,
  SiteContainer,
  Tab,
  TableOfContent,
  Tabs,
} from "components/";
import Fs from "fs/promises";
import matter from "gray-matter";
import { Dates } from "lib/dates";
import { Docs } from "lib/docs";
import { httpClient } from "lib/http-client";
import { remarkTabs } from "lib/remark-tabs";
import { remarkVariables } from "lib/remark-variables";
import { Strings } from "lib/strings";
import { WritemeRc } from "lib/writemerc";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useRouter } from "next/dist/client/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import Path from "path";
import { Fragment } from "react";
import remarkDef from "remark-deflist";
import remarkFootnotes from "remark-footnotes";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";

const CodeHighlight = dynamic(() => import("components/prism"));
const MDXRemote = dynamic(() => import("components/mdx-remote"));
const MdPre = dynamic(() => import("components/md-pre"));
const Playground = dynamic(() => import("components/playground"));
const HttpRequest = dynamic(() => import("components/http-request/http-request"));
const HttpResponse = dynamic(() => import("components/http-response/http-response"));
const Flowchart = dynamic(() => import("components/flowchart"));
const GithubOgp = dynamic(() => import("components/open-graph/github-ogp"));
const YoutubeOgp = dynamic(() => import("components/open-graph/youtube-ogp"));

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await Docs.getAllDocs();
  return {
    fallback: false,
    paths: await Promise.all(docs.map(async (file) => ({ params: { name: Docs.parseFile(file).split("/") } }))),
  };
};

export const getStaticProps: GetStaticProps = async (props) => {
  const queryPath = props.params?.name;
  const path = Array.isArray(queryPath) ? Strings.concatUrl(queryPath.join("/")) : queryPath;
  const doc = Path.resolve(process.cwd(), ...Docs.path, `${path}.mdx`);
  const writemeConfig = await WritemeRc();

  try {
    const fileContent = await Fs.readFile(doc, "utf-8");
    const { content, data } = matter(fileContent);
    const stat = await Fs.stat(doc);
    const scope = { ...data, ...writemeConfig?.requestVariables, ...writemeConfig };
    const source = await serialize(content, {
      scope,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          remarkVariables(scope),
          remarkTabs,
          remarkGemoji,
          remarkDef,
          remarkFootnotes,
          [remarkGithub, { repository: data.repository ?? "" }],
        ],
      },
    });
    const docs = await Docs.getAllMetadataDocs();
    const currentGroup = docs.find((x) => x.sidebar === data.sidebar) ?? null;
    const order = data.order - 1;
    const next = currentGroup?.items[order + 1] ?? null;
    const prev = currentGroup?.items[order - 1] ?? null;

    return {
      revalidate: false,
      props: {
        source,
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

const defaultComponents = {
  h1: (props: any) => <Heading {...props} tag="h2" size="text-3xl" />,
  h2: (props: any) => <Heading {...props} tag="h2" size="text-3xl" />,
  h3: (props: any) => <Heading {...props} tag="h3" size="text-2xl" />,
  h4: (props: any) => <Heading {...props} tag="h4" size="text-xl" />,
  h5: (props: any) => <Heading {...props} tag="h5" size="text-lg" />,
  h6: (props: any) => <Heading {...props} tag="h6" size="text-base" />,
  pre: MdPre,
  CodeHighlight,
  CodeResponse,
  Flowchart,
  HttpRequest,
  HttpResponse,
  Tab,
  TableOfContent,
  Tabs,
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

const components = {
  ...defaultComponents,
  GithubOgp,
  YoutubeOgp,
};

type Props = {
  data: Metadata;
  docs: Docs.DocMetadata;
  notFound?: boolean;
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
};

const providerValue = { theme: "light", titlePrefix: "WriteMe" };

export default function Component({ source, data, notFound, docs }: Props) {
  const { asPath } = useRouter();
  const hasPrev = data.prev !== null;
  const hasNext = data.next !== null;

  return (
    <SiteContainer tag="section">
      <Head>
        <title>
          {providerValue.titlePrefix} | {data.section} {data.title}
        </title>
      </Head>
      <main className="lg:px-0 px-4 flex flex-row align-baseline justify-between gap-x-6">
        <Sidebar
          active={asPath}
          className="hidden md:block markdown-side-item border-r border-border-neutral md:w-48 max-w-xs mt-4"
          items={docs}
        />
        <section className="w-full flex-auto flex-grow-0 pl-4">
          <article className="markdown">
            {(notFound && <h1>Not found</h1>) || (
              <Fragment>
                <header className="my-4">
                  <h1 className="text-5xl leading-tight lining-nums font-extrabold text-text-title">{data.title}</h1>
                  <h4 className="text-base text-text-paragraph mb-2">{data.description}</h4>
                  <h2 className="text-sm text-text-text-normal">
                    {Dates.localeDate(data.createdAt)} - Reading time: {data.readingTime}min
                  </h2>
                </header>
                <MdxDocsProvider value={providerValue}>
                  <section className="flex flex-col flex-wrap" id="document-root">
                    <MDXRemote {...source} components={components} />
                  </section>
                </MdxDocsProvider>
              </Fragment>
            )}
          </article>
          <div
            className={`flex my-4 gap-x-4 ${
              hasPrev && hasNext ? "justify-between" : hasNext ? "justify-end" : "justify-start"
            }`}
          >
            {hasPrev && <OrderDoc {...data.prev!} direction="prev" />}
            {hasNext && <OrderDoc {...data.next!} direction="next" />}
          </div>
        </section>
        <aside className="markdown-side-item md:w-48 text-sm text-text-text-normal mt-4 md:block hidden">
          <span className="font-bold">In this Page:</span>
          <TableOfContent className="table-of-content-target" observeHash markHighlight />
        </aside>
      </main>
    </SiteContainer>
  );
}
