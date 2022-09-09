import {
  CodeResponse,
  DocumentStats,
  Heading,
  MdxDocsProvider,
  OrderDoc,
  Sidebar,
  SiteContainer,
  Tab,
  TableOfContent,
  Tabs,
} from "components/";
import { Dates } from "lib/dates";
import { httpClient } from "lib/http-client";
import { Strategy } from "lib/strategy";
import { Writeme } from "lib/writeme";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { useRouter } from "next/dist/client/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Fragment } from "react";

const CodeHighlight = dynamic(() => import("components/prism"));
const MDXRemote = dynamic(() => import("components/mdx-remote"));
const MdPre = dynamic(() => import("components/md-pre"));
const Playground = dynamic(() => import("components/playground"));
const HttpRequest = dynamic(() => import("components/http-request/http-request"));
const HttpResponse = dynamic(() => import("components/http-response/http-response"));
const Flowchart = dynamic(() => import("components/flowchart"));
const GithubOgp = dynamic(() => import("components/open-graph/github-ogp"));
const YoutubeOgp = dynamic(() => import("components/open-graph/youtube-ogp"));

const strategy = Writeme.defaultStrategy;

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await strategy.paths();
  return {
    fallback: false,
    paths: docs.map((name) => ({ params: { name } })),
  };
};

export const getStaticProps: GetStaticProps = async (props) => {
  const queryPath = props.params?.name;
  try {
    const staticProps = await Writeme.getStaticProps(queryPath!, strategy);
    return { props: staticProps, revalidate: false };
  } catch (error) {
    console.log(error);
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
  ul: (props: any) => <ul {...props} className={props.className ?? "mt-2 mb-4 list-inside ml-8 list-disc"} />,
  ol: (props: any) => <ol {...props} className={props.className ?? "mt-2 mb-4 list-inside ml-8 list-decimal"} />,
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
  notFound?: boolean;
  data: DocumentStats;
  docs: Strategy.DocumentItem[];
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
      <div className="lg:px-0 px-4 flex flex-row align-baseline justify-between gap-x-6">
        <Sidebar
          items={docs}
          active={asPath}
          className="hidden md:block markdown-side-item border-r border-border-neutral md:min-w-[12rem] w-48 max-w-[12rem] mt-4"
        />
        <section className="w-full flex-auto flex-grow-0 pl-4">
          <main className="markdown">
            {(notFound && <h1>Not found</h1>) || (
              <Fragment>
                <header className="my-4">
                  <h1 className="text-5xl leading-tight lining-nums font-extrabold text-text-title">{data.title}</h1>
                  <p className="text-base text-text-paragraph mb-2">{data.description}</p>
                  <p className="text-sm text-text-text-normal">
                    <time dateTime={Dates.localeDate(data.createdAt)}>{Dates.localeDate(data.createdAt)}</time>- Reading
                    time: {data.readingTime}min
                  </p>
                </header>
                <MdxDocsProvider value={providerValue}>
                  <section className="flex flex-col flex-wrap max-w-none" id="document-root">
                    <MDXRemote {...source} components={components as never} />
                  </section>
                </MdxDocsProvider>
              </Fragment>
            )}
          </main>
          <div
            className={`flex my-4 gap-x-4 ${
              hasPrev && hasNext ? "justify-between" : hasNext ? "justify-end" : "justify-start"
            }`}
          >
            {hasPrev && <OrderDoc {...data.prev!} direction="prev" />}
            {hasNext && <OrderDoc {...data.next!} direction="next" />}
          </div>
        </section>
        <aside className="markdown-side-item text-sm text-text-text-normal mt-4 md:block hidden md:min-w-[12rem] w-48 max-w-[12rem]">
          <TableOfContent className="table-of-content-target" observeHash markHighlight>
            <span className="font-bold">In this Page:</span>
          </TableOfContent>
        </aside>
      </div>
    </SiteContainer>
  );
}
