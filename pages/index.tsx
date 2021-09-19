import { SiteContainer } from "components/container";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="w-full bg-gray-500 text-white py-36">
        <SiteContainer className="px-36 text-center flex items-center flex-col gap-y-4">
          <h2 className="text-4xl font-extrabold text-center">Write docs and forget configuration</h2>
          <div className="flex gap-x-4 flex-row text-center items-center">
            <Link href="/docs/getting-started">Getting Started</Link>
            <Link href="/docs/example">View all features</Link>
          </div>
        </SiteContainer>
      </section>
      <section className="my-12 w-full container mx-auto flex flex-row justify-center text-center gap-x-8 flex-1">
        <article className="flex flex-col prose lg:prose-lg">
          <h2 className="text-2xl text-gray-600 font-extrabold leading-relaxed">Write Markdown or MDX</h2>
          <ul className="list-inside list-disc ml-4">
            <p className="break-words whitespace-pre-line max-w-prose">
              Built with <a href="https://nextjs.org">NextJS</a>. Support{" "}
              <a href="https://github.com/remarkjs/remark-gfm">Github Flavored Markdown</a>. Support emoji with{" "}
              <a href="https://github.com/remarkjs/remark-gemoji">remark-emoji</a>. Use{" "}
              <a href="https://github.com/hashicorp/next-mdx-remote">next-mdx-remote</a> to support MDX syntax
              Interactive playground with <a href="https://github.com/FormidableLabs/react-live">react-live</a>
            </p>
          </ul>
        </article>
        <article className="flex flex-col prose lg:prose-lg">
          <h2 className="text-2xl text-gray-600 font-extrabold leading-relaxed">Blog</h2>
          <ul className="list-inside list-disc ml-4">
            <p className="break-words whitespace-pre-line max-w-prose">
              What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry{"'"}s standard dummy text ever since the 1500s, when an unknown printer took a
            </p>
          </ul>
        </article>
      </section>
    </main>
  );
}
