import React from "react";
import dynamic from "next/dynamic";
import { Tab, Tabs } from "./tabs";
import { CodeResponse } from "./codes/http-response/code-response";
import { TableOfContent } from "./table-of-content";
import { MDXRemote } from "next-mdx-remote";
import { httpClient, Strings, Types } from "@writeme/core";
import { Heading } from "@writeme/lego";

type MDXRemoteProps = Types.Hide<NonNullable<Parameters<typeof MDXRemote>[0]>, "components">;

const CodeHighlight = dynamic(() => import("./codes/prism"));
const HttpRequest = dynamic(() => import("./codes/http-request/http-request"));
const HttpResponse = dynamic(() => import("./codes/http-response/http-response"));
const MdPre = dynamic(() => import("./codes/md-pre"));
const Flowchart = dynamic(() => import("./codes/flowchart"));
const GithubOgp = dynamic(() => import("./codes/open-graph/github-ogp"));
const YoutubeOgp = dynamic(() => import("./codes/open-graph/youtube-ogp"));
const Playground = dynamic(() => import("./codes/playground"));

const playgroundScope = {
  axios: httpClient,
  httpClient,
  Tab,
  Tabs,
  HttpRequest,
  CodeResponse,
  CodeHighlight,
  Strings,
};

const InnerTOC = (props: any) => <TableOfContent observeHash {...props} className={`my-6 py-2 border-y border-y-typography/10 text-sm ${props?.className ?? ""}`} />;

const defaultComponents = {
  CodeHighlight,
  CodeResponse,
  Flowchart,
  HttpRequest,
  HttpResponse,
  Playground,
  Tab,
  TableOfContent: InnerTOC,
  Tabs,
  Toc: InnerTOC,
  pre: MdPre,
  Pre: MdPre,
  h1: (props: any) => <Heading {...props} data-heading="true" tag="h2" data-tag="h1" size="text-3xl" />,
  h2: (props: any) => <Heading {...props} data-heading="true" tag="h2" data-tag="h2" size="text-3xl" />,
  h3: (props: any) => <Heading {...props} data-heading="true" tag="h3" data-tag="h3" size="text-2xl" />,
  h4: (props: any) => <Heading {...props} data-heading="true" tag="h4" data-tag="h4" size="text-xl" />,
  h5: (props: any) => <Heading {...props} data-heading="true" tag="h5" data-tag="h5" size="text-lg" />,
  h6: (props: any) => <Heading {...props} data-heading="true" tag="h6" data-tag="h6" size="text-base" />,
  ol: (props: any) => <ol {...props} className={props.className ?? "mb-4 ml-8 mt-2 list-inside list-decimal"} />,
  ul: (props: any) => <ul {...props} className={props.className ?? "mb-4 ml-8 mt-2 list-inside list-disc"} />,
  input: (props: any) => {
    if (props.type === "checkbox") {
      return <input {...props} className={`form-checkbox rounded ${props.className ?? ""}`} />;
    }
    return <input {...props} />;
  },
};

export const MarkdownJsxComponents = { ...defaultComponents, GithubOgp, YoutubeOgp } as any;

export const MarkdownJsx = (source: MDXRemoteProps) => (
  <MDXRemote {...source} scope={{ ...(source.scope as any), ...playgroundScope }} components={MarkdownJsxComponents} />
);
