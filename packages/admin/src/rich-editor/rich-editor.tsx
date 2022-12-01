import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { Fragment, useMemo } from "react";
import { SimpleEditor } from "../editor/simple-editor";
import { ItemEditor } from "./li";
import { TextResolver } from "../editor/resolver";

const HeadingEditor = (size: number) => (props: any) => <SimpleEditor text={`${"#".repeat(size)} ${props.children}`} />;

export const RichEditor = (source: MDXRemoteProps) => {
  const map = useMemo(() => {
    return {
      TableOfContent: Fragment,
      Playground: Fragment,
      Pre: (props: any) => {
        console.log(props);
        return props.code;
      },
      Tab: Fragment,
      Tabs: Fragment,
      h1: HeadingEditor(1),
      h2: HeadingEditor(2),
      h3: HeadingEditor(3),
      h4: HeadingEditor(4),
      h5: HeadingEditor(5),
      h6: HeadingEditor(6),
      li: ItemEditor,
      ul: (props: any) => <ul {...props} className={`${props.className} list-inside list-disc my-4`} />,
      ol: (props: any) => <ol {...props} className={`${props.className} list-inside list-decimal my-4`} />,
      p: (props: any) => (
        <div className="my-4">
          <TextResolver children={props.children}></TextResolver>
        </div>
      ),
    };
  }, [source]);

  return <MDXRemote {...source} scope={source.scope} components={map} />;
};
