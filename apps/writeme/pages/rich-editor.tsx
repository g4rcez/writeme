import { RichEditor } from "@writeme/admin";
import { writeme } from "../src/writeme";
import { Markdown } from "@writeme/markdown";
import { InferGetStaticPropsType } from "next";

export const getStaticProps = async () => {
  const post = await writeme.document.getById("test");
  if (post === null) {
    return { notFound: true };
  }
  const mdx = await Markdown.process(post.content, {});
  const result = { post, mdx };
  return { props: result };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function EditorPage(props: Props) {
  return (
    <div className="w-full container mx-auto">
      <RichEditor {...props.mdx} />
    </div>
  );
}
