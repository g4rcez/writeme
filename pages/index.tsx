import { SiteContainer } from "components/container";
import Link from "next/link";
import React from "react";

const Paragraph: React.FC = ({ children }) => (
  <p className="break-words whitespace-pre-line max-w-prose leading-loose text-lg mb-2 dark:text-main-slight">
    {children}
  </p>
);

const H2: React.FC = ({ children }) => (
  <h2 className="text-3xl text-text-paragraph dark:text-text-title font-extrabold leading-loose mb-2">{children}</h2>
);

export default function Home() {
  return (
    <main>
      <section className="w-full text-text-slight dark:text-text-title dark:bg-transparent bg-text-title py-36">
        <SiteContainer className="px-36 text-center flex items-center flex-col gap-y-4">
          <h2 className="text-4xl font-extrabold text-center">Write docs and forget configuration</h2>
          <div className="flex gap-x-4 flex-row text-center items-center">
            <Link href="/docs/getting-started">Getting Started</Link>
            <Link href="/docs/example">View all features</Link>
          </div>
        </SiteContainer>
      </section>
      <section className="my-12 w-full container mx-auto flex flex-row flex-wrap justify-center text-center gap-x-8 flex-1">
        <article className="flex flex-col">
          <H2>Write Markdown or MDX</H2>
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
        </article>
        <article className="flex flex-col">
          <H2>Blog</H2>
          <Paragraph>
            What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry{"'"}s standard dummy text ever since the 1500s, when an unknown printer took a
          </Paragraph>
        </article>
      </section>
    </main>
  );
}
