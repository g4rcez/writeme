import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { Fragment } from "react";
import { SimpleEditor } from "../editor/simple-editor";
import { ItemEditor } from "./li";

const HeadingEditor = (size: number) => (props: any) => {
  return <SimpleEditor text={`${"#".repeat(size)} ${props.children}`} />;
};

const MarkdownJsxComponents = {
  TableOfContent: Fragment,
  h1: HeadingEditor(1),
  h2: HeadingEditor(2),
  h3: HeadingEditor(3),
  h4: HeadingEditor(4),
  h5: HeadingEditor(5),
  h6: HeadingEditor(6),
  li: ItemEditor,
  ul: (props: any) => <ul {...props} className={`${props.className} list-inside list-disc my-4`} />,
  ol: (props: any) => <ul {...props} className={`${props.className} list-inside list-disc my-4`} />,
  p: (props: any) => (
    <div className="my-4">
      <SimpleEditor text={props.children}></SimpleEditor>
    </div>
  ),
};

export const RichEditor = (source: MDXRemoteProps) => {
  return <MDXRemote {...source} scope={source.scope} components={MarkdownJsxComponents} />;
};
