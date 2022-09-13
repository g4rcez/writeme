import React, { PropsWithChildren } from "react";

const Paragraph = ({ children }: PropsWithChildren) => (
  <p className="break-words whitespace-pre-line max-w-prose leading-loose text-lg mb-2 dark:text-main-slight">
    {children}
  </p>
);

const H2 = ({ children }: PropsWithChildren) => (
  <h2 className="text-3xl text-text-paragraph dark:text-text-title font-extrabold leading-loose mb-2">{children}</h2>
);

const sections = [
  {
    title: "Write Markdown or MDX",
    body: (
      <Paragraph>
        Built with{" "}
        <a className="link" href="https://nextjs.org">
          NextJS
        </a>
        . Support{" "}
        <a className="link" href="https://github.com/remarkjs/remark-gfm">
          Github Flavored Markdown
        </a>
        . Support emoji with{" "}
        <a className="link" href="https://github.com/remarkjs/remark-gemoji">
          remark-emoji
        </a>
        . Use{" "}
        <a className="link" href="https://github.com/hashicorp/next-mdx-remote">
          next-mdx-remote
        </a>{" "}
        to support MDX syntax Interactive playground with{" "}
        <a className="link" href="https://github.com/FormidableLabs/react-live">
          react-live
        </a>
      </Paragraph>
    ),
  },
  {
    title: "Database or Local",
    body: (
      <Paragraph>
        You can write your docs local or using a database and work async with your team. Writeme has two default
        strategies to read/write your docs and you can write your own strategy to work with anything
      </Paragraph>
    ),
  },
];

export default function Home() {
  return (
    <main>
      <section className="my-12 w-full container mx-auto flex flex-wrap justify-center text-center gap-x-8 flex-1">
        {sections.map((section) => (
          <article key={section.title} className="flex flex-col">
            <H2>{section.title}</H2>
            {section.body}
          </article>
        ))}
      </section>
    </main>
  );
}
