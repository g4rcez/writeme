import { Strings } from "lib/strings";
import { useEffect, useState } from "react";
import { useMdxDocs } from "./mdx-docs.context";

const Tags = {
  H2: "ml-0",
  H3: "ml-8",
  H4: "ml-16",
  H5: "ml-24",
  H6: "ml-32",
};

type Tag = keyof typeof Tags;

type Heading = {
  text: string;
  id: string;
  tag: Tag;
};

export const TableOfContent = () => {
  const [titles, setTitles] = useState<Heading[]>([]);
  const { root } = useMdxDocs();

  useEffect(() => {
    if (root === null) return;
    const headers: HTMLHeadingElement[] = Array.from(
      root.querySelectorAll("h2,h3,h4,h5,h6")
    );
    setTitles(
      headers.map((x) => {
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
  }, [root]);

  return (
    <header>
      <nav>
        <ul className="list-inside">
          {titles.map((x) => (
            <li
              key={x.id}
              className={`my-1 duration-500 hover:underline list-none ${
                Tags[x.tag]
              }`}
            >
              <a className="w-fit" href={`#${x.id}`}>
                {x.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
