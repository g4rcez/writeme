import { SiteContainer } from "components/container";
import { Writeme } from "lib/writeme";
import { GetStaticProps } from "next";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      docs: [],
    },
  };
};

export default function DocsIndex({ docs }: { docs: Writeme.DocumentItem[] }) {
  return (
    <SiteContainer>
      {docs.map((document) => (
        <article className="w-full block my-6" key={`article-${document.sidebar}`}>
          <header className="text-2xl font-extrabold capitalize">
            <h2>{document.name}</h2>
          </header>
          <section className="w-full flex flex-wrap gap-8 mt-4">
            {document.items.map((item) => (
              <Link passHref href={item.link} key={item.title}>
                <a
                  href=""
                  className="hover:underline hover:text-main-normal border border-border-neutral hover:border-main-hover-border transition-colors duration-500 ease-out p-4 rounded-lg min-w-[250px] max-w-xs"
                >
                  <section>
                    <h3 className="text-lg">{item.title}</h3>
                    <p className="text-sm mt-2">{item.description}</p>
                  </section>
                </a>
              </Link>
            ))}
          </section>
        </article>
      ))}
    </SiteContainer>
  );
}
