import { Links } from "@writeme/core";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Domain } from "@writeme/api";

type Props = {
  groups: Domain.CategoryDocuments[];
  pathname: string;
};

export const Sidebar = ({ pathname, groups }: Props) => {
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
    <aside className="min-w-xs relative hidden w-72 lg:block lg:w-72">
      <div className="fixed left-0 top-24 w-72 px-8">
        {groups.map((group) => {
          const list =
            filter === ""
              ? group.documents
              : group.documents.filter((document) =>
                  document.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
                );
          return list.length === 0 ? null : (
            <nav className="mb-4" key={`${group.category.url}-group-category`}>
              <h3 className="mb-2 text-lg font-medium">
                <Link href={Links.toDoc(group.category.url)} passHref>
                  {group.category.title}
                </Link>
              </h3>
              <ul className="ml-2 space-y-2">
                {list.map((document) => (
                  <li key={document.url}>
                    <Link
                      className={`link:underline my-4 ${document.url === pathname ? "text-main-500" : ""}`}
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
      </div>
    </aside>
  );
};
