import React from "react";
import dynamic from "next/dynamic";
import { httpClient } from "../lib/http-client";
import { Tab, Tabs } from "./tabs";
import { CodeResponse } from "./http-response/code-response";
import { Heading } from "./text";
import { TableOfContent } from "./table-of-content";
import { MDXRemote } from "next-mdx-remote";
import { Erase } from "../lib/types";

type MDXRemoteProps = Erase<NonNullable<Parameters<typeof MDXRemote>[0]>, "components">;

const CodeHighlight = dynamic(() => import("./prism"));
const HttpRequest = dynamic(() => import("./http-request/http-request"));
const HttpResponse = dynamic(() => import("./http-response/http-response"));
const MdPre = dynamic(() => import("./md-pre"));
const Flowchart = dynamic(() => import("./flowchart"));
const Playground = dynamic(() => import("./playground"));
const GithubOgp = dynamic(() => import("./open-graph/github-ogp"));
const YoutubeOgp = dynamic(() => import("./open-graph/youtube-ogp"));

const playgroundScope = {
  axios: httpClient,
  Tab,
  Tabs,
  HttpRequest,
  CodeResponse,
  CodeHighlight,
};

const defaultComponents = {
  h1: (props: any) => <Heading {...props} data-heading="true" tag="h2" data-tag="h1" size="text-3xl" />,
  h2: (props: any) => <Heading {...props} data-heading="true" tag="h2" data-tag="h2" size="text-3xl" />,
  h3: (props: any) => <Heading {...props} data-heading="true" tag="h3" data-tag="h3" size="text-2xl" />,
  h4: (props: any) => <Heading {...props} data-heading="true" tag="h4" data-tag="h4" size="text-xl" />,
  h5: (props: any) => <Heading {...props} data-heading="true" tag="h5" data-tag="h5" size="text-lg" />,
  h6: (props: any) => <Heading {...props} data-heading="true" tag="h6" data-tag="h6" size="text-base" />,
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

export const MarkdownJsxComponents: any = {
  ...defaultComponents,
  GithubOgp,
  YoutubeOgp,
};

export const MarkdownJsx = (source: MDXRemoteProps) => <MDXRemote {...source} components={MarkdownJsxComponents} />;
