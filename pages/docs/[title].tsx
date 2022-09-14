import { MdxDocsProvider, SiteContainer } from "src/components/";
import { GetStaticPaths, GetStaticProps } from "next";
import { strategy } from "../../src/strategies/main.strategy";
import { Dates } from "../../src/lib/dates";
import { Markdown } from "../../src/lib/markdown";
import { MarkdownDocument } from "../../src/strategies/strategy";
import { Writeme } from "../../src/lib/writeme";
import { MarkdownJsx } from "../../src/components/markdown-jsx";

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await strategy.getAllDocumentPaths();
  return {
    fallback: false,
    paths: docs.map((title) => ({ params: { title } }))
  };
};

type Props = {
  post: MarkdownDocument;
  mdx: Markdown.MdxProcessed
}

export const getStaticProps: GetStaticProps<Props> = async (props) => {
  const title = props.params?.title as string;
  try {
    const post = await strategy.getDocument(title);
    if (post === null) {
      return { notFound: true };
    }
    const scope = {
      ...post.frontMatter,
      ...Writeme.config?.requestVariables,
      ...Writeme.config,
      repository: post.frontMatter.repository ?? ""
    };
    const mdx = await Markdown.process(post.content, scope);
    return { props: { post, mdx }, revalidate: false };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(error);
      throw error;
    }
    return { notFound: true };
  }
};

const providerValue = { theme: "light", titlePrefix: "WriteMe" };

export default function Component({ mdx, post }: Props) {
  return (
    <SiteContainer tag="section">
      <div className="mx-auto xl:max-w-none">
        <main className="markdown">
          <header className="my-4">
            <h1 className="text-5xl leading-tight lining-nums font-extrabold text-text-title">{post.title}</h1>
            <p className="text-base text-text-paragraph mb-2">{post.description}</p>
            <p className="text-sm text-text-text-normal">
              <time dateTime={Dates.localeDate(post.createdAt)}>{Dates.localeDate(post.createdAt)}</time>
            </p>
          </header>
          <MdxDocsProvider value={providerValue}>
            <section className="markdown w-full max-w-full flex flex-col flex-wrap" id="document-root">
              <MarkdownJsx {...mdx} />
            </section>
          </MdxDocsProvider>
        </main>
      </div>
    </SiteContainer>
  );
}
