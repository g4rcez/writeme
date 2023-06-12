import { useRouter } from "next/router";
import { Markdown, MarkdownJsx, MdxDocsProvider } from "@writeme/markdown";
import { Dates, Types } from "@writeme/core";
import { DocumentNavigation } from "@writeme/lego";
import { Domain } from "@writeme/api";
import { writeme } from "../../writeme";
import { Sidebar } from "../../components/sidebar";
import { SideToc } from "../../components/side-toc";

type Props = {
  categories: Domain.Category[];
  groups: Domain.CategoryDocuments[];
  mdx: Markdown.MdxProcessed;
  next: Types.Nullable<Domain.DocumentDesc>;
  post: Domain.Document;
  previous: Types.Nullable<Domain.DocumentDesc>;
};

export const getStaticPaths = writeme.documentsPageGetStaticPaths();

export const getStaticProps = writeme.documentsPageGetStaticProps();

const providerValue = { theme: "light", titlePrefix: "WriteMe" };

export default function Component({ mdx, post, groups, next, previous }: Props) {
  const router = useRouter();
  return (
    <div className="container mx-auto flex w-full max-w-7xl flex-row gap-4">
      <Sidebar groups={groups} pathname={router.query.title as string} />
      <main className="container w-full flex-1 grow p-2 px-6 lg:px-0">
        <header className="mt-2">
          <h1 className="text-5xl font-extrabold lining-nums leading-loose">{post.title}</h1>
          {post.description && <p className="text-text-paragraph mb-2 text-base">{post.description}</p>}
          <p className="text-text-text-normal text-sm">
            <time dateTime={Dates.localeDate(post.createdAt)}>{Dates.localeDate(post.createdAt)}</time>
          </p>
        </header>
        <section className="markdown flex w-full max-w-full flex-col flex-wrap" id="document-root">
          <MdxDocsProvider value={providerValue}>
            <MarkdownJsx {...mdx} />
          </MdxDocsProvider>
        </section>
        <DocumentNavigation next={next} previous={previous} />
      </main>
      <SideToc />
    </div>
  );
}
