import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Markdown, MarkdownJsx, MdxDocsProvider } from "@writeme/markdown";
import { Dates, Links, Types } from "@writeme/core";
import { DocumentNavigation } from "@writeme/lego";
import { Domain } from "@writeme/api";
import { writeme } from "../../src/writeme";

type Props = {
  categories: Domain.Category[];
  groups: Domain.CategoryDocuments[];
  mdx: Markdown.MdxProcessed;
  next: Types.Nullable<Domain.DocumentDesc>;
  post: Domain.Document;
  previous: Types.Nullable<Domain.DocumentDesc>;
};

export const Sidebar = ({ pathname, groups }: Types.Only<Props, "groups"> & { pathname: string }) => {
  const [filter, setFilter] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const ref = input.current;
    setFilter("");
    if (ref === null) return;
    const focus = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.stopPropagation();
        event.preventDefault();
        ref.focus();
      }
    };
    window.addEventListener("keydown", focus);
    return () => window.removeEventListener("keydown", focus);
  }, [router.asPath]);

  return (
    <aside className="fixed left-4 w-72 hidden md:block pt-7">
      <input
        ref={input}
        value={filter}
        placeholder="Search...CTRL+K"
        onChange={(e) => setFilter(e.target.value)}
        className="p-2 rounded-lg mb-6 placeholder-slate-400 bg-transparent border border-slate-700"
      />
      {groups.map((group) => {
        const list =
          filter === ""
            ? group.documents
            : group.documents.filter((document) =>
                document.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
              );
        return list.length === 0 ? null : (
          <nav className="mb-4" key={`${group.category.url}-group-category`}>
            <h3 className="font-medium text-lg mb-4">
              <Link href={Links.toDoc(group.category.url)} passHref>
                {group.category.title}
              </Link>
            </h3>
            <ul className="ml-4">
              {list.map((document) => (
                <li key={document.url} className="mb-2 font-thin">
                  <Link
                    className={`my-4 link:underline ${document.url === pathname ? "text-main-500" : ""}`}
                    href={Links.toDoc(document.url)}
                    passHref
                  >
                    {document.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        );
      })}
    </aside>
  );
};

export const getStaticPaths = writeme.documentsPageGetStaticPaths();

export const getStaticProps = writeme.documentsPageGetStaticProps();

const providerValue = { theme: "light", titlePrefix: "WriteMe" };

export default function Component({ mdx, post, groups, next, previous }: Props) {
  const router = useRouter();
  return (
    <div className="mx-auto w-full">
      <Sidebar groups={groups} pathname={router.query.title as string} />
      <main className="w-full mx-auto container pl-8 pr-8 md:pl-72 max-w-8xl">
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
