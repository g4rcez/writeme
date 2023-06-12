import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { Fragment, useMemo } from "react";
import { SimpleEditor } from "../editor/simple-editor";
import { ItemEditor } from "./li";
import { TextResolver } from "../editor/resolver";
import dynamic from "next/dynamic";

const Pre = dynamic(() => import("./code/pre"));

const HeadingEditor = (size: number) => (props: any) => <SimpleEditor text={`${"#".repeat(size)} ${props.children}`} />;

export const RichEditor = (source: MDXRemoteProps) => {
  const map = useMemo(() => {
    return {
      Pre,
      TableOfContent: Fragment,
      Playground: Fragment,
      Tab: Fragment,
      Tabs: Fragment,
      h1: HeadingEditor(1),
      h2: HeadingEditor(2),
      h3: HeadingEditor(3),
      h4: HeadingEditor(4),
      h5: HeadingEditor(5),
      h6: HeadingEditor(6),
      li: ItemEditor,
      ul: (props: any) => <ul {...props} className={`${props.className} list-inside list-disc`} />,
      ol: (props: any) => <ol {...props} className={`${props.className} list-inside list-decimal`} />,
      p: (props: any) => (
        <div className="my-4">
          <TextResolver children={props.children}></TextResolver>
        </div>
      ),
    };
  }, [source]);

  return (
    <div className="flex w-full flex-col flex-wrap gap-8">
      <MDXRemote {...source} scope={source.scope} components={map} />
    </div>
  );
};
