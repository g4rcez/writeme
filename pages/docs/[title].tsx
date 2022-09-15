import { MdxDocsProvider } from "src/components/";
import { GetStaticPaths, GetStaticProps } from "next";
import { strategy } from "../../src/strategies/main.strategy";
import { Dates } from "../../src/lib/dates";
import { Markdown } from "../../src/lib/markdown";
import { Categories, DocumentsJoinCategory, MarkdownDocument } from "../../src/strategies/strategy";
import { Writeme } from "../../src/lib/writeme";
import { MarkdownJsx } from "../../src/components/markdown-jsx";
import Link from "next/link";
import { Links } from "../../src/lib/links";

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await strategy.getAllDocumentPaths();
  return {
    fallback: false,
    paths: docs.map((title) => ({ params: { title } })),
  };
};

type Props = {
  categories: Categories[];
  post: MarkdownDocument;
  mdx: Markdown.MdxProcessed;
  groups: DocumentsJoinCategory[];
};

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
      repository: post.frontMatter.repository ?? "",
    };
    const mdx = await Markdown.process(post.content, scope);
    const categories = await strategy.getCategories();
    const simplerDocuments = await strategy.getSimplerDocuments();
    const groups = strategy.aggregateDocumentToCategory(categories, simplerDocuments);
    return { props: { post, categories, mdx, groups }, revalidate: false };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(error);
      throw error;
    }
    return { notFound: true };
  }
};

const providerValue = { theme: "light", titlePrefix: "WriteMe" };

export default function Component({ mdx, post, groups }: Props) {
  return (
    <div className="mx-auto w-full">
      <aside className="fixed left-4 w-72 hidden sm:block pt-6">
        {groups.map((group) => (
          <nav className="mb-4" key={`${group.category.url}-group-category`}>
            <h3 className="font-medium text-lg mb-4">
              <Link href={Links.toDoc(group.category.url)} passHref>
                <a href={Links.toDoc(group.category.url)}>{group.category.title}</a>
              </Link>
            </h3>
            <ul className="ml-4">
              {group.documents.map((document) => (
                <li key={document.url} className="mb-2 font-thin">
                  <Link href={Links.toDoc(document.url)} passHref>
                    <a className="my-4 link:underline" href={Links.toDoc(document.url)}>
                      {document.title}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </aside>
      <main className="w-full mx-auto container col-span-6 pl-0 sm:pl-48 max-w-7xl">
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
  );
}
