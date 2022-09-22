import { Strings } from "src/lib/strings";
import { PropsWithChildren, useEffect, useState } from "react";

const Tags = {
  h1: "ml-0",
  h2: "ml-8",
  h3: "ml-16",
  h4: "ml-24",
  h5: "ml-32",
  h6: "ml-40",
};

type Tag = keyof typeof Tags;

type Heading = {
  text: string;
  id: string;
  tag: Tag;
  top: number;
};

type Props = {
  markHighlight?: boolean;
  id?: string;
  className?: string;
  observeHash?: boolean;
};

export const TableOfContent = ({
  id = "document-root",
  children,
  observeHash = true,
  className = "",
  markHighlight = false,
}: PropsWithChildren<Props>) => {
  const [titles, setTitles] = useState<Heading[]>([]);
  const [highlight, setHighlight] = useState("");
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
          .map((x, index) => {
            const textContent = x.textContent!;
            const text = x.dataset.text ?? textContent;
            const id = Strings.slug(textContent) + "-" + index;
            x.id = id;
            return { id, text, tag: x.dataset.tag as Tag, top: x.getBoundingClientRect().top };
          })
      );
    };
    createTableContent();
    const observer = new MutationObserver(createTableContent);
    observer.observe(root, { subtree: true, childList: true });
    return () => observer.disconnect();
  }, [id]);

  useEffect(() => {
    if (!markHighlight || titles.length === 0) return;
    const scroll = () => {
      const axisY = Math.max(window.scrollY, 0);
      let current = titles[0].id;
      const innerHeight = window.innerHeight;
      if (axisY === 0) {
        return setHighlight(current);
      }
      if (axisY + innerHeight >= document.body.scrollHeight) {
        return setHighlight(titles[titles.length - 1].id);
      }
      const len = titles.length;
      for (let i = 0; i < len; i++) {
        if (axisY + innerHeight / 5 >= titles[i].top) {
          current = titles[i].id;
        }
      }
      setHighlight(current);
    };
    const options = { capture: true } as const;
    scroll();
    window.addEventListener("scroll", scroll, options);
    return () => window.removeEventListener("scroll", scroll, options);
  }, [titles, markHighlight]);

  useEffect(() => {
    if (!observeHash) return;
    const onChangeHash = () => setHash((window.location.hash ?? "").replace(/^#/, ""));
    onChangeHash();
    window.addEventListener("hashchange", onChangeHash);
    return () => window.removeEventListener("hashchange", onChangeHash);
  }, [observeHash]);

  if (titles.length === 0) {
    return null;
  }

  return (
    <header className={`${className} my-8 py-4 dark:border-zinc-700 border-zinc-200 border-b border-t`}>
      {children}
      <nav>
        <ul className="list-inside ml-4 text-sm">
          {titles.map((x) => (
            <li
              key={x.id}
              className={`table-of-content-item my-2 ${
                (hash === x.id && observeHash) || (highlight === x.id && markHighlight)
                  ? "text-main-500 font-extrabold"
                  : ""
              } ${Tags[x.tag]}`}
            >
              <a className="w-fit hover:underline" data-unstyled="true" href={`#${x.id}`}>
                {x.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
