import { MdxDocsProvider } from "src/components/";
import { GetStaticPaths, GetStaticProps } from "next";
import { strategy } from "../../src/strategies/main.strategy";
import { Dates } from "../../src/lib/dates";
import { Markdown } from "../../src/lib/markdown";
import { Categories, DocumentsJoinCategory, MarkdownDocument, SimplerDocument } from "../../src/strategies/strategy";
import { Writeme } from "../../src/lib/writeme";
import { MarkdownJsx } from "../../src/components/markdown-jsx";
import Link from "next/link";
import { Links } from "../../src/lib/links";
import { useRouter } from "next/dist/client/router";
import { DocumentNavigation } from "../../src/components/document-navigation";

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await strategy.getAllDocumentPaths();
  return {
    fallback: false,
    paths: docs.map((title) => ({ params: { title } })),
  };
};

type Props = {
  categories: Categories[];
  groups: DocumentsJoinCategory[];
  mdx: Markdown.MdxProcessed;
  next: Types.Nullable<SimplerDocument>;
  post: MarkdownDocument;
  previous: Types.Nullable<SimplerDocument>;
};

export const Sidebar = ({ pathname, groups }: Types.Only<Props, "groups"> & { pathname: string }) => (
  <aside className="fixed left-4 w-72 hidden sm:block pt-7">
    <input
      className="p-2 rounded-lg mb-6 placeholder-slate-400 bg-transparent border border-slate-700"
      placeholder="Search...CTRL+K"
    />
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
                <a
                  href={Links.toDoc(document.url)}
                  className={`my-4 link:underline ${document.url === pathname ? "text-main-500" : ""}`}
                >
                  {document.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    ))}
  </aside>
);

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
    const groupIndex = groups.findIndex((x) => x.category.id === post.category);
    const group = groups[groupIndex];
    const current = group?.documents.sort((a, b) => a.index - b.index).findIndex((x) => x.url === post.url) ?? -1;
    const previousGroup = groups[groupIndex - 1];
    const lastOfPreviousGroup = previousGroup?.documents[previousGroup?.documents.length - 1];
    const previous = group?.documents[current - 1] ?? lastOfPreviousGroup ?? null;
    const firstOfNextGroup = groups[groupIndex + 1]?.documents[0];
    const next = group?.documents[current + 1] ?? firstOfNextGroup ?? null;
    return {
      props: { post, categories, mdx, groups, next: next, previous: previous },
      revalidate: false,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(error);
      throw error;
    }
    return { notFound: true };
  }
};

const providerValue = { theme: "light", titlePrefix: "WriteMe" };

export default function Component({ mdx, post, groups, next, previous }: Props) {
  const router = useRouter();
  return (
    <div className="mx-auto w-full">
      <Sidebar groups={groups} pathname={router.query.title as string} />
      <main className="w-full mx-auto container pl-0 pr-0 sm:pl-24 sm:pr-4 max-w-7xl">
        <header className="my-4">
          <h1 className="text-5xl leading-loose lining-nums font-extrabold">{post.title}</h1>
          {post.description && <p className="text-base text-text-paragraph mb-2">{post.description}</p>}
          <p className="text-sm text-text-text-normal">
            <time dateTime={Dates.localeDate(post.createdAt)}>{Dates.localeDate(post.createdAt)}</time>
          </p>
        </header>
        <MdxDocsProvider value={providerValue}>
          <section className="markdown w-full max-w-full flex flex-col flex-wrap" id="document-root">
            <MarkdownJsx {...mdx} />
          </section>
        </MdxDocsProvider>
        <DocumentNavigation next={next} previous={previous} />
      </main>
    </div>
  );
}