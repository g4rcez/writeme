import { Strings } from "lib/strings";
import React, { useEffect, useState, VFC } from "react";

const Tags = {
  H2: "ml-0",
  H3: "ml-4",
  H4: "ml-8",
  H5: "ml-12",
  H6: "ml-16",
};

type Tag = keyof typeof Tags;

type Heading = {
  text: string;
  id: string;
  tag: Tag;
};

type Props = {
  id?: string;
  className?: string;
  observeHash?: boolean;
};

export const TableOfContent: VFC<Props> = ({ id = "document-root", observeHash = false, className = "" }) => {
  const [titles, setTitles] = useState<Heading[]>([]);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const root = document.getElementById(id);
    if (root === null) return;
    const createTableContent = () => {
      if (root === null) return;
      const headers: HTMLHeadingElement[] = Array.from(root.querySelectorAll("h2, h3, h4, h5, h6"));
      setTitles(
        headers
          .filter((x) => x.dataset.toc !== "false")
          .map((x) => {
            const textContent = x.textContent!;
            const text = x.dataset.text ?? textContent;
            const id = Strings.slug(textContent);
            x.id = id;
            return {
              text,
              id,
              tag: x.tagName as Tag,
            };
          })
      );
    };
    createTableContent();
    const observer = new MutationObserver(createTableContent);
    observer.observe(root, { subtree: true, childList: true });
    return () => {
      observer.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (!observeHash) return;
    const onChangeHash = () => setHash((window.location.hash ?? "").replace(/^#/, ""));
    window.addEventListener("hashchange", onChangeHash);
    return () => window.removeEventListener("hashchange", onChangeHash);
  }, [observeHash]);

  return (
    <header className={`table-of-content ${className}`}>
      <nav>
        <ul className="list-inside">
          {titles.map((x) => (
            <li
              key={x.id}
              className={`table-of-content-item ${hash === x.id && observeHash ? "text-blue-600 font-extrabold" : ""} ${
                Tags[x.tag]
              }`}
            >
              <a className="w-fit hover:underline" href={`#${x.id}`}>
                {x.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
