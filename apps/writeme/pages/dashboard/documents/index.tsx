import { GetStaticProps } from "next";
import Link from "next/link";
import { postsService, VitrineDocument } from "@writeme/services";
import { Card, Heading } from "@writeme/lego";
import { Dates, Links } from "@writeme/core";

type Props = {
  documents: VitrineDocument[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const documents = await postsService.getAll();
  return {
    revalidate: 20,
    props: { documents },
  };
};

export default function DashboardIndexPage({ documents }: Props) {
  return (
    <div className="container w-full mx-auto mt-8">
      <Heading tag="h1" className="text-3xl mb-4">
        Documents
      </Heading>
      <ul className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {documents.map((x) => {
          const date = Dates.localeDate(x.createdAt);
          const link = Links.dashboard.document(x.id);
          return (
            <Card as="li" key={x.id} className="">
              <Heading tag="h2" className="text-3xl">
                <Link href={link} passHref>
                  <a className="link:text-main-500 transition-colors duration-300" href={link}>
                    {x.title}
                  </a>
                </Link>
              </Heading>
              <p className={x.description ? "opacity-70 my-4" : "opacity-40 my-4"}>
                {x.description || "- No description -"}
              </p>
              <time datatype={date}>{date}</time>
            </Card>
          );
        })}
      </ul>
    </div>
  );
}
